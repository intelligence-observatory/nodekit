#!/bin/bash

# Check if Rust is installed.
rustc > /dev/null
if [[ $? -eq 1 ]]; then
  echo "Rust not found. You need to install Rust."
  exit 1
fi

# Check if UV is installed.
uv 2> /dev/null
if [[ $? -eq 1 ]]; then
  echo "uv not found. You need to install uv."
  exit 1
fi

# Now that we've checked for all install requirements, we can halt on errors.
set -e

# Install maturin if needed.
# We don't check to see if maturin is already installed because this is very fast.
uv tool install maturin

# Generate the .pyi file.
# This doesn't work on MacOS.
if [[ $OSTYPE == "linux-gnu" ]]; then
  cargo run --example stub_gen
  python3 fix_pyi.py
fi

# Build the Python library.
maturin develop --release --uv