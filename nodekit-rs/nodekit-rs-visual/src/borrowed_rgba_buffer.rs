use blittle::ClippedRect;

pub struct BorrowedRgbaBuffer<'b> {
    pub buffer: &'b [u8],
    pub rect: ClippedRect
}