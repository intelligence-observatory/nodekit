use blittle::ClippedRect;

pub struct Overlap {
    pub rect: ClippedRect,
    pub z_index: Option<i64>,
}
