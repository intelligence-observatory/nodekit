mod asset;
mod copy;
mod download;
mod error;
mod media_type;
mod unzip;

use crate::copy::Copier;
pub use asset::Asset;
use download::Downloader;
pub use error::Error;
pub use media_type::MediaType;
use std::fs::create_dir_all;
use std::path::Path;
use unzip::Unzipper;

const HASH_LEN: usize = 32;

type Hash = [u8; HASH_LEN];

/// Gather assets and move them into a cache directory.
pub struct AssetManager<'a> {
    /// Download assets.
    pub downloader: Downloader,
    /// Unzip assets from local zip files.
    pub unzipper: Unzipper<'a>,
    /// Copy local files.
    pub copier: Copier,
}

impl AssetManager<'_> {
    pub fn new<P: AsRef<Path>>(directory: P) -> Result<Self, Error> {
        let directory = directory.as_ref();
        create_dir_all(directory).map_err(Error::CreateDir)?;
        Ok(Self {
            downloader: Downloader::new(directory),
            unzipper: Unzipper::new(directory),
            copier: Copier::new(directory),
        })
    }

    /// Download, unzip, and copy.
    pub async fn get_all(&mut self) -> Vec<Result<Asset, Error>> {
        let mut assets = self.downloader.download().await;
        assets.append(&mut self.unzipper.unzip().await);
        assets.append(&mut self.copier.copy().await);
        assets
    }
}

/// Convert a SHA-256 hex string to a byte array.
pub fn sha256_string_to_hash(s: &str) -> Result<Hash, Error> {
    let bytes = s.as_bytes();
    if bytes.len() == HASH_LEN {
        let mut hash = [0; 32];
        hash.copy_from_slice(bytes);
        Ok(hash)
    } else {
        Err(Error::BadHash(s.to_string()))
    }
}
