use crate::{Asset, Error, Hash, MediaType};
use futures::future::join_all;
use sha2::{Digest, Sha256};
use std::fs::read;
use std::path::{Path, PathBuf};
use tokio::fs::copy;

pub struct ToCopy {
    pub from: PathBuf,
    pub to: PathBuf,
    pub hash: Hash,
    pub media_type: MediaType,
}

impl ToCopy {
    pub fn new(
        directory: &Path,
        from: PathBuf,
        media_type: MediaType,
    ) -> Result<Option<Self>, Error> {
        if from.exists() {
            let filename = from
                .file_name()
                .ok_or(Error::NoPathFilename(from.to_string_lossy().to_string()))?;
            let to = directory.join(filename);
            let hash: Hash = *Sha256::digest(&read(&from).map_err(Error::Read)?).as_ref();
            Ok(
                if !to.exists() || hash != *Sha256::digest(&read(&to).map_err(Error::Read)?) {
                    Some(Self {
                        from,
                        to,
                        hash,
                        media_type,
                    })
                } else {
                    None
                },
            )
        } else {
            Err(Error::NoSourceFile(from.to_path_buf()))
        }
    }

    pub async fn copy(self) -> Result<Asset, Error> {
        copy(&self.from, &self.to).await.map_err(Error::Copy)?;
        Ok(Asset::from(self))
    }
}

pub struct Copier {
    directory: PathBuf,
    to_copy: Vec<ToCopy>,
}

impl Copier {
    pub fn new<P: AsRef<Path>>(directory: P) -> Self {
        Self {
            directory: directory.as_ref().to_path_buf(),
            to_copy: Default::default(),
        }
    }

    pub fn add<P: AsRef<Path>>(&mut self, from: P, media_type: MediaType) -> Result<bool, Error> {
        if let Some(to_copy) =
            ToCopy::new(&self.directory, from.as_ref().to_path_buf(), media_type)?
        {
            self.to_copy.push(to_copy);
        }
        Ok(true)
    }

    pub async fn copy(&mut self) -> Vec<Result<Asset, Error>> {
        let mut to_copy = Vec::default();
        to_copy.append(&mut self.to_copy);
        join_all(to_copy.into_iter().map(|c| async move { c.copy().await }))
            .await
            .into_iter()
            .collect()
    }
}
