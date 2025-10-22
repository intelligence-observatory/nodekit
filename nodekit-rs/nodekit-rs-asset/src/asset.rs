use crate::copy::ToCopy;
use crate::download::Download;
use crate::media_type::MediaType;
use crate::unzip::Zipped;
use std::path::PathBuf;

pub struct Asset {
    /// The path to the asset in the cache directory.
    pub path: PathBuf,
    pub id: u64,
    pub media_type: MediaType,
}

impl From<Zipped> for Asset {
    fn from(value: Zipped) -> Self {
        Self {
            path: value.path.clone(),
            id: value.id,
            media_type: value.media_type,
        }
    }
}

impl From<Download> for Asset {
    fn from(value: Download) -> Self {
        Self {
            path: value.path,
            id: value.id,
            media_type: value.media_type,
        }
    }
}

impl From<ToCopy> for Asset {
    fn from(value: ToCopy) -> Self {
        Self {
            path: value.to,
            id: value.id,
            media_type: value.media_type,
        }
    }
}
