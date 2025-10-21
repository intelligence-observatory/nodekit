#!/bin/bash

# Dump the schema to disk:
python3 dump_schema.py
# Generate Rust code:
cargo typify schema.json -b -o src/lib.rs
# Fix the Rust code so that clippy ignores it:
python3 deny_clippy.py