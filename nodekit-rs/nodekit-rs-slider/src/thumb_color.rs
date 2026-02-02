use blittle::overlay::Vec4;

const U: f32 = 0.313;
const C: f32 = 0.196;

pub struct ThumbColor {
    pub far_corner: Vec4,
    pub near_corner: Vec4,
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
