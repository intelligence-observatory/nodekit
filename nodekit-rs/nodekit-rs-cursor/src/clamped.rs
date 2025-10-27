use crate::{DIAMETER, RADIUS, RADIUS_I};
use nodekit_rs_visual::*;

pub struct Clamped {
    pub dst_0: usize,
    pub dst_1: usize,
    pub src_0: usize,
    pub src_1: usize,
}

impl Clamped {
    pub fn new(c: f64) -> Option<Self> {
        let dst = spatial_coordinate(c);
        if dst + RADIUS_I < 0 || dst > VISUAL_D_ISIZE {
            None
        } else if dst < 0 {
            let src_0 = dst.unsigned_abs();
            Some(Self {
                src_0,
                src_1: DIAMETER,
                dst_0: 0,
                dst_1: DIAMETER - src_0,
            })
        } else if dst + RADIUS_I > VISUAL_D_ISIZE {
            Some(Self {
                src_0: 0,
                src_1: (dst.unsigned_abs() + RADIUS) - VISUAL_D,
                dst_0: dst.unsigned_abs(),
                dst_1: VISUAL_D,
            })
        } else {
            let dst = dst.unsigned_abs();
            Some(Self {
                src_0: 0,
                src_1: DIAMETER,
                dst_0: dst,
                dst_1: dst + DIAMETER,
            })
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    const VISUAL_R: usize = VISUAL_D / 2;

    #[test]
    fn test_clamped() {
        let c = Clamped::new(0.).unwrap();
        assert_eq!(c.src_0, 0);
        assert_eq!(c.src_1, DIAMETER);
        assert_eq!(c.dst_0, VISUAL_R);
        assert_eq!(c.dst_1, VISUAL_R + DIAMETER);

        let c = Clamped::new(0.499).unwrap();
        assert_eq!(c.src_0, 0);
        assert_eq!(c.src_1, RADIUS - 1);
        assert_eq!(c.dst_0, VISUAL_D - 1);
        assert_eq!(c.dst_1, VISUAL_D);

        let c = Clamped::new(-0.51).unwrap();
        assert_eq!(c.src_0, 7);
        assert_eq!(c.src_1, DIAMETER);
        assert_eq!(c.dst_0, 0);
        assert_eq!(c.dst_1, 25);

        assert!(Clamped::new(1.1).is_none());
        assert!(Clamped::new(-0.6).is_none());
    }
}
