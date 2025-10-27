use std::path::PathBuf;

pub struct VideoAsset {
    pub path: PathBuf,
    pub muted: bool,
    pub looped: bool,
    pub time: u64,
}
