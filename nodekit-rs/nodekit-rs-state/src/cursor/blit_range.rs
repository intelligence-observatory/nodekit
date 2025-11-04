use crate::board::*;

/// Clamp a coordinate and derive where to start and stop blitting an image.
pub struct BlitRange {
    /// Start blitting to `dst` at this coordinate.
    pub dst_0: usize,
    /// End blitting to `dst` at this coordinate.
    pub dst_1: usize,
    /// Start blitting from `src` at this coordinate.
    pub src_0: usize,
    /// End blitting from `src` at this coordinate.
    pub src_1: usize,
}

impl BlitRange {
    pub const fn new(c: f64, d: usize, d_half: usize, d_half_isize: isize) -> Option<Self> {
        let dst = spatial_coordinate(c);
        if dst + d_half_isize < 0 || dst > BOARD_D_ISIZE {
            None
        } else if dst < 0 {
            let src_0 = dst.unsigned_abs();
            Some(Self {
                src_0,
                src_1: d,
                dst_0: 0,
                dst_1: d - src_0,
            })
        } else if dst + d_half_isize > BOARD_D_ISIZE {
            Some(Self {
                src_0: 0,
                src_1: (dst.unsigned_abs() + d_half) - BOARD_D,
                dst_0: dst.unsigned_abs(),
                dst_1: BOARD_D,
            })
        } else {
            let dst = dst.unsigned_abs();
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
        let d_half = d / 2;
        let d_half_isize = d_half.cast_signed();
        let c = BlitRange::new(0., d, d_half, d_half_isize).unwrap();
        assert_eq!(c.src_0, 0);
        assert_eq!(c.src_1, d);
        assert_eq!(c.dst_0, VISUAL_R);
        assert_eq!(c.dst_1, VISUAL_R + d);

        let c = BlitRange::new(0.499, d, d_half, d_half_isize).unwrap();
        assert_eq!(c.src_0, 0);
        assert_eq!(c.src_1, d_half - 1);
        assert_eq!(c.dst_0, BOARD_D - 1);
        assert_eq!(c.dst_1, BOARD_D);

        let c = BlitRange::new(-0.51, d, d_half, d_half_isize).unwrap();
        assert_eq!(c.src_0, 7);
        assert_eq!(c.src_1, d);
        assert_eq!(c.dst_0, 0);
        assert_eq!(c.dst_1, 27);

        assert!(BlitRange::new(1.1, d, d_half, d_half_isize).is_none());
        assert!(BlitRange::new(-0.6, d, d_half, d_half_isize).is_none());
    }
}
