use nodekit_rs_fb::Locator;
use std::path::PathBuf;
use url::Url;

pub enum AssetPath {
    Path(PathBuf),
    ZipArchive {
        archive_path: PathBuf,
        inner_path: String,
    },
    Url(Url),
}

impl AssetPath {
    pub fn new(asset: &nodekit_rs_fb::Asset) -> Option<Self> {
        match asset.locator_type() {
            Locator::Path => {
                // If this isn't a valid URL, it's a local path.
                match Url::parse(asset.locator_as_path()?.path()?) {
                    Ok(url) => Some(AssetPath::Url(url)),
                    Err(_) => Some(AssetPath::Path(PathBuf::from(
                        asset.locator_as_path()?.path()?,
                    ))),
                }
            }
            Locator::ZipArchivePath => {
                let zip = asset.locator_as_zip_archive_path()?;
                Some(AssetPath::ZipArchive {
                    archive_path: PathBuf::from(zip.zip_archive_path()?),
                    inner_path: zip.inner_path()?.to_string(),
                })
            }
            other => unreachable!("Invalid asset locator: {}", other.0),
        }
    }
}

pub struct Asset {
    pub path: AssetPath,
    pub hash: String,
}

impl Asset {
    pub fn new(asset: &nodekit_rs_fb::Asset) -> Option<Self> {
        let path = AssetPath::new(asset)?;
        let hash = asset.hash()?.to_string();
        Some(Self {
            path, 
            hash
        })
    }
}
