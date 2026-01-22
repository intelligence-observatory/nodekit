use std::env::current_dir;
use std::process::Command;
use std::str::from_utf8;

fn main() {
    // Check if cargo-vcpkg is installed.
    let out = Command::new("cargo")
        .arg("install")
        .arg("--list")
        .output()
        .unwrap();
    let out = from_utf8(&out.stdout).unwrap();
    // Install cargo-vcpkg
    if !out.contains("cargo-vcpkg") {
        let e = Command::new("cargo")
            .arg("install")
            .arg("cargo-vcpkg")
            .status()
            .unwrap();
        assert!(e.success());
    }
    // Compile.
    let e = Command::new("cargo-vcpkg").arg("build").status().unwrap();
    assert!(e.success());
}
