use nodekit_rs_image::*;
use slotmap::new_key_type;
use std::path::PathBuf;

new_key_type! { pub struct ImageKey; }

pub struct Image(pub PathBuf);
