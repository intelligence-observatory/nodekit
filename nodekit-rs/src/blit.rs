use crate::rect::Rect;
use crate::video_indices::VideoIndices;
use blittle::*;
use hex_color::HexColor;
use nodekit_rs_audio::AudioFrame;
use nodekit_rs_image::from_png;
use nodekit_rs_video::{Extraction, extract_frame};
use nodekit_rs_visual::{STRIDE, VISUAL_SIZE, VisualFrame};
use pyo3::exceptions::{PyRuntimeError, PyValueError};
use pyo3::prelude::*;
use pyo3::types::{PyBool, PyString};
use std::path::{Path, PathBuf};

/// Fill the visual buffer with the board color.
pub fn fill_visual(node: &Bound<'_, PyAny>, visual: &mut [u8]) -> PyResult<()> {
    let color = HexColor::parse(node.getattr("board_color")?.str()?.to_str()?)
        .map_err(|e| PyValueError::new_err(e.to_string()))?;
    visual.chunks_exact_mut(3).for_each(|pixel| {
        pixel[0] = color.r;
        pixel[1] = color.g;
        pixel[2] = color.b;
    });
    Ok(())
}

/// Blit a `VisualFrame` onto the `visual` buffer.
fn blit_image(image: &mut VisualFrame, visual: &mut [u8], rect: &Rect) -> PyResult<()> {
    // Resize the image.
    image
        .resize(rect.size.w as u32, rect.size.h as u32)
        .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
    // Blit.
    blit(
        &image.buffer,
        &rect.size,
        visual,
        &rect.position,
        &VISUAL_SIZE,
        STRIDE,
    );
    Ok(())
}

fn get_path(media: &Bound<PyAny>) -> PyResult<PathBuf> {
    Ok(PathBuf::from(
        media
            .getattr("locator")?
            .getattr("path")?
            .getattr("as_posix")?
            .call0()?
            .cast::<PyString>()?
            .to_string(),
    ))
}

fn get_bool(media: &Bound<PyAny>, name: &str) -> PyResult<bool> {
    Ok(media.getattr(name)?.cast::<PyBool>()?.is_true())
}

/// Extract the video frame.
/// Loop if needed.
fn extract_from_video(
    card: &Bound<PyAny>,
    video: Bound<PyAny>,
    time: u64,
    audio: &mut Option<AudioFrame>,
    visual: &mut [u8],
) -> PyResult<()> {
    let path = get_path(&video)?;
    let muted = get_bool(card, "muted")?;
    let looped = get_bool(card, "loop")?;
    let rect = Rect::new(card)?;
    let mut video_indices = VideoIndices::default();
    if looped {
        let mut num_its = 0;
        while num_its < 1000
            && !try_extract_frame(&path, time, muted, audio, visual, &rect, &mut video_indices)?
        {
            num_its += 1;
        }
        Ok(())
    } else {
        try_extract_frame(&path, time, muted, audio, visual, &rect, &mut video_indices).map(|_| ())
    }
}

/// Try to extract and blit the video frame at `time`.
fn try_extract_frame(
    path: &Path,
    time: u64,
    muted: bool,
    audio: &mut Option<AudioFrame>,
    visual: &mut [u8],
    rect: &Rect,
    indices: &mut VideoIndices,
) -> PyResult<bool> {
    match extract_frame(path, time, muted, &mut indices.audio, &mut indices.video)
        .map_err(|e| PyRuntimeError::new_err(e.to_string()))?
    {
        Extraction::Frame {
            mut video,
            audio: a,
        } => {
            blit_image(&mut video, visual, rect)?;
            *audio = a;
            Ok(true)
        }
        Extraction::EndOfVideo => Ok(false),
    }
}

/// Blit `card` at `time` onto `visual`.
/// Possibly set `audio` too.
pub fn blit_card(
    card: &Bound<PyAny>,
    time: u64,
    audio: &mut Option<AudioFrame>,
    visual: &mut [u8],
) -> PyResult<()> {
    // Blit the image.
    if let Ok(image) = card.getattr("image") {
        let path = get_path(&image)?;
        let mut image = from_png(path).map_err(|e| PyValueError::new_err(e.to_string()))?;
        blit_image(&mut image, visual, &Rect::new(card)?)?;
    }
    // Extract the frame at `time` and blit.
    else if let Ok(video) = card.getattr("video") {
        // TODO subtract duration.
        extract_from_video(card, video, time, audio, visual)?;
    }
    Ok(())
}
