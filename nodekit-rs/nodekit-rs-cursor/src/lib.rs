mod clamped;

use crate::clamped::Clamped;
use bytemuck::{cast_slice, cast_slice_mut};
use nodekit_rs_visual::*;
use std::slice::from_raw_parts_mut;

const DIAMETER: usize = 32;
const RADIUS: usize = 16;
const RADIUS_I: isize = 16;
const CURSOR: &[u8] = include_bytes!("../cursor");

/// Blit the cursor onto the `visual` image.
///
/// `x` and `y` are between -0.5 and 0.5, with 0.0 being the center of `visual`.
pub fn blit_cursor(x: f64, y: f64, visual: &mut [u8]) {
    if let Some(x) = Clamped::new(x)
        && let Some(y) = Clamped::new(y)
    {
        // Convert the cursor to a 3D RGBA array.
        let cursor = cast_slice::<u8, [[u8; 4]; DIAMETER]>(CURSOR);
        // Break the visual bitmap into row slices.
        // We can't use bytemuck for this, but it's very safe, because we're using constants.
        let ptr = visual.as_mut_ptr().cast::<[[u8; 3]; VISUAL_D]>();
        unsafe {
            // Iterate through each row we need to blit from and to.
            for (dst, src) in from_raw_parts_mut(ptr, VISUAL_D)[y.dst_0..y.dst_1]
                .iter_mut()
                .zip(cursor[y.src_0..y.src_1].iter())
            {
                // Iterate through each column we need to blit from and to.
                for (dst, src) in dst[x.dst_0..x.dst_1].iter_mut().zip(&src[x.src_0..x.src_1]) {
                    // Ignore alpha.
                    if src[3] > 0 {
                        // RGB.
                        dst[0] = src[0];
                        dst[1] = src[1];
                        dst[2] = src[2];
                    }
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::BufWriter;

    #[test]
    fn test_cursor_image() {
        assert_eq!(CURSOR.len(), DIAMETER * DIAMETER * 4);
    }

    #[test]
    fn blit_cursor_image() {
        let mut visual = vec![0; VISUAL_D * VISUAL_D * STRIDE];
        blit_cursor(0., 0., &mut visual);
        blit_cursor(0.4, 0.4, &mut visual);
        blit_cursor(-0.4, -0.4, &mut visual);
        blit_cursor(-0.51, -0.499, &mut visual);
        blit_cursor(0.6, 0.6, &mut visual);

        let file = File::create("out.png").unwrap();
        let ref mut w = BufWriter::new(file);

        let mut encoder = png::Encoder::new(w, VISUAL_D as u32, VISUAL_D as u32); // Width is 2 pixels and height is 1.
        encoder.set_color(png::ColorType::Rgb);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();

        writer.write_image_data(&visual).unwrap();
    }
}
