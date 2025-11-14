use blittle::{clip, PositionI};
use bytemuck::{cast_slice, cast_slice_mut};
use crate::{spatial_coordinate, to_blittle_size, STRIDE};

pub fn clip_blit_overlay(src: &[u8],
                         src_size: &nodekit_rs_models::Size,
                         dst: &mut [u8],
                         dst_position: &nodekit_rs_models::Position,
                         dst_size: &nodekit_rs_models::Size) {
    // Convert to pixel coordinates.
    let dst_position = PositionI {
        x: spatial_coordinate(dst_position.x),
        y: spatial_coordinate(dst_position.y),
    };
    let mut src_size = to_blittle_size(&src_size);
    let dst_size = to_blittle_size(&dst_size);
    let dst_position = clip(&dst_position, &dst_size, &mut src_size);

    // Overlay.
    blit_overlay(src, &src_size, dst, &dst_position, &dst_size);
}

pub fn blit_overlay(src: &[u8],
                         src_size: &blittle::Size,
                         dst: &mut [u8],
                         dst_position: &blittle::PositionU,
                         dst_size: &blittle::Size) {
    // Overlay.
    let src = cast_slice::<u8, [u8; 4]>(src);
    let dst = cast_slice_mut::<u8, [u8; 4]>(dst);
    if src_size.w > 0 && src_size.h > 0 {
        src.chunks_exact(src_size.w).zip(dst.chunks_exact_mut(dst_size.w)).for_each(|(src, dst)| {
            // Get a slice of the dst row.
            let dst = &mut dst[dst_position.x..dst_position.x + src_size.w];
            src.iter().zip(dst.iter_mut()).for_each(|(src, dst)| {
                overlay(src, dst);
            })
        });
    }
}

pub const fn overlay(src: &[u8; STRIDE], dst: &mut [u8; STRIDE]) {
    if src[3] == dst[3] {
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
    }
    else {
        let src_alpha = alpha(src);
        let dst_alpha = alpha(dst);
        // https://github.com/aiueo13/image-overlay/blob/master/src/blend/fns.rs
        let one_minus_src_a = 1. - src_alpha;
        let alpha_final = src_alpha + dst_alpha * one_minus_src_a;
        if alpha_final > 0. {
            dst[0] = overlay_c(src[0], dst[0], src_alpha, dst_alpha, one_minus_src_a, alpha_final);
            dst[1] = overlay_c(src[1], dst[1], src_alpha, dst_alpha, one_minus_src_a, alpha_final);
            dst[2] = overlay_c(src[2], dst[2], src_alpha, dst_alpha, one_minus_src_a, alpha_final);
            dst[3] = (alpha_final * 255.) as u8;
        }
    }
}

const fn alpha(pixel: &[u8; 4]) -> f64 {
    pixel[3] as f64 / 255.
}

/// Source: https://www.reddit.com/r/rust/comments/mvbn2g/compositing_colors
const fn overlay_c(src: u8, dst: u8, src_alpha: f64, dst_alpha: f64, one_minus_src_a: f64, alpha_final: f64) -> u8 {
   ((((src as f64 / 255.) * src_alpha + (dst as f64 / 255.) * dst_alpha * one_minus_src_a) / alpha_final) * 255.) as u8
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_overlay() {
        let mut dst = [255, 255, 255, 255];
        let mut src = [0, 0, 0, 0];
        overlay(&src, &mut dst);
        assert_eq!(dst, [255, 255, 255, 255]);

        dst = [200, 170, 30, 100];
        src = [100, 200, 120, 255];
        overlay(&src, &mut dst);
        assert_eq!(dst, [100, 200, 120, 255]);

        dst = [255, 255, 255, 255];
        src = [0, 0, 0, 255];
        overlay(&src, &mut dst);
        assert_eq!(dst, [0, 0, 0, 255]);

        dst = [200, 170, 30, 100];
        src = [100, 200, 120, 50];
        overlay(&src, &mut dst);
        assert_eq!(dst, [161, 181, 64, 130]);
    }
}
