mod asset;
mod media_type;
mod video_asset;

use asset::Asset;
use blittle::*;
use hex_color::HexColor;
use media_type::MediaType;
use nodekit_rs_image::Image;
use nodekit_rs_video::{Audio, Extraction, extract_frame};
use nodekit_rs_visual::*;
use pyo3::{
    exceptions::{PyRuntimeError, PyValueError},
    prelude::*,
    types::{PyBool, PyFloat, PyString},
};
use std::path::PathBuf;
use video_asset::VideoAsset;

fn fill_visual(node: &Bound<'_, PyAny>, visual: &mut [u8]) -> PyResult<()> {
    let color = HexColor::parse(node.getattr("board_color")?.str()?.to_str()?)
        .map_err(|e| PyValueError::new_err(e.to_string()))?;
    visual.chunks_exact_mut(3).for_each(|pixel| {
        pixel[0] = color.r;
        pixel[1] = color.g;
        pixel[2] = color.b;
    });
    Ok(())
}

fn get_f64(card: &Bound<PyAny>, name: &str) -> PyResult<f64> {
    Ok(card.getattr(name)?.cast::<PyFloat>()?.value())
}

fn is_active_at_time(card: &Bound<PyAny>, time: u64) -> PyResult<bool> {
    let t0 = card.getattr("start_msec")?.extract::<u64>()?;
    let t1 = card.getattr("end_msec")?.extract::<Option<u64>>()?;
    Ok(t0 >= time
        && match t1 {
            Some(t1) => t1 < time,
            None => false,
        })
}

fn get_path(media: &Bound<PyAny>) -> PyResult<PathBuf> {
    Ok(PathBuf::from(
        media.getattr("locator")?.cast::<PyString>()?.to_string(),
    ))
}

fn get_bool(media: &Bound<PyAny>, name: &str) -> PyResult<bool> {
    Ok(media.getattr(name)?.cast::<PyBool>()?.is_true())
}

fn get_rect(card: &Bound<PyAny>) -> PyResult<(PositionU, Size)> {
    let position = PositionI {
        x: spatial_coordinate(get_f64(card, "x")?),
        y: spatial_coordinate(get_f64(card, "x")?),
    };
    let mut size = Size {
        w: size_coordinate(get_f64(card, "w")?),
        h: size_coordinate(get_f64(card, "h")?),
    };
    let position = clip(&position, &VISUAL_SIZE, &mut size);
    Ok((position, size))
}

fn get_asset(card: &Bound<PyAny>) -> PyResult<Option<Asset>> {
    if let Ok(image) = card.getattr("image") {
        Ok(Some(Asset {
            path: get_path(&image)?,
            media_type: MediaType::Image,
        }))
    } else if let Ok(video) = card.getattr("video") {
        Ok(Some(Asset {
            path: get_path(&video)?,
            media_type: MediaType::Video {
                muted: get_bool(&video, "muted")?,
                looped: get_bool(&video, "loop")?,
            },
        }))
    } else {
        Ok(None)
    }
}

fn blit_image(
    image: &mut Image,
    src_size: &Size,
    visual: &mut [u8],
    dst_position: &PositionU,
) -> PyResult<()> {
    // Resize the image.
    image
        .resize(src_size.w as u32, src_size.h as u32)
        .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
    // Blit.
    blit(
        &image.buffer,
        src_size,
        visual,
        dst_position,
        &VISUAL_SIZE,
        STRIDE,
    );
    Ok(())
}

fn extract_from_video(
    video_asset: VideoAsset,
    audio: &mut Option<Audio>,
    src_size: &Size,
    visual: &mut [u8],
    dst_position: &PositionU,
) -> PyResult<()> {
    let mut audio_index = 0;
    let mut video_index = 0;
    if video_asset.looped {
        let mut num_its = 0;
        while num_its < 1000
            && !try_extract_frame(
                &video_asset,
                audio,
                src_size,
                visual,
                dst_position,
                &mut audio_index,
                &mut video_index,
            )?
        {
            num_its += 1;
        }
        Ok(())
    } else {
        try_extract_frame(
            &video_asset,
            audio,
            src_size,
            visual,
            dst_position,
            &mut audio_index,
            &mut video_index,
        )
        .map(|_| ())
    }
}

fn try_extract_frame(
    video_asset: &VideoAsset,
    audio: &mut Option<Audio>,
    src_size: &Size,
    visual: &mut [u8],
    dst_position: &PositionU,
    audio_index: &mut usize,
    video_index: &mut usize,
) -> PyResult<bool> {
    match extract_frame(
        &video_asset.path,
        video_asset.time,
        video_asset.muted,
        audio_index,
        video_index,
    )
    .map_err(|e| PyRuntimeError::new_err(e.to_string()))?
    {
        Extraction::Frame { video, audio: a } => {
            let mut image = Image {
                buffer: video.frame,
                width: video.width,
                height: video.height,
            };
            blit_image(&mut image, src_size, visual, dst_position)?;
            *audio = a;
            Ok(true)
        }
        Extraction::EndOfVideo => Ok(false),
    }
}

#[pymodule]
pub mod nodekit_rs {
    use super::*;
    use nodekit_rs_cursor::blit_cursor;
    use pyo3::types::PyDict;

    #[pyclass]
    pub struct Frame {
        #[pyo3(get)]
        pub visual: Vec<u8>,
        pub audio: Option<Audio>,
    }

    #[pyfunction]
    pub fn render(
        node: &Bound<'_, PyAny>,
        cursor_x: f64,
        cursor_y: f64,
        time: u64,
    ) -> PyResult<Frame> {
        let mut visual = vec![0u8; VISUAL_D * VISUAL_D * STRIDE];
        let mut audio = None;
        // Fill the visual.
        fill_visual(node, &mut visual)?;
        // Add cards.
        for card in node.getattr("cards")?.cast::<PyDict>()?.values() {
            // Ignore cards before or after `time`.
            if is_active_at_time(&card, time)? {
                // Get the blit-able position and size of the card.
                let (position, size) = get_rect(&card)?;
                // Got an asset.
                if let Some(asset) = get_asset(&card)? {
                    match asset.media_type {
                        MediaType::Image => {
                            let mut image = Image::from_png(asset.path)
                                .map_err(|e| PyValueError::new_err(e.to_string()))?;
                            blit_image(&mut image, &size, &mut visual, &position)?;
                        }
                        MediaType::Video { muted, looped } => {
                            let asset = VideoAsset {
                                path: asset.path,
                                muted,
                                looped,
                                time,
                            };
                            // TODO subtract duration.
                            extract_from_video(asset, &mut audio, &size, &mut visual, &position)?;
                        }
                    }
                }
            }
        }

        // Blit the cursor on top of everything.
        blit_cursor(cursor_x, cursor_y, &mut visual);

        Ok(Frame { visual, audio })
    }
}
