# nodekit-rs

## Setup

1. [Install Rust](https://rust-lang.org/tools/install/)
2. [Install uv](https://docs.astral.sh/uv/)
3. Activate Python venv
4. `./develop.sh`

The first time you run `develop.sh`, it will take a while to compile `nodekit-rs` and will generate a approximately 5.5 GB of cached build artifacts. These artifacts allow the compiler to be *much* faster on subsequent usages. You can free up that space by running `cargo clean`, but then `develop.sh` will be slow the next time you run it.
ls
The size of the final library file should be approximately 44 MB.

## Usage

### Render

```python
from nodekit_rs import Renderer, State

card = get_card()  # Your code here. Can be a CompositeCard.
sensor = get_sensor()  # Your code here.
state = State(board_color="#AAAAAAFF", sensor=sensor)

renderer = Renderer()
board = renderer.render(state)
```

`board` is a numpy array of an RGB24 bitmap. Data type is `np.uint8`. Shape is `(1024, 1024, 3)`.

### Render in-place

You can, optionally, render to an existing numpy array, which will result in a small performance improvement:

```python
from nodekit_rs import Renderer, State

card = get_card()
sensor = get_sensor()
state = State(board_color="#AAAAAAFF", card=card, sensor=sensor)

renderer = Renderer()

board = renderer.empty_board()  # Get an empty board (a numpy array).

for i in range(100):
    renderer.render_to(state, board)  # Render into the pre-allocated `board`.
```

### Pointer position

To set the pointer position, call `state.set_pointer(x, y)` where `x` and `y` are ints between -512 and 512:

```python
from nodekit_rs import State

card = get_card()
sensor = get_sensor()
state = State(board_color="#AAAAAAFF", card=card, sensor=sensor)
```

### Video seeking

If there are video cards, you will need to manually set the current time, in milliseconds:

```python
from nodekit_rs import State

card = get_card()
sensor = get_sensor()
state = State(board_color="#AAAAAAFF", card=card, sensor=sensor)
state.t_msec = 300
```

### Sensors

`nodekit-rs` will accept any sensor type, but will fail silently for most of them.

For example, this is valid code:

```python
import nodekit as nk
from nodekit_rs import State

card = get_card()  # Your code here.
sensor = nk.sensors.WaitSensor(duration_msec=10000)
state = State(board_color="#AAAAAAFF", card=card, sensor=sensor)
```

`nodekit-rs` currently supports graphical renderings of:

- `SelectSensor`
- `MultiSelectSensor`

#### Hovering

To graphically render cards that are being hovered over, set the sensor as `SelectSensor` or `MultiSelectSensor` and then call `state.hover(choice)`.

`nodekit-rs` will not check the actual position of the pointer.

```python
import nodekit as nk
from nodekit_rs import State

card = get_card()  # Your code here.
sensor = nk.sensors.SelectSensor(choices={
    'a': get_another_card()  # Your code here.
})
state = State(board_color="#AAAAAAFF", card=card, sensor=sensor)
state.hover('a')
```

To stop rendering any hovering overlays, call `state.hover(None)`

#### Selecting

To graphically render a selected card, set the sensor as a `MultiSelectSensor` and call `state.set_selection(choice, select)`:

```python
import nodekit as nk
from nodekit_rs import State

card = get_card()  # Your code here.
sensor = nk.sensors.MultiSelectSensor(choices={
    'a': get_another_card()  # Your code here.
})
state = State(board_color="#AAAAAAFF", card=card, sensor=sensor)
state.select('a', True)
```

You can also opt for a `SelectSensor` but it will fail silently. All other sensor types will throw an exception.

## What works, what doesn't

**`nodekit-rs` is in alpha.** The goal is to faithfully replicate `nodekit-browser`. In some cases, the replication isn't exact. In other cases, features are missing.

ImageCard, VideoCard, and CompositeCard card should always look the same as they would in a browser.

TextCard is WIP. Markdown formatting is supported. Colorized words are supported (but not in `nodekit-browser`). There are minor kerning problems with list items.

Pointer rendering is supported but might not be the same as in the browser.

Most sensors are not yet implemented.

## Test

Run unit tests:

```bash
cargo test --all
```

Python tests are in `py-examples/`. Run `multiframe.py` and `node_test.py` and view the output.

## Benchmark

Run Rust benchmarks:

```bash
cargo bench --all
```

Run Python-to-Rust test:

```bash
cd py_examples
python benchmark.py
```

## Architecture

![](images/nodekit-rs.png)