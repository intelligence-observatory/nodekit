mod error;

use blittle::Size;
pub use error::Error;
use nodekit_rs_asset::load_asset;
use nodekit_rs_models::{Region, board::*, card::Asset};
use nodekit_rs_visual::*;
use scuffle_ffmpeg::decoder::DecoderOptions;
use scuffle_ffmpeg::{
    AVMediaType, AVPixelFormat, decoder::Decoder, frame::VideoFrame, io::Input, scaler::VideoScaler,
};
use std::io::Cursor;

/// A video asset.
pub struct Video {
    /// The entire video.
    video: Vec<u8>,
    /// A rendered frame bitmap.
    pub frame: RgbBuffer,
    /// The video's framerate.
    framerate: f64,
    /// The duration of the video in milliseconds.
    duration: u64,
    /// The total number of frames.
    num_frames: usize,
    /// If true, this video loops back to start.
    looped: bool,
}

impl Video {
    pub fn new(asset: &Asset, region: &Region, looped: bool) -> Result<Option<Self>, Error> {
        // Load the video.
        let buffer = load_asset(asset).map_err(Error::Asset)?;
        let cursor = Cursor::new(&buffer);
        let input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;

        // Get the video stream.
        let streams = input.streams();
        let video = streams
            .best(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)?;
        // Get the framerate.
        let framerate = video.r_frame_rate().as_f64();

        // Get the size of the video.
        let video_decoder = Decoder::new(&video)
            .map_err(Error::Ffmpeg)?
            .video()
            .map_err(|_| Error::NotVideoDecoder)?;

        let video_size = Size {
            w: video_decoder.width().cast_unsigned() as usize,
            h: video_decoder.height().cast_unsigned() as usize,
        };

        // Drop input so that we can access buffer again.
        drop(input);

        // Get the number of frames.
        let num_frames = Self::get_num_frames(&buffer)?;
        // Get the duration in milliseconds.
        let duration = ((num_frames as f64 / framerate) * 1000.) as u64;

        // Get the rect, resized to fit within the card.
        let mut rect = UnclippedRect::new(region);
        let card_size = rect.size;
        rect.size = video_size;
        rect.resize(&card_size);
        // Get the clipping rect.
        Ok(rect.into_clipped_rect(BOARD_SIZE).map(|rect| Self {
            video: buffer,
            // An empty frame.
            frame: RgbBuffer::from(rect),
            framerate,
            duration,
            num_frames: num_frames.cast_unsigned() as usize,
            looped,
        }))
    }

    /// Returns the frame at t_msec.
    pub fn get_frame(&mut self, t_msec: u64) -> Result<(), Error> {
        // Open the buffer.
        let cursor = Cursor::new(&self.video);
        let mut input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;
        // Get the video stream.
        let streams = input.streams();
        let video = streams
            .best(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)?;
        let video_index = streams
            .best_index(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)? as i32;
        // Get the decoder.
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
        let pixel_format = video_decoder.pixel_format();
        let mut frame_index = 0;

        let target_frame_index = if t_msec < self.duration {
            // Convert the timestamp to a frame number.
            (t_msec as f64 / 1000. * self.framerate) as usize
        } else if self.looped {
            // Convert the timestamp to a frame number, looping over the duration.
            ((t_msec % self.duration) as f64 / 1000. * self.framerate) as usize
        } else {
            // If the timestamp is past the duration, set it to the last frame.
            self.num_frames - 1
        };

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
        // Try to get one of the last frames.
        if !got_frame {
            video_decoder.send_eof().map_err(Error::Ffmpeg)?;
            while let Ok(Some(f)) = video_decoder.receive_frame() {
                frame_index += 1;
                if frame_index >= target_frame_index {
                    frame = Some(f);
                    break;
                }
            }
        }
        let frame = frame.ok_or(Error::NoFrame(t_msec))?;
        // Resize the frame and convert to RGB8.
        let mut scaler = VideoScaler::new(
            frame.width() as i32,
            frame.height() as i32,
            pixel_format,
            self.frame.rect.src_size.w.cast_signed() as i32,
            self.frame.rect.src_size.h.cast_signed() as i32,
            AVPixelFormat::Rgb24,
        )
        .map_err(Error::Ffmpeg)?;
        let frame = scaler.process(&frame).map_err(Error::Ffmpeg)?;
        let data = frame.data(0).ok_or(Error::NoData)?;
        // Copy the frame's data into `self.frame`.
        let width_3 = frame.width() * STRIDE;
        for y in 0..self.frame.rect.src_size.h {
            let row = data.get_row(y).ok_or(Error::NotEnoughRows(y))?;
            let index = y * width_3;
            self.frame.buffer_mut()[index..index + width_3].copy_from_slice(&row[0..width_3]);
        }
        Ok(())
    }

