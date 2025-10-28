use blittle::{blit, PositionU, Size};
use hex_color::HexColor;
use pyo3::{
    exceptions::{PyRuntimeError, PyValueError},
    prelude::*
};
use nodekit_rs_image::from_png;
use nodekit_rs_video::{extract_frame, Audio, Extraction};
use nodekit_rs_visual::{VisualFrame, STRIDE, VISUAL_SIZE};
use crate::{
    media_type::MediaType,
    asset::Asset,
    video_asset::VideoAsset
};

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

fn blit_image(
    image: &mut VisualFrame,
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
        Extraction::Frame { mut video, audio: a } => {
            blit_image(&mut video, src_size, visual, dst_position)?;
            *audio = a;
            Ok(true)
        }
        Extraction::EndOfVideo => Ok(false),
    }
}

pub fn blit_asset(
    asset: Asset,
    time: u64,
    audio: &mut Option<Audio>,
    visual: &mut [u8],
    position: &PositionU,
    size: &Size,
) -> PyResult<()> {
    match asset.media_type {
        MediaType::Image => {
            let mut image =
                from_png(asset.path).map_err(|e| PyValueError::new_err(e.to_string()))?;
            blit_image(&mut image, size, visual, position)?;
        }
        MediaType::Video { muted, looped } => {
            let asset = VideoAsset {
                path: asset.path,
                muted,
                looped,
                time,
            };
            // TODO subtract duration.
            extract_from_video(asset, audio, size, visual, position)?;
        }
    }
    Ok(())
}