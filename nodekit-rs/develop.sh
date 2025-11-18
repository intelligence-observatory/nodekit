#!/bin/bash

set -e

cargo run --example stub_gen
maturin develop --release --uv