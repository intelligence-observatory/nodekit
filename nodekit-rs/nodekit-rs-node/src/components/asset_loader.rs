use std::path::PathBuf;
use url::Url;
use nodekit_rs_fb::{Asset, Locator};

pub enum AssetLoader {
    Path(PathBuf),
    ZipArchive {
        archive_path: PathBuf,
        inner_path: String
    },
    Url(Url)
}

impl AssetLoader {
    pub fn new(asset: &Asset) -> Option<Self> {
        match asset.locator_type() {
            Locator::Path => {
                // If this isn't a valid URL, it's a local path.
                match Url::parse(asset.locator_as_path()?.path()?) {
                    Ok(url) => Some(AssetLoader::Url(url)),
                    Err(_) =>                 Some(AssetLoader::Path(PathBuf::from(asset.locator_as_path()?.path()?)))
                }
            }
            Locator::ZipArchivePath => {
                let zip = asset.locator_as_zip_archive_path()?;
                Some(AssetLoader::ZipArchive {
                    archive_path: PathBuf::from(zip.zip_archive_path()?),
                    inner_path: zip.inner_path()?.to_string()
                })
            },
            other => unreachable!("Invalid asset locator: {}", other.0)
        }
    }
}