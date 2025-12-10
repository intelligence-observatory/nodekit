use pyo3::exceptions::PyTypeError;
use pyo3::prelude::*;
use pyo3::types::PyString;
use std::path::PathBuf;
use url::Url;

pub enum Asset {
    FileSystemPath(PathBuf),
    RelativePath(PathBuf),
    ZipArchiveInnerPath {
        zip_archive_path: PathBuf,
        inner_path: PathBuf,
    },
    Url(Url),
}

impl Asset {
    fn path(locator: &Bound<PyAny>, path: &str) -> PyResult<PathBuf> {
        Ok(PathBuf::from(
            locator.getattr(path)?.cast::<PyString>()?.to_str()?,
        ))
    }
}

impl<'py> FromPyObject<'_, 'py> for Asset {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        let locator = obj.getattr("locator")?;
        let locator_type = locator
            .getattr("locator_type")?;
        match locator_type.cast::<PyString>()?.to_str()? {
            "FileSystemPath" => Ok(Self::FileSystemPath(Self::path(&locator, "path")?)),
            "RelativePath" => Ok(Self::RelativePath(Self::path(&locator, "path")?)),
            "ZipArchiveInnerPath" => {
                let zip_archive_path = Self::path(&locator, "zip_archive_path")?;
                let inner_path = Self::path(&locator, "inner_path")?;
                Ok(Self::ZipArchiveInnerPath {
                    zip_archive_path,
                    inner_path,
                })
            }
            "Url" => {
                let url = locator.getattr("url")?.cast::<PyString>()?.to_string();
                let url = Url::parse(&url).map_err(|e| {
                    PyTypeError::new_err(format!("Failed to parse URL: {url}. Error was: {e}"))
                })?;
                Ok(Self::Url(url))
            }
            other => panic!("{other}"),
        }
    }
}
