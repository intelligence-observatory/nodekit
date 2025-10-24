mod audio;
mod board;
mod card_rect;
mod error;
mod image;
mod rect;
mod video;

use crate::audio::AudioBuilder;
use crate::board::{BOARD_D, BOARD_SIZE, STRIDE};
use blittle::blit;
pub use error::Error;
use fast_image_resize::{FilterType, PixelType, ResizeAlg, ResizeOptions, Resizer, SrcCropping};
pub use image::Image;
pub use rect::Rect;
pub use video::Video;

pub struct Frame {
    pub visual: Vec<u8>,
    pub audio: Option<Vec<f32>>,
}

impl Frame {
    pub fn new(images: Vec<Image>, videos: Vec<Video>) -> Self {
        let mut visual = vec![0; BOARD_D * BOARD_D * STRIDE];
        let mut audio = None;
        let mut audio_builder = AudioBuilder::default();
        for image in images {
            blit(
                &image.image,
                &image.rect.size,
                &mut visual,
                &image.rect.position,
                &BOARD_SIZE,
                STRIDE,
            );
        }
        let multi_video = videos.len() > 1;
        for video in videos {
            blit(
                &video.video,
                &video.rect.size,
                &mut visual,
                &video.rect.position,
                &BOARD_SIZE,
                STRIDE,
            );
            if let Some(a) = video.audio {
                let converted = AudioBuilder::convert(&a);
                // We will need to overlay.
                if multi_video {
                    audio_builder.overlay(converted);
                } else {
                    audio = Some(converted);
                }
            }
        }
        // Finish overlaying.
        if multi_video {
            audio = Some(audio_builder.finish())
        }
        Self { visual, audio }
    }

    pub(crate) fn resize(
        buffer: &mut [u8],
        src_width: u32,
        src_height: u32,
        dst_width: f64,
        dst_height: f64,
    ) -> Result<Vec<u8>, Error> {
        let dst_width = Rect::size_coordinate(dst_width) as u32;
        let dst_height = Rect::size_coordinate(dst_height) as u32;
        let src = fast_image_resize::images::Image::from_slice_u8(
            src_width,
            src_height,
            buffer,
            PixelType::U8x3,
        )
        .map_err(Error::ImageResizeBuffer)?;
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
            .map_err(Error::ImageResize)?;
        Ok(dst.into_vec())
    }
}
