//! Download files in parallel and sort them by media type.

mod download;
mod error;
mod media_type;

use bytes::Bytes;
use download::Download;
pub use error::Error;
use futures::future::join_all;
pub use media_type::MediaType;
use reqwest::Client;
use sha2::{Digest, Sha256};
use std::fs::{create_dir_all, read, write};
use std::path::{Path, PathBuf};
use url::Url;

/// Queue up downloads and then download them in parallel.
pub struct Downloader {
    directory: PathBuf,
    downloads: Vec<Download>,
}

impl Downloader {
    /// `directory` is a path on your local machine.
    /// All downloads will write to this directory.
    pub fn new<P: AsRef<Path>>(directory: P) -> Result<Self, Error> {
        create_dir_all(directory.as_ref()).map_err(Error::CreateDir)?;
        Ok(Self {
            directory: directory.as_ref().to_path_buf(),
            downloads: Vec::default(),
        })
    }

    /// Add a new download.
    /// This doesn't start the downloading process.
    /// To do that, call [`Self::download()`].
    ///
    /// - `url` is the source URL.
    /// - `hash` is the hash of the source file. This is used to decide whether we need to re-download the file.
    /// - `media_type` is used elsewhere to sort through the completed downloads.
    ///
    /// Returns true if a download was added.
    /// Returns false if the file already exists.
    pub fn add_download(
        &mut self,
        url: Url,
        hash: [u8; 32],
        media_type: MediaType,
    ) -> Result<bool, Error> {
        let filename = url
            .path_segments()
            .ok_or_else(|| Error::NoFilename(url.clone()))?
            .last()
            .ok_or_else(|| Error::NoFilename(url.clone()))?;
        let path = self.directory.join(filename);

        // If the path exists, the file is readable, and the file has the same hash as `hash`, don't download.
        if path.exists()
            && let Ok(content) = read(&path)
            && Sha256::digest(&content).as_ref() == hash
        {
            Ok(false)
        } else {
            self.downloads.push(Download {
                url,
                path,
                media_type,
            });
            Ok(true)
        }
    }

    /// Download in parallel every URL that you added in [`Self::add_download()`]
    pub async fn download(&mut self) -> Vec<Result<Download, Error>> {
        // Drain the downloads because otherwise we'd need to move `self.downloads`.
        let mut downloads = Vec::default();
        downloads.append(&mut self.downloads);
        // Download in parallel.
        join_all(
            downloads
                .into_iter()
                .map(|download| async move { Self::download_from_url(download).await }),
        )
        .await
        .into_iter()
        .map(|response| Self::write(response))
        .collect()
    }

    /// Download from a single URL.
    async fn download_from_url(download: Download) -> Result<(Download, Bytes), Error> {
        let response = Client::new()
            .get(download.url.clone())
            .send()
            .await
            .map_err(Error::Reqwest)?
            .error_for_status()
            .map_err(Error::Reqwest)?;
        let bytes = response.bytes().await.map_err(Error::Reqwest)?;
        Ok((download, bytes))
    }

    /// Try to write the downloaded content to disk.
    fn write(result: Result<(Download, Bytes), Error>) -> Result<Download, Error> {
        let (downloadable, bytes) = result?;
        write(&downloadable.path, bytes.as_ref()).map_err(Error::Write)?;
        Ok(downloadable)
    }
}
