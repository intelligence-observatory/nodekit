use nodekit_rs_text::TextBuffers;
use nodekit_rs_video::Video;
use nodekit_rs_visual::VisualBuffer;
use slotmap::new_key_type;

new_key_type! { pub struct AssetKey; }

pub enum Asset {
    Image(VisualBuffer),
    Text(TextBuffers),
    Video(Video),
}