    fn get_num_frames(buffer: &[u8]) -> Result<i64, Error> {
        let cursor = Cursor::new(&buffer);
        let mut input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;
        // Get the video stream.
        let streams = input.streams();
        let stream = streams
            .best(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)?;

        match stream.nb_frames() {
            Some(num_frames) => Ok(num_frames),
            // Some videos might not have the number of frames,
            // in which case we need to calculate it manually.
            None => {
                let index = streams
                    .best_index(AVMediaType::Video)
                    .ok_or(Error::NoVideoTrack)? as i32;
                let mut decoder = Decoder::with_options(
                    &stream,
                    DecoderOptions {
                        codec: None,
                        thread_count: 2,
                    },
                )
                .map_err(Error::Ffmpeg)?
                .video()
                .map_err(|_| Error::NotVideoDecoder)?;
                let mut num_frames = 0;
                for packet in input.packets() {
                    let packet = packet.map_err(Error::Ffmpeg)?;
                    if packet.stream_index() == index {
                        decoder.send_packet(&packet).map_err(Error::Ffmpeg)?;
                        while let Ok(Some(_)) = decoder.receive_frame() {
                            num_frames += 1;
                        }
                    }
                }
                decoder.send_eof().map_err(Error::Ffmpeg)?;
                while let Ok(Some(_)) = decoder.receive_frame() {
                    num_frames += 1;
                }
                Ok(num_frames)
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nodekit_rs_models::{Region, card::Asset};
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
        let mut video = Video::new(
            &Asset::Path(PathBuf::from("test-video.mp4")),
            &region,
            false,
        )
        .unwrap()
        .unwrap();

        video.get_frame(300).unwrap();

        // Write the frame.
        nodekit_rs_png::rgb_to_png(
            "frame.png",
            video.frame.buffer_ref(),
            video.frame.rect.src_size.w as u32,
            video.frame.rect.src_size.h as u32,
        );

        let mut board = Board::new([255, 255, 255]);
        board.blit_rgb(&video.frame);
        nodekit_rs_png::board_to_png("board.png", board.render());
    }

    #[test]
    fn test_end_of_video() {
        let region = Region {
            x: -200,
            y: -400,
            w: 410,
            h: 614,
            z_index: None,
        };
        let mut video = Video::new(
            &Asset::Path(PathBuf::from("test-video.mp4")),
            &region,
            false,
        )
        .unwrap()
        .unwrap();

        assert_eq!(video.duration, 2000);

        // Get the last frame.
        video.get_frame(1990).unwrap();
        let a = video.frame.buffer_ref().to_vec();
        // Test whether a timestamp greater than the duration clamps to the last frame.
        video.get_frame(3000).unwrap();
        let b = video.frame.buffer_ref().to_vec();
        assert_eq!(a, b);

        // Test looping.
        video.looped = true;
        video.get_frame(120).unwrap();
        let a = video.frame.buffer_ref().to_vec();
        video.get_frame(2126).unwrap();
        let b = video.frame.buffer_ref().to_vec();
        assert_eq!(a, b);
    }
}
