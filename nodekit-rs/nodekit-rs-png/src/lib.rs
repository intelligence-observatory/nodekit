//! This crate is used only for test renders.

use nodekit_rs_models::board::*;
use png::ColorType;
use std::fs::File;
use std::io::BufWriter;

pub fn board_to_png(filename: &str, board: &[u8]) {
    to_png(
        filename,
        board,
        HORIZONTAL.u_32,
        VERTICAL.u_32,
        ColorType::Rgb,
    );
}

pub fn rgb_to_png(filename: &str, buffer: &[u8], width: u32, height: u32) {
    to_png(filename, buffer, width, height, ColorType::Rgb);
}

pub fn rgba_to_png(filename: &str, buffer: &[u8], width: u32, height: u32) {
    to_png(filename, buffer, width, height, ColorType::Rgba);
}

fn to_png(filename: &str, buffer: &[u8], width: u32, height: u32, color_type: ColorType) {
    let mut file = File::create(filename).unwrap();
    let w = BufWriter::new(&mut file);
    let mut encoder = png::Encoder::new(w, width, height);
    encoder.set_color(color_type);
    encoder.set_depth(png::BitDepth::Eight);
    let mut writer = encoder.write_header().unwrap();
    writer.write_image_data(buffer).unwrap();
}
