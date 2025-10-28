use std::path::PathBuf;
use blittle::{clip, PositionI, PositionU, Size};
use pyo3::prelude::*;
use pyo3::types::{PyBool, PyFloat, PyString};
use nodekit_rs_visual::{size_coordinate, spatial_coordinate, VISUAL_SIZE};
use crate::asset::Asset;
use crate::media_type::MediaType;

fn get_f64(card: &Bound<PyAny>, name: &str) -> PyResult<f64> {
    Ok(card.getattr(name)?.cast::<PyFloat>()?.value())
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

pub fn get_rect(card: &Bound<PyAny>) -> PyResult<(PositionU, Size)> {
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

pub fn get_asset(card: &Bound<PyAny>) -> PyResult<Option<Asset>> {
    if let Ok(image) = card.getattr("image") {
        Ok(Some(Asset {
            path: get_path(&image)?,
            media_type: MediaType::Image,
        }))
    } else if let Ok(video) = card.getattr("video") {
        Ok(Some(Asset {
            path: get_path(&video)?,
            media_type: MediaType::Video {
                muted: get_bool(card, "muted")?,
                looped: get_bool(card, "loop")?,
            },
        }))
    } else {
        Ok(None)
    }
}