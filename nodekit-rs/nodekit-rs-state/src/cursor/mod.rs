mod blit_range;

use crate::board::*;
use blit_range::BlitRange;
use bytemuck::cast_slice;
use std::slice::from_raw_parts_mut;

const WIDTH: usize = 34;
const WIDTH_HALF: usize = 17;
const WIDTH_HALF_ISIZE: isize = 17;
const HEIGHT: usize = 44;
const HEIGHT_HALF: usize = 22;
const HEIGHT_HALF_ISIZE: isize = 22;
const CURSOR: &[u8] = include_bytes!("../../cursor");

/// Blit the cursor onto the `board` image.
///
/// `x` and `y` are between -0.5 and 0.5, with 0.0 being the center of `board`.
pub fn blit_cursor(x: f64, y: f64, board: &[u8]) -> Option<Vec<u8>> {
    if let Some(x) = BlitRange::new(x, WIDTH, WIDTH_HALF, WIDTH_HALF_ISIZE)
        && let Some(y) = BlitRange::new(y, HEIGHT, HEIGHT_HALF, HEIGHT_HALF_ISIZE)
    {
        // Convert the cursor to a 3D RGBA array.
        let cursor = cast_slice::<u8, [[u8; 4]; WIDTH]>(CURSOR);

        let mut dst = board.to_vec();

        // Break the visual bitmap into row slices.
        // We can't use bytemuck for this, but it's very safe, because we're using constants.
        let ptr = dst.as_mut_ptr().cast::<[[u8; 3]; BOARD_D]>();
        unsafe {
            // Iterate through each row we need to blit from and to.
            for (dst, src) in from_raw_parts_mut(ptr, BOARD_D)[y.dst_0..y.dst_1]
                .iter_mut()
                .zip(cursor[y.src_0..y.src_1].iter())
            {
                // Iterate through each column we need to blit from and to.
                for (src, dst) in src[x.src_0..x.src_1]
                    .iter()
                    .zip(dst[x.dst_0..x.dst_1].iter_mut())
                {
                    // Ignore alpha.
                    overlay(src, dst);
                }
            }
        }
        Some(dst)
    } else {
        None
    }
}

const fn overlay(src: &[u8; 4], dst: &mut [u8; 3]) {
    if src[3] > 0 {
        let alpha = src[3] as f64 / 255.;
        overlay_c(src[0], &mut dst[0], alpha);
        overlay_c(src[1], &mut dst[1], alpha);
        overlay_c(src[2], &mut dst[2], alpha);
    }
}

/// Source: https://www.reddit.com/r/rust/comments/mvbn2g/compositing_colors
const fn overlay_c(src: u8, dst: &mut u8, alpha: f64) {
    let result = *dst as f64 * (1. - alpha) + src as f64 * alpha;
    *dst = result.round() as u8
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::BufWriter;

    #[test]
    fn test_cursor_consts() {
        assert_eq!(WIDTH / 2, WIDTH_HALF);
        assert_eq!(WIDTH_HALF.cast_signed(), WIDTH_HALF_ISIZE);
        assert_eq!(HEIGHT / 2, HEIGHT_HALF);
        assert_eq!(HEIGHT_HALF.cast_signed(), HEIGHT_HALF_ISIZE);
        assert_eq!(CURSOR.len(), WIDTH * HEIGHT * 4);
    }

    #[test]
    fn blit_cursor_image() {
        let mut visual = vec![0; BOARD_D * BOARD_D * STRIDE];
        visual = blit_cursor(0., 0., &mut visual).unwrap();
        visual = blit_cursor(0.4, 0.4, &mut visual).unwrap();
        visual = blit_cursor(-0.4, -0.4, &mut visual).unwrap();
        visual = blit_cursor(-0.51, -0.499, &mut visual).unwrap();
        assert!(blit_cursor(0.6, 0.6, &mut visual).is_none());

        let file = File::create("out.png").unwrap();
        let ref mut w = BufWriter::new(file);

        let mut encoder = png::Encoder::new(w, BOARD_D as u32, BOARD_D as u32); // Width is 2 pixels and height is 1.
        encoder.set_color(png::ColorType::Rgb);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();

        writer.write_image_data(&visual).unwrap();
    }
}
