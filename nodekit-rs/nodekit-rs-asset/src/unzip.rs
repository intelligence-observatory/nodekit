use crate::asset::Asset;
use crate::error::Error;
use crate::media_type::MediaType;
use async_zip::tokio::read::seek::ZipFileReader;
use futures::future::join_all;
use std::fs::write;
use std::path::{Path, PathBuf};
use tokio::{fs::File, io::BufReader};

pub(crate) struct Zipped<'z> {
    pub archive_path: PathBuf,
    pub inner_path: &'z str,
    pub media_type: MediaType,
    pub path: PathBuf,
    pub id: u64,
}

impl Zipped<'_> {
    pub async fn unzip(self) -> Result<Asset, Error> {
        let file = File::open(&self.archive_path)
            .await
            .map_err(Error::OpenZip)?;
        let mut file = BufReader::new(file);
        let mut zip = ZipFileReader::with_tokio(&mut file)
            .await
            .map_err(Error::Zip)?;
        let index = zip
            .file()
            .entries()
            .iter()
            .enumerate()
            .map(|(i, entry)| {
                let filename = entry.filename().as_str().map_err(Error::Zip);
                match filename {
                    Ok(_) => Some(Ok(i)),
                    Err(error) => Some(Err(error)),
                }
            })
            .next()
            .flatten()
            .ok_or(Error::MissingEntry(self.inner_path.to_string()))??;
        let mut reader = zip.reader_with_entry(index).await.map_err(Error::Zip)?;
        let mut buffer = Vec::default();
        reader
            .read_to_end_checked(&mut buffer)
            .await
            .map_err(Error::Zip)?;
        write(&self.path, buffer).map_err(Error::Write)?;
        Ok(Asset::from(self))
    }
}

pub struct Unzipper<'z> {
    directory: PathBuf,
    zipped: Vec<Zipped<'z>>,
}

impl<'z> Unzipper<'z> {
    /// `directory` is a path on your local machine.
    /// All downloads will write to this directory.
    pub fn new<P: AsRef<Path>>(directory: P) -> Self {
        Self {
            directory: directory.as_ref().to_path_buf(),
            zipped: Default::default(),
        }
    }

    pub fn add<P: AsRef<Path>>(
        &mut self,
        archive_path: P,
        inner_path: &'z str,
        media_type: MediaType,
        id: u64,
    ) -> Result<bool, Error> {
        if archive_path.as_ref().exists() {
            let archive_path = archive_path.as_ref().to_path_buf();
            let archive_stem = archive_path
                .file_stem()
                .unwrap()
                .to_string_lossy()
                .to_string();
            let filename = if inner_path.contains("/") {
                inner_path
                    .split("/")
                    .last()
                    .ok_or(Error::NoPathFilename(inner_path.to_string()))?
            } else {
                inner_path
            };
            let path = self.directory.join(archive_stem).join(filename);
            self.zipped.push(Zipped {
                inner_path,
                media_type,
                path,
                archive_path: archive_path.clone(),
                id,
            });
            Ok(true)
        } else {
            Err(Error::NoZip(archive_path.as_ref().to_path_buf()))
        }
    }

    pub async fn unzip(&mut self) -> Vec<Result<Asset, Error>> {
        // Drain the items because otherwise we'd need to move them.
        let mut zipped = Vec::default();
        zipped.append(&mut self.zipped);
        join_all(
            zipped
                .into_iter()
                .map(|zipped| async move { zipped.unzip().await }),
        )
        .await
        .into_iter()
        .collect()
    }
}
