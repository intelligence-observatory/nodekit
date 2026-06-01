#!/bin/bash

# Install cargo-vcpkg
if ! cargo-vcpkg -V > /dev/null; then
  cargo install cargo-vcpkg
fi
cd nodekit-rs-video
cargo-vcpkg build