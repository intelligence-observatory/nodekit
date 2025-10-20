use std::fs::create_dir_all;
use std::path::{Path, PathBuf};

pub struct Downloader {
    pub(crate) directory: PathBuf
}

impl Downloader {
    pub fn new<P: AsRef<Path>>(directory: P) -> Result<Self, std::io::Error> {
        create_dir_all(directory.as_ref())?;
        Ok(Self {
            directory: directory.as_ref().to_path_buf()
        })
    }
}