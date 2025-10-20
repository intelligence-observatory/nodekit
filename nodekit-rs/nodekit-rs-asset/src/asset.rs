use crate::Hash;
use crate::copy::ToCopy;
use crate::download::Download;
use crate::media_type::MediaType;
use crate::unzip::Zipped;
use std::path::PathBuf;

pub struct Asset {
    /// The path to the asset in the cache directory.
    pub path: PathBuf,
    pub hash: Hash,
    pub media_type: MediaType,
}

impl Asset {
    pub(crate) fn from_zipped(z: Zipped, hash: Hash) -> Self {
        Self {
            path: z.path.clone(),
            hash,
            media_type: z.media_type,
        }
    }
}

impl From<Download> for Asset {
    fn from(value: Download) -> Self {
        Self {
            path: value.path,
            hash: value.hash,
            media_type: value.media_type,
        }
    }
}

impl From<ToCopy> for Asset {
    fn from(value: ToCopy) -> Self {
        Self {
            path: value.to,
            hash: value.hash,
            media_type: value.media_type,
        }
    }
}
