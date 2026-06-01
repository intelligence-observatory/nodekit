use bytemuck::{cast_slice, cast_slice_mut};
use nodekit_rs_models::board::STRIDE;

pub fn grayscale_to_rgb(buffer: Vec<u8>) -> Vec<u8> {
    let mut dst = vec![0; buffer.len() * STRIDE];
    for (src, dst) in buffer
        .iter()
        .zip(cast_slice_mut::<u8, [u8; STRIDE]>(&mut dst).iter_mut())
    {
        let c = *src;
        dst[0] = c;
        dst[1] = c;
        dst[2] = c;
    }
    dst
}

pub fn grayscale_alpha_to_rgba(buffer: Vec<u8>) -> Vec<u8> {
    let src = cast_slice::<u8, [u8; 2]>(&buffer);
    let mut dst = vec![0; src.len() * 4];
    for (src, dst) in src
        .iter()
        .zip(cast_slice_mut::<u8, [u8; 4]>(&mut dst).iter_mut())
    {
        dst[0] = src[0];
        dst[1] = src[0];
        dst[2] = src[0];
        dst[3] = src[1];
    }
    dst
}

pub fn rgba_to_rgb(buffer: Vec<u8>) -> Vec<u8> {
    let src = cast_slice::<u8, [u8; 4]>(&buffer);
    let mut dst = vec![0; src.len() * 3];
    for (src, dst) in src
        .iter()
        .zip(cast_slice_mut::<u8, [u8; 3]>(&mut dst).iter_mut())
    {
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
    }
    dst
}

#[cfg(test)]
mod tests {
    use crate::convert::{grayscale_alpha_to_rgba, grayscale_to_rgb};
    use nodekit_rs_models::board::STRIDE;

    #[test]
    fn test_grayscale_to_rgb() {
        let w = 400;
        let h = 300;
        let rgb = grayscale_to_rgb(vec![255; w * h]);
        assert_eq!(rgb.len(), w * h * STRIDE);
        assert!(rgb.into_iter().all(|c| c == 255));
    }

    #[test]
    fn test_grayscale_alpha_to_rgba() {
        let w = 400;
        let h = 300;
        let rgb = grayscale_alpha_to_rgba(vec![0; w * h * 2]);
        assert_eq!(rgb.len(), w * h * 4);
        assert!(rgb.into_iter().all(|c| c == 0));
    }
}
