use crate::media_type::MediaType;
use std::path::PathBuf;

pub struct Asset {
    pub path: PathBuf,
    pub media_type: MediaType,
}
