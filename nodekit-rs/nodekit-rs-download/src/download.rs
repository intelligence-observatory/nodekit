use crate::media_type::MediaType;
use std::path::PathBuf;
use url::Url;

/// A pending download.
pub struct Download {
    /// The source URL.
    pub url: Url,
    /// The returned data will be written to this path.
    pub path: PathBuf,
    pub media_type: MediaType,
}
