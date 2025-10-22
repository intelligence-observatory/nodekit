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
use url::Url;

const HASH_LEN: usize = 32;

type Hash = [u8; HASH_LEN];

/// Gather assets and move them into a cache directory.
pub struct AssetManager {
    /// Download assets.
    downloader: Downloader,
    /// Unzip assets from local zip files.
    unzipper: Unzipper,
    /// Copy local files.
    copier: Copier,
    next_id: u64,
}

impl AssetManager {
    pub fn new<P: AsRef<Path>>(directory: P) -> Result<Self, Error> {
        let directory = directory.as_ref();
        create_dir_all(directory).map_err(Error::CreateDir)?;
        Ok(Self {
            downloader: Downloader::new(directory),
            unzipper: Unzipper::new(directory),
            copier: Copier::new(directory),
            next_id: 0,
        })
    }

    /// Add a new download.
    pub fn add_download(
        &mut self,
        url: Url,
        hash: [u8; HASH_LEN],
        media_type: MediaType,
    ) -> Result<Option<u64>, Error> {
        Ok(
            if self.downloader.add(url, hash, media_type, self.next_id)? {
                let id = self.next_id;
                self.next_id += 1;
                Some(id)
            } else {
                None
            },
        )
    }

    pub fn add_copy<P: AsRef<Path>>(
        &mut self,
        from: P,
        media_type: MediaType,
    ) -> Result<Option<u64>, Error> {
        Ok(
            if self.copier.add(from.as_ref(), media_type, self.next_id)? {
                let id = self.next_id;
                self.next_id += 1;
                Some(id)
            } else {
                None
            },
        )
    }

    pub fn add_zipped<P: AsRef<Path>>(
        &mut self,
        archive_path: P,
        inner_path: &str,
        media_type: MediaType,
    ) -> Result<Option<u64>, Error> {
        Ok(
            if self
                .unzipper
                .add(archive_path.as_ref(), inner_path, media_type, self.next_id)?
            {
                let id = self.next_id;
                self.next_id += 1;
                Some(id)
            } else {
                None
            },
        )
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
