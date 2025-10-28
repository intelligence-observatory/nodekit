//! Various constants used to describe the size of the visual board,
//! and a means of describing a [`VisualFrame`].

mod error;

use blittle::*;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
use pyo3::pyclass;
pub use error::Error;

pub const VISUAL_D: usize = 768;
pub const VISUAL_D_U32: u32 = 768;
pub const VISUAL_D_ISIZE: isize = 768;
pub const VISUAL_D_F64: f64 = 768.;
pub const VISUAL_D_F64_HALF: f64 = 384.;
pub const VISUAL_SIZE: Size = Size {
    w: VISUAL_D,
    h: VISUAL_D,
};
pub const STRIDE: usize = stride::RGB;

pub const fn spatial_coordinate(value: f64) -> isize {
    (VISUAL_D_F64_HALF + VISUAL_D_F64 * value) as isize
}

pub const fn size_coordinate(value: f64) -> usize {
    (VISUAL_D_F64 * value) as usize
}

/// A raw bitmap `buffer` and its dimensions.
#[pyclass(eq)]
#[derive(Clone, Eq, PartialEq)]
pub struct VisualFrame {
    #[pyo3(get)]
    pub buffer: Vec<u8>,
    #[pyo3(get)]
    pub width: u32,
    #[pyo3(get)]
    pub height: u32,
}

impl VisualFrame {
    /// Resize this frame to `width` and `height`.
    pub fn resize(&mut self, width: u32, height: u32) -> Result<(), Error> {
        let src = fast_image_resize::images::Image::from_slice_u8(
            self.width,
            self.height,
            &mut self.buffer,
            PixelType::U8x3,
        )
            .map_err(Error::ImageResizeBuffer)?;
        // Resize the image.
        let mut dst = fast_image_resize::images::Image::new(width, height, PixelType::U8x3);
        let options = ResizeOptions {
            algorithm: ResizeAlg::Convolution(FilterType::Bilinear),
            cropping: SrcCropping::None,
            mul_div_alpha: false,
        };
        let mut resizer = Resizer::new();
        resizer
            .resize(&src, &mut dst, Some(&options))
            .map_err(Error::ImageResize)?;
        self.buffer = dst.into_vec();
        self.width = width;
        self.height = height;
        Ok(())
    }
}
