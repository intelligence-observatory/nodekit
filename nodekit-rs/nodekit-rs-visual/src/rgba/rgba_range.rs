use crate::board::*;

/// Clamp a coordinate and derive where to start and stop blitting an image.
pub struct RgbaRange {
    /// Start blitting to `dst` at this coordinate.
    pub dst_0: usize,
    /// End blitting to `dst` at this coordinate.
    pub dst_1: usize,
    /// Start blitting from `src` at this coordinate.
    pub src_0: usize,
    /// End blitting from `src` at this coordinate.
    pub src_1: usize,
}

impl RgbaRange {
    pub const fn new(c: isize, d: usize) -> Option<Self> {
        let d_half_isize = d.cast_signed() / 2;
        if c + d_half_isize < 0 || c > BOARD_D_ISIZE {
            None
        } else if c < 0 {
            let src_0 = c.unsigned_abs();
            Some(Self {
                src_0,
                src_1: d,
                dst_0: 0,
                dst_1: d - src_0,
            })
        } else if c + d_half_isize > BOARD_D_ISIZE {
            Some(Self {
                src_0: 0,
                src_1: (c.unsigned_abs() + d / 2) - BOARD_D,
                dst_0: c.unsigned_abs(),
                dst_1: BOARD_D,
            })
        } else {
            let dst = c.unsigned_abs();
            Some(Self {
                src_0: 0,
                src_1: d,
                dst_0: dst,
                dst_1: dst + d,
            })
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    const VISUAL_R: usize = BOARD_D / 2;

    #[test]
    fn test_clamped() {
        let d: usize = 34;
        let c = RgbaRange::new(0, d).unwrap();
        assert_eq!(c.src_0, 0);
        assert_eq!(c.src_1, d);
        assert_eq!(c.dst_0, VISUAL_R);
        assert_eq!(c.dst_1, VISUAL_R + d);

        let c = RgbaRange::new(768, d).unwrap();
        assert_eq!(c.src_0, 0);
        assert_eq!(c.src_1, d / 2 - 1);
        assert_eq!(c.dst_0, BOARD_D - 1);
        assert_eq!(c.dst_1, BOARD_D);

        let c = RgbaRange::new(-1, d).unwrap();
        assert_eq!(c.src_0, 7);
        assert_eq!(c.src_1, d);
        assert_eq!(c.dst_0, 0);
        assert_eq!(c.dst_1, 27);

        assert!(RgbaRange::new(800, d).is_none());
        assert!(RgbaRange::new(-800, d).is_none());
    }
}
