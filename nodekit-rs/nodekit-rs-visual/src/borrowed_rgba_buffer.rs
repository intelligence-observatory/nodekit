use blittle::ClippedRect;
use blittle::overlay::Vec4;

pub struct BorrowedRgbaBuffer<'b> {
    pub buffer: &'b [Vec4],
    pub rect: ClippedRect,
}
