use crate::components::*;
use hashbrown::HashMap;
use nodekit_rs_asset::{AssetManager, MediaType, sha256_string_to_hash};
use nodekit_rs_graph::{AssetLocator, Sha256};
use std::path::{Path, PathBuf};
use url::Url;

pub struct Assets {
    pub asset_manager: AssetManager,
    pub images: HashMap<u64, ImageKey>,
    pub videos: HashMap<u64, VideoKey>,
}

impl Assets {
    pub fn new<P: AsRef<Path>>(directory: P) -> Result<Self, nodekit_rs_asset::Error> {
        Ok(Self {
            asset_manager: AssetManager::new(directory)?,
            images: HashMap::default(),
            videos: HashMap::default(),
        })
    }
    pub fn add_image(
        &mut self,
        key: ImageKey,
        locator: &AssetLocator,
        hash: &Sha256,
    ) -> Result<(), nodekit_rs_asset::Error> {
        if let Some(id) = self.add_asset(locator, hash, MediaType::Image)? {
            self.images.insert(id, key);
        }
        Ok(())
    }

    pub fn add_video(
        &mut self,
        key: VideoKey,
        locator: &AssetLocator,
        hash: &Sha256,
    ) -> Result<(), nodekit_rs_asset::Error> {
        if let Some(id) = self.add_asset(locator, hash, MediaType::Video)? {
            self.videos.insert(id, key);
        }
        Ok(())
    }
    fn add_asset(
        &mut self,
        locator: &AssetLocator,
        hash: &Sha256,
        media_type: MediaType,
    ) -> Result<Option<u64>, nodekit_rs_asset::Error> {
        match locator {
            AssetLocator::Url(url) => {
                let hash = sha256_string_to_hash(hash.as_str())?;
                self.asset_manager
                    .add_download(Url::parse(&url.url).unwrap(), hash, media_type)
            }
            AssetLocator::FileSystemPath(path) => {
                self.asset_manager.add_copy(&path.path, media_type)
            }
            AssetLocator::RelativePath(path) => {
                let path = PathBuf::from(&path.relative_path).canonicalize().unwrap();
                self.asset_manager.add_copy(path, media_type)
            }
            AssetLocator::ZipArchiveInnerPath(zip) => {
                self.asset_manager
                    .add_zipped(&zip.zip_archive_path, &zip.inner_path, media_type)
            }
        }
    }
}
