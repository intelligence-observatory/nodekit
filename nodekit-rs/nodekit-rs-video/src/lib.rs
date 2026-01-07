mod error;

use blittle::Size;
pub use error::Error;
use nodekit_rs_asset::load_asset;
use nodekit_rs_models::{Asset, Region, board::*};
use nodekit_rs_visual::*;
use scuffle_ffmpeg::decoder::DecoderOptions;
use scuffle_ffmpeg::{
    AVMediaType, AVPixelFormat, decoder::Decoder, frame::VideoFrame, io::Input, scaler::VideoScaler,
};
use std::io::Cursor;

pub struct Video {
    pub buffer: Vec<u8>,
    pub rgb_buffer: RgbBuffer,
    framerate: f64,
}

impl Video {
    pub fn new(asset: &Asset, region: &Region) -> Result<Option<Self>, Error> {
        // Load the video.
        let buffer = load_asset(asset).map_err(Error::Asset)?;

        // Get metadata.
        let cursor = Cursor::new(&buffer);
        let input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;
        // Get the streams.
        let streams = input.streams();
        let video = streams
            .best(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)?;
        let framerate = video.r_frame_rate().as_f64();
        let video_decoder = Decoder::new(&video)
            .map_err(Error::Ffmpeg)?
            .video()
            .map_err(|_| Error::NotVideoDecoder)?;
        let video_size = Size {
            w: video_decoder.width().cast_unsigned() as usize,
            h: video_decoder.height().cast_unsigned() as usize,
        };
        drop(input);

        // Get the rect, resized to fit within the card.
        let mut rect = UnclippedRect::new(region);
        let card_size = rect.size;
        rect.size = video_size;
        rect.resize(&card_size);
        // Get the clipping rect.
        Ok(rect.into_clipped_rect(BOARD_SIZE).map(|rect| Self {
            buffer,
            rgb_buffer: RgbBuffer::from(rect),
            framerate,
        }))
    }

    pub fn get_frame(&mut self, t_msec: u64) -> Result<(), Error> {
        // Open the buffer.
        let cursor = Cursor::new(&self.buffer);
        let mut input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;
        // Get the streams.
        let streams = input.streams();
        let video = streams
            .best(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)?;
        let video_index = streams
            .best_index(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)? as i32;
        let mut video_decoder = Decoder::with_options(
            &video,
            DecoderOptions {
                codec: None,
                thread_count: 2,
            },
        )
        .map_err(Error::Ffmpeg)?
        .video()
        .map_err(|_| Error::NotVideoDecoder)?;
        let mut frame_index = 0;
        let target_frame_index = (t_msec as f64 / 1000. * self.framerate) as usize;
        let mut frame: Option<VideoFrame> = None;
        let mut got_frame = false;
        for packet in input.packets() {
            let packet = packet.map_err(Error::Ffmpeg)?;
            if packet.stream_index() == video_index {
                video_decoder.send_packet(&packet).map_err(Error::Ffmpeg)?;
                while let Ok(Some(f)) = video_decoder.receive_frame() {
                    frame_index += 1;
                    if frame_index >= target_frame_index {
                        frame = Some(f);
                        got_frame = true;
                        break;
                    }
                }
            }
            if got_frame {
                break;
            }
        }
        let frame = frame.ok_or(Error::NoFrame(t_msec))?;
        let mut scaler = VideoScaler::new(
            frame.width() as i32,
            frame.height() as i32,
            AVPixelFormat::Yuv420p,
            self.rgb_buffer.rect.src_size.w.cast_signed() as i32,
            self.rgb_buffer.rect.src_size.h.cast_signed() as i32,
            AVPixelFormat::Rgb24,
        )
        .map_err(Error::Ffmpeg)?;
        let frame = scaler.process(&frame).map_err(Error::Ffmpeg)?;
        let data = frame.data(0).ok_or(Error::NoData)?;
        let width_3 = frame.width() * STRIDE;
        for y in 0..self.rgb_buffer.rect.src_size.h {
            let row = data.get_row(y).ok_or(Error::NotEnoughRows(y))?;
            let index = y * width_3;
            self.rgb_buffer.buffer_mut()[index..index + width_3].copy_from_slice(&row[0..width_3]);
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nodekit_rs_models::{Asset, Region};
    use std::path::PathBuf;

    #[test]
    fn test_video() {
        let region = Region {
            x: -200,
            y: -400,
            w: 410,
            h: 614,
            z_index: None,
        };
        let mut video = Video::new(&Asset::Path(PathBuf::from("test-video.mp4")), &region)
            .unwrap()
            .unwrap();

        video.get_frame(300).unwrap();

        // Write the frame.
        nodekit_rs_png::rgb_to_png(
            "frame.png",
            video.rgb_buffer.buffer_ref(),
            video.rgb_buffer.rect.src_size.w as u32,
            video.rgb_buffer.rect.src_size.h as u32,
        );

        let mut board = Board::new([255, 255, 255]);
        board.blit_rgb(&video.rgb_buffer);
        nodekit_rs_png::board_to_png("board.png", board.get_board_without_cursor());
    }
}
