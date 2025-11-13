#!/bin/bash

set -e

cargo run --example stub_gen
python fix_stubs.py