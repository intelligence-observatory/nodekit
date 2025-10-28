#!/bin/bash

maturin develop --release
./stub_gen.sh