use pyo3::exceptions::{PyTypeError, PyValueError};
use pyo3::prelude::*;
use pyo3::types::PyString;
use std::fmt::{Display, Formatter};
use std::path::PathBuf;
use url::Url;

/// The URI of a source file.
pub enum Asset {
    Path(PathBuf),
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

impl Display for Asset {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Path(path) => write!(f, "File path {:?}", path),
            Self::ZipArchiveInnerPath {
                zip_archive_path,
                inner_path: _,
            } => write!(f, "Zip file path {:?}", zip_archive_path),
            Self::Url(url) => write!(f, "Url {url}"),
        }
    }
}

impl<'py> FromPyObject<'_, 'py> for Asset {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        let locator = obj.getattr("locator")?;
        let locator_type = locator.getattr("locator_type")?;
        match locator_type.cast::<PyString>()?.to_str()? {
            "FileSystemPath" => Ok(Self::Path(Self::path(&locator, "path")?)),
            "RelativePath" => Ok(Self::Path(Self::path(&locator, "relative_path")?)),
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
            other => Err(PyValueError::new_err(format!(
                "Invalid locator type: {other}"
            ))),
        }
    }
}
