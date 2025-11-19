use crate::STRIDE;
use blittle::stride::RGBA;
use bytemuck::{cast_slice, cast_slice_mut};

/// Overlay `src` onto `dst`, blending colors using the alpha channel in `src`.
pub fn overlay(
    src: &[u8],
    src_size: &blittle::Size,
    dst: &mut [u8],
    dst_position: &blittle::PositionU,
    dst_size: &blittle::Size,
) {
    if src_size.w == 0 || src_size.h == 0 {
        return;
    }
    // Overlay.
    let src = cast_slice::<u8, [u8; RGBA]>(src);
    let dst = cast_slice_mut::<u8, [u8; STRIDE]>(dst);

    (0..src_size.h).for_each(|src_y| {
        let src_index = get_index(0, src_y, src_size.w);
        let dst_index = get_index(dst_position.x, dst_position.y + src_y, dst_size.w);
        src[src_index..src_index + src_size.w]
            .iter()
            .zip(dst[dst_index..dst_index + src_size.w].iter_mut())
            .for_each(|(src, dst)| {
                overlay_pixel(src, dst);
            });
    });
}

const fn get_index(x: usize, y: usize, w: usize) -> usize {
    x + y * w
}

/// Overlay a `src` pixel onto a `dst` pixel.
pub const fn overlay_pixel(src: &[u8; RGBA], dst: &mut [u8; STRIDE]) {
    // If `src` is totally opaque, then just copy it over.
    if src[3] == 255 {
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
    } else {
        let src_alpha = src[3] as f64 / 255.;
        // https://github.com/aiueo13/image-overlay/blob/master/src/blend/fns.rs
        let one_minus_src_a = 1. - src_alpha;
        let alpha_final = src_alpha + one_minus_src_a;
        if alpha_final > 0. {
            dst[0] = overlay_c(src[0], dst[0], src_alpha, one_minus_src_a, alpha_final);
            dst[1] = overlay_c(src[1], dst[1], src_alpha, one_minus_src_a, alpha_final);
            dst[2] = overlay_c(src[2], dst[2], src_alpha, one_minus_src_a, alpha_final);
        }
    }
}

/// Source: https://www.reddit.com/r/rust/comments/mvbn2g/compositing_colors
const fn overlay_c(src: u8, dst: u8, src_alpha: f64, one_minus_src_a: f64, alpha_final: f64) -> u8 {
    ((((src as f64 / 255.) * src_alpha + (dst as f64 / 255.) * one_minus_src_a) / alpha_final)
        * 255.) as u8
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_overlay() {
        let mut dst = [255, 255, 255];
        let mut src = [0, 0, 0, 255];
        overlay_pixel(&src, &mut dst);
        assert_eq!(dst, [0, 0, 0]);

        dst = [200, 170, 30];
        src = [100, 200, 120, 255];
        overlay_pixel(&src, &mut dst);
        assert_eq!(dst, [100, 200, 120]);

        dst = [0, 255, 255];
        src = [255, 0, 0, 255];
        overlay_pixel(&src, &mut dst);
        assert_eq!(dst, [255, 0, 0]);

        dst = [200, 170, 30];
        src = [100, 200, 120, 50];
        overlay_pixel(&src, &mut dst);
        assert_eq!(dst, [180, 175, 47]);
    }
}
