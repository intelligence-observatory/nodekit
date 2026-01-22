# nodekit-rs

## Setup

1. [Install Rust](https://rust-lang.org/tools/install/)
2. [Install uv](https://docs.astral.sh/uv/)
3. Activate Python venv
4. In the root directory of `nodekit`, run one of the following:
   ```sh
   # Install nodekit and nodekit-rs
   make build
   ```
   or
   ```sh
   # Install nodekit-rs
   make build-rs
   ```
   
### Why `make build-rs` is so slow

The first time you install `nodekit-rs`, it will take a long time (a few minutes on MacOS and Linux, longer on Windows) and generate approximately 5.5 GB of cached build artifacts in the `target/` directory. Subsequent reinstalls of `nodekit-rs` will be much faster.

You can remove the cached build artifacts by running:

```sh
cd nodekit-rs
cargo clean
```

...but then the next reinstall will take just as much time as the first install.

The compiled library file is *much* smaller than the build artifacts (approximately 44 MB) and is located in your venv.

### Update `nodekit-rs`

Any time you make changes to `nodekit-rs`, you must rerun `make build-rs`.

If you change the Python-facing API, you must regenerate `nodekit_rs.pyi` by running:

```sh
make nodekit-rs-stub-gen
```

## Usage

### Render

```python
import nodekit as nk

card = get_card()  # Your code here. Can be a CompositeCard.
sensor = get_sensor()  # Your code here.

state = nk.experimental.renderer.State(
    board_color="#AAAAAAFF",
    card=card, 
    sensor=sensor
)

renderer = nk.experimental.renderer.Renderer()
board = renderer.render(state)
```

`board` is a numpy array of an RGB24 bitmap. Data type is `np.uint8`. Shape is `(1024, 1024, 3)`.

### Render in-place

You can, optionally, render to an existing numpy array, which will result in a small performance improvement:

```python
import nodekit as nk

card = get_card()
sensor = get_sensor()
state = nk.experimental.renderer.State(
    board_color="#AAAAAAFF",
    card=card, 
    sensor=sensor
)

renderer = nk.experimental.renderer.Renderer()

board = renderer.empty_board()  # Get an empty board (a numpy array).

for i in range(100):
    renderer.render_to(state, board)  # Render into the pre-allocated `board`.
```

### Pointer position

To set the pointer position, call `state.set_pointer(x, y)` where `x` and `y` are ints between -512 and 512:

```python
import nodekit as nk

card = get_card()  # Your code here. Can be a CompositeCard.
sensor = get_sensor()  # Your code here.
state = nk.experimental.renderer.State(
    board_color="#AAAAAAFF",
    card=card, 
    sensor=sensor
)
state.set_pointer(0, -100)
```

### Video seeking

If there are video cards, you will need to manually set the current time, in milliseconds:

```python
import nodekit as nk

card = get_card()  # Your code here. Can be a CompositeCard.
sensor = get_sensor()  # Your code here.
state = nk.experimental.renderer.State(
    board_color="#AAAAAAFF",
    card=card,
    sensor=sensor
)
state.t_msec = 300
```

### Sensors

`nodekit-rs` will accept any sensor type, but will fail silently for most of them.

For example, this is valid code:

```python
import nodekit as nk

card = get_card()  # Your code here. Can be a CompositeCard.
sensor = nk.sensors.WaitSensor(duration_msec=10000)

state = nk.experimental.renderer.State(
    board_color="#AAAAAAFF",
    card=card,
    sensor=sensor
)
state.t_msec = 300

renderer = nk.experimental.renderer.Renderer()
board = renderer.render(state)
```

`nodekit-rs` currently supports graphical renderings of:

- `SelectSensor`
- `MultiSelectSensor`

#### Hovering

To graphically render cards that are being hovered over, set the sensor as `SelectSensor` or `MultiSelectSensor` and then call `state.hover(choice)`.

`nodekit-rs` will not check the actual position of the pointer.

```python
import nodekit as nk

card = get_card()  # Your code here.
sensor = nk.sensors.SelectSensor(choices={
    'a': get_another_card()  # Your code here.
})
state = nk.experimental.renderer.State(
    board_color="#AAAAAAFF", 
    card=card,
    sensor=sensor
)
state.hover('a')
```

To stop rendering any hovering overlays, call `state.hover(None)`

#### Selecting

To graphically render a selected card, set the sensor as a `MultiSelectSensor` and call `state.set_selection(choice, select)` where `choice` is a valid key in `MultiSelectSensor.choices` and `select` is a boolean that will (de)select the card(s).

If you call `state.select(choice, select)` and the sensor is a `SelectSensor`, the call will fail silently. All other sensor types will throw an exception.

## What works, what doesn't

**`nodekit-rs` is in alpha.** The goal is to faithfully replicate `nodekit-browser`. In some cases, the replication isn't exact. In other cases, features are missing.

ImageCard, VideoCard, and CompositeCard card should always look the same as they would in a browser.

TextCard is WIP. Markdown formatting is supported. Colorized words are supported (but not in `nodekit-browser`). There are minor kerning problems with list items.

Pointer rendering is supported but might not be the same as in the browser.

Most sensors are not yet implemented.

## Test

Run unit tests:

```bash
cd nodekit-rs
cargo test --all
```

Python tests are in `py-examples/`. Run `multiframe.py` and `node_test.py` and view the output.

## Benchmark

Run Rust benchmarks:

```bash
cd nodekit-rs
cargo bench --all
```

Run Python-to-Rust test:

```bash
cd nodekit-rs/py-examples
python benchmark.py
```

## Architecture

![](images/nodekit-rs.png)