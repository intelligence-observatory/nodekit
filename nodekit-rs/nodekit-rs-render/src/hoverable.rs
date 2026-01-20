use crate::asset::NonInteractiveAsset;
use blittle::overlay::Vec4;
use nodekit_rs_visual::RgbaBuffer;

const OVERLAY_COLOR: Vec4 = Vec4::new(0., 0., 0., 0.1);

pub struct Hoverable {
    pub asset: NonInteractiveAsset,
    pub overlay: RgbaBuffer,
}

impl Hoverable {
    pub fn new(asset: NonInteractiveAsset) -> Option<Self> {
        let rect = asset.rect()?;
        let overlay = RgbaBuffer {
            buffer: vec![OVERLAY_COLOR; rect.src_size.w * rect.src_size.h],
            rect,
        };
        Some(Self { asset, overlay })
    }
}
