#!/bin/bash

# Dump the schema to disk:
python dump_schema.py
# Generate Rust code:
cargo typify schema.json -b -o src/lib.rs
# Fix the Rust code so that clippy ignores it:
python allow_clippy.py