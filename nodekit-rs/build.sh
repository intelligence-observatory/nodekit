#!/bin/bash

maturin develop --release
cargo run --bin stub_gen