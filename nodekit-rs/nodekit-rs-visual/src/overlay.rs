pub const fn get_overlay_color(src: &[u8; 4], dst: &[u8; 3]) -> [u8; 3] {
    let mut dst = *dst;
    overlay(src, &mut dst);
    dst
}

pub const fn overlay(src: &[u8; 4], dst: &mut [u8; 3]) {
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