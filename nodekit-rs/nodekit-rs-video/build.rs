use std::process::Command;

const CARGO_VCPKG: &str = "cargo-vcpkg";

fn main() {
    // Check if cargo-vcpkg is installed.
    let e = Command::new(CARGO_VCPKG).status().unwrap();
    // Install cargo-vcpkg
    if !e.success() {
        let e = Command::new("cargo")
            .arg("install")
            .arg(CARGO_VCPKG)
            .status()
            .unwrap();
        assert!(e.success());
    }
    // Compile.
    let e = Command::new(CARGO_VCPKG).arg("build").status().unwrap();
    assert!(e.success());
}
