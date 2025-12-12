mod error;

pub use error::Error;
use nodekit_rs_card::Asset;
use reqwest::blocking;
use std::fs::{File, read};
use std::io::Read;
use zip::ZipArchive;

/// Load raw byte data from `asset`.
pub fn load_asset(asset: &Asset) -> Result<Vec<u8>, Error> {
    match asset {
        Asset::Path(path) => read(path).map_err(|e| Error::ReadPath(path.clone(), e)),
        Asset::Url(url) => Ok(blocking::get(url.clone())
            .map_err(|e| Error::HttpGet(url.clone(), e))?
            .error_for_status()
            .map_err(|e| Error::ResponseError(url.clone(), e))?
            .bytes()
            .map_err(|e| Error::HttpBytes(url.clone(), e))?
            .to_vec()),
        Asset::ZipArchiveInnerPath {
            zip_archive_path,
            inner_path,
        } => {
            let file = File::open(zip_archive_path)
                .map_err(|e| Error::OpenZipFile(zip_archive_path.clone(), e))?;
            let mut archive = ZipArchive::new(file)
                .map_err(|e| Error::ZipArchive(zip_archive_path.clone(), e))?;
            let mut entry = archive.by_path(inner_path).map_err(|e| {
                Error::FindZipEntry(inner_path.clone(), zip_archive_path.clone(), e)
            })?;
            let mut buffer = Vec::default();
            entry.read_to_end(&mut buffer).map_err(|e| {
                Error::ZipEntryRead(inner_path.clone(), zip_archive_path.clone(), e)
            })?;
            Ok(buffer)
        }
    }
}
