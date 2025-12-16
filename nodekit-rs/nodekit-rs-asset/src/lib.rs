//! Load raw byte data from a path or URL.

mod error;

pub use error::Error;
use nodekit_rs_card::Asset;
use reqwest::blocking;
use std::{
    fs::{File, read},
    io::Read,
};
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

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use url::Url;

    #[test]
    fn test_assets() {
        // Relative.
        let path = PathBuf::from("test_files/lorem.txt");
        assert!(path.exists());
        load_asset(&Asset::Path(path.clone())).unwrap();
        // Absolute.
        let path = path.canonicalize().unwrap();
        assert!(path.exists());
        load_asset(&Asset::Path(path)).unwrap();
        // Zip.
        let zip_archive_path = PathBuf::from("test_files/lorem.zip");
        assert!(zip_archive_path.exists());
        load_asset(&Asset::ZipArchiveInnerPath {
            zip_archive_path,
            inner_path: PathBuf::from("lorem.txt"),
        })
        .unwrap();
        // URL.
        load_asset(&Asset::Url(
            Url::parse("http://textfiles.com/hacking/UNIX/bhacking.txt").unwrap(),
        ))
        .unwrap();
    }
}
