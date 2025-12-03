mod error;

pub use error::Error;
use nodekit_rs_models::Card;
use nodekit_rs_visual::*;
use scuffle_ffmpeg::decoder::DecoderOptions;
use scuffle_ffmpeg::{
    AVMediaType, AVPixelFormat, decoder::Decoder, frame::VideoFrame, io::Input, scaler::VideoScaler,
};
use std::fs::read;
use std::io::Cursor;

pub struct Video {
    pub buffer: Vec<u8>,
    pub width: usize,
    pub height: usize,
    pub rect: Rect,
}

impl Video {
    pub fn new(card: &Card, video: &nodekit_rs_models::Video) -> Result<Self, Error> {
        // Load the video.
        let buffer = read(&video.path).map_err(|e| Error::FileNotFound(video.path.clone(), e))?;
        let (width, height) = Self::get_size(&buffer)?;
        let rect = Rect::from(ResizedRect::new(&card.rect, width as u32, height as u32));
        Ok(Self {
            buffer,
            rect,
            width,
            height,
        })
    }

    fn get_size(buffer: &[u8]) -> Result<(usize, usize), Error> {
        let cursor = Cursor::new(buffer);
        let input = Input::seekable(cursor).map_err(Error::Ffmpeg)?;
        // Get the streams.
        let streams = input.streams();
        let video = streams
            .best(AVMediaType::Video)
            .ok_or(Error::NoVideoTrack)?;
        let video_decoder = Decoder::new(&video)
            .map_err(Error::Ffmpeg)?
            .video()
            .map_err(|_| Error::NotVideoDecoder)?;
        Ok((
            video_decoder.width().cast_unsigned() as usize,
            video_decoder.height().cast_unsigned() as usize,
        ))
    }

    pub fn get_frame(&self, t_msec: u64) -> Result<RgbBuffer, Error> {
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
        let target_frame_index = (t_msec as f64 / 1000. * video.r_frame_rate().as_f64()) as usize;
        let mut frame: Option<VideoFrame> = None;
        let mut got_frame = false;
        for packet in input.packets() {
            let packet = packet.map_err(Error::Ffmpeg)?;
            if packet.stream_index() == video_index {
                video_decoder.send_packet(&packet).map_err(Error::Ffmpeg)?;
                while let Ok(Some(f)) = video_decoder.receive_frame() {
                    frame = Some(f);
                    frame_index += 1;
                    if frame_index >= target_frame_index {
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
            self.width.cast_signed() as i32,
            self.height.cast_signed() as i32,
            AVPixelFormat::Rgb24,
        )
        .map_err(Error::Ffmpeg)?;
        let frame = scaler.process(&frame).map_err(Error::Ffmpeg)?;
        let data = frame.data(0).ok_or(Error::NoData)?;
        let width_3 = frame.width() * STRIDE;
        let mut out = vec![0; width_3 * frame.height()];
        for y in 0..self.height {
            let row = data.get_row(y).ok_or(Error::NotEnoughRows(y))?;
            let index = y * width_3;
            out[index..index + width_3].copy_from_slice(&row[0..width_3]);
        }
        Ok(RgbBuffer::new(out, self.rect.clone()))
    }
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;
    use super::*;
    use nodekit_rs_models::{CardType, Position, Size, Timer};

    #[test]
    fn test_video() {


        let card = Card::video_card(nodekit_rs_models::Rect {
            position: Position { x: 0., y: 0.1 },
            size: Size { w: 0.4, h: 0.6 },
        }, Timer::new(0, None), PathBuf::from("test-video.mp4"), false, None);
        let video = if let CardType::Video(video) = &card.card_type {
            video
        }
        else {
            panic!("oh no")
        };
        let video = Video::new(&card, video).unwrap();

        let frame = video.get_frame(300).unwrap();

        // Write the frame.
        nodekit_rs_png::rgb_to_png("frame.png", frame.buffer_ref(), video.width as u32, video.height as u32);

        let mut board = Board::new([255, 255, 255]);
        board.blit_rgb(&frame);
        nodekit_rs_png::board_to_png("board.png", board.get_board_without_cursor());
    }
}
