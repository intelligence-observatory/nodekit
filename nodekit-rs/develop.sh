#!/bin/bash

set -e

cargo run --example stub_gen
python3 fix_pyi.py
maturin develop --release --uv