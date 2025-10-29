# nodekit-rs

Accept a node, a time, and a cursor position, and render a frame:

```python
from nodekit_rs import render

frame = render(node=node, time_msec=0, cursor_x=0.2, cursor_y=0.3)
```

Where the `frame` is type `Frame`:

```
class Frame:
    visual: VisualFrame
    audio: AudioFrame | None
   
class VisualFrame:
    buffer: bytes
    width: int
    height: int
    
class AudioFrame:
    buffer: bytes
    rate: int
    channels: int
    format: AudioFormat  # An enum
```

See `node_test.py` for a complete example.

See `nodekit_rs.pyi` for the API.

## Install

1. Install Rust
2. Activate your Python venv
3. Install maturin
4. `maturin develop --release`

## Update code stubs

Run either `./build.sh` or `./stub_gen.sh`

## Benchmark

Run `cargo bench`

## Test

Run `cargo test --all`