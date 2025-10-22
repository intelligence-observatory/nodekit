use clap::Parser;
use std::path::PathBuf;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub struct Args {
    /// Assets will be downloaded, extracted, or copied into this cache directory.
    #[arg(short, long)]
    pub asset_directory: PathBuf,
    /// The name of the UNIX socket that this will serve on.
    #[cfg(target_family = "unix")]
    #[arg(short, long, default_value = "ipc:///tmp/nodekit-rs")]
    pub socket: String,
    #[cfg(target_family = "windows")]
    #[arg(short, long, default_value = "tcp://127.0.0.1:1337")]
    pub socket: String,
}
