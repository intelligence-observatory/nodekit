#!/bin/bash

set -e

cargo run nodekit-rs-stub-gen
python fix_stubs.py