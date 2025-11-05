mod error;

pub use error::VisualFrameError;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
use png::{BitDepth, ColorType, Encoder};
use pyo3::exceptions::{PyFileNotFoundError, PyIOError};
use pyo3::{PyResult, pyclass, pymethods};
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};
use std::{fs::File, io::BufWriter};

/// A raw bitmap `buffer` and its dimensions.
#[gen_stub_pyclass]
#[pyclass]
#[derive(Clone)]
pub struct VisualFrame {
    /// A raw RGB24 bitmap.
    #[pyo3(get)]
    pub buffer: Vec<u8>,
    /// The width of the image.
    #[pyo3(get)]
    pub width: u32,
    /// The height of the image.
    #[pyo3(get)]
    pub height: u32,
}

#[gen_stub_pymethods]
#[pymethods]
impl VisualFrame {
    /// Write the visual frame to disk at `path` as a .png file.
    pub fn save(&self, path: String) -> PyResult<()> {
        let w = BufWriter::new(
            File::create(path).map_err(|e| PyFileNotFoundError::new_err(e.to_string()))?,
        );
        let mut encoder = Encoder::new(w, self.width, self.height);
        encoder.set_color(ColorType::Rgb);
        encoder.set_depth(BitDepth::Eight);
        let mut writer = encoder.write_header().unwrap();
        writer
            .write_image_data(&self.buffer)
            .map_err(|e| PyIOError::new_err(e.to_string()))
    }
}

impl VisualFrame {
    /// Resize this frame to `width` and `height`.
    pub fn resize(&mut self, width: u32, height: u32) -> Result<(), VisualFrameError> {
        self.buffer = Self::resize_buffer(&mut self.buffer, self.width, self.height, width, height)?;
        self.width = width;
        self.height = height;
        Ok(())
    }

    pub fn resize_buffer(
        buffer: &mut [u8],
        src_width: u32,
        src_height: u32,
        dst_width: u32,
        dst_height: u32,
    ) -> Result<Vec<u8>, VisualFrameError> {
        let src = fast_image_resize::images::Image::from_slice_u8(
            src_width,
            src_height,
            buffer,
            PixelType::U8x3,
        )
        .map_err(VisualFrameError::ImageResizeBuffer)?;
        // Resize the image.
        let mut dst = fast_image_resize::images::Image::new(dst_width, dst_height, PixelType::U8x3);
        let options = ResizeOptions {
            algorithm: ResizeAlg::Convolution(FilterType::Bilinear),
            cropping: SrcCropping::None,
            mul_div_alpha: false,
        };
        let mut resizer = Resizer::new();
        resizer
            .resize(&src, &mut dst, Some(&options))
            .map_err(VisualFrameError::ImageResize)?;
        Ok(dst.into_vec())
    }
}
