use blittle::overlay::Vec4;

const U: f32 = 0.313;
const C: f32 = 0.196;

/// This is used to set the colors of a thumb bitmap.
pub struct ThumbColor {
    /// The color of the pixels in the absolute corners of the bitmap.
    pub far_corner: Vec4,
    /// The color of two pixels adjacent to the far_corner pixel.
    pub near_corner: Vec4,
    /// The color of every other pixel.
    pub fill: Vec4,
}

pub const COMMITTED: ThumbColor = ThumbColor {
    far_corner: Vec4::new(C, C, C, 0.1),
    near_corner: Vec4::new(C, C, C, 0.3),
    fill: Vec4::new(C, C, C, 1.),
};

pub const UNCOMMITTED: ThumbColor = ThumbColor {
    far_corner: Vec4::new(U, U, U, 0.05),
    near_corner: Vec4::new(U, U, U, 0.1),
    fill: Vec4::new(U, U, U, 0.2),
};
