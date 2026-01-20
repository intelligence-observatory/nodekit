use nodekit_rs_visual::RgbaBuffer;
use crate::asset::Asset;

pub struct HoverableAsset {
    pub asset: Asset,
    pub overlay: RgbaBuffer
}