use crate::HASH_LEN;
use crate::asset::Asset;
use crate::error::Error;
use crate::media_type::MediaType;
use bytes::Bytes;
use futures::future::join_all;
use reqwest::Client;
use sha2::{Digest, Sha256};
use std::{
    fs::{read, write},
    path::{Path, PathBuf},
};
use url::Url;

pub(crate) struct Download {
    /// The source URL.
    pub url: Url,
    /// The returned data will be written to this path.
    pub path: PathBuf,
    pub media_type: MediaType,
    pub id: u64,
}

/// Queue up downloads and then download them in parallel.
pub struct Downloader {
    directory: PathBuf,
    downloads: Vec<Download>,
}

impl Downloader {
    /// `directory` is a path on your local machine.
    /// All downloads will write to this directory.
    pub fn new<P: AsRef<Path>>(directory: P) -> Self {
        Self {
            directory: directory.as_ref().to_path_buf(),
            downloads: Vec::default(),
        }
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
    pub fn add(
        &mut self,
        url: Url,
        hash: [u8; HASH_LEN],
        media_type: MediaType,
        id: u64,
    ) -> Result<bool, Error> {
        let filename = url
            .path_segments()
            .ok_or_else(|| Error::NoUrlFilename(url.clone()))?
            .next_back()
            .ok_or_else(|| Error::NoUrlFilename(url.clone()))?;
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
                id,
            });
            Ok(true)
        }
    }

    /// Download in parallel every URL that you added in [`Self::add()`]
    pub async fn download(&mut self) -> Vec<Result<Asset, Error>> {
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
        .map(Self::write)
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
    fn write(result: Result<(Download, Bytes), Error>) -> Result<Asset, Error> {
        let (download, bytes) = result?;
        write(&download.path, bytes.as_ref()).map_err(Error::Write)?;
        Ok(Asset::from(download))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use jpeg_decoder::Decoder;
    use std::fs::File;
    use std::io::BufReader;
    use tempdir::TempDir;
    use uuid::Uuid;

    #[tokio::test]
    async fn test_downloads() {
        let temp_dir = TempDir::new(&Uuid::new_v4().to_string()).unwrap();
        let directory = temp_dir.path().to_path_buf();
        let mut downloader = Downloader::new(directory);

        let url = Url::parse("https://images.pdimagearchive.org/collections/highlights-from-the-20000-maps-made-freely-available-online-by-new-york-public-library/13540188983_fa3794cab9_b.jpg?width=760&height=800").unwrap();
        let hash = *b"\xb7R\xddb\x18}_:JRk\x81B\xd4j1\"\xb7\x84\x84\xbf[p\xd5\xa1\x8a\x02\xb4\xa0\xa3\x1f\xce";
        downloader.add(url, hash, MediaType::Image, 0).unwrap();

        let url = Url::parse("https://images.pdimagearchive.org/collections/maps-of-the-lower-mississippi-harold-fisk/fisk08-edit.jpg?width=1000&height=800").unwrap();
        let hash = *b"\xbd\xf5\xdeW\x9c>!\x08\x1b\xc8c4\xdc\xb2\xdb9%\xc3\xb3\x864\x19\x8ed@\xb6\x02\x19\xc6u,\x92";
        downloader.add(url, hash, MediaType::Image, 1).unwrap();

        downloader
            .download()
            .await
            .into_iter()
            .map(|d| d.unwrap())
            .for_each(|d| {
                assert_eq!(d.media_type, MediaType::Image);
                assert!(d.path.exists());

                // Test whether this is a valid png.
                Decoder::new(BufReader::new(File::open(&d.path).unwrap()))
                    .read_info()
                    .unwrap();
            });
    }
}
