use blittle::*;
use pyo3::exceptions::PyTypeError;
use crate::{MediaType, Timer};
use pyo3::prelude::*;
use crate::rect::Rect;

pub struct Card {
    pub media_type: MediaType,
    pub path: String,
    pub rect: Rect,
    pub timer: Timer,
}

impl Card {
    pub fn new(card: &Bound<'_, PyAny>) -> PyResult<Self> {
        let rect = Rect {
            x: Self::get_f64(card, "x")?,
            y: Self::get_f64(card, "y")?,
            w: Self::get_f64(card, "w")?,
            h: Self::get_f64(card, "h")?,
        };
        let (path, media_type) = if let Ok(image) = card.getattr("image") {
            (Self::get_path(&image)?, MediaType::Image)
        } else if let Ok(video) = card.getattr("video") {
            (
                Self::get_path(&video)?,
                MediaType::Video {
                    muted: video.getattr("muted")?.extract::<bool>()?,
                    looped: video.getattr("loop")?.extract::<bool>()?,
                },
            )
        } else {
            todo!("error handling")
        };
        let t0 = card.getattr("start_msec")?.extract::<u64>()?;
        let t1 = card.getattr("end_msec")?.extract::<Option<u64>>()?;
        let timer = Timer { t0, t1 };
        Ok(Self {
            rect,
            path,
            media_type,
            timer,
        })
    }

    fn get_path(media: &Bound<'_, PyAny>) -> PyResult<String> {
        media.getattr("locator")?.extract::<String>()
    }

    fn get_f64(card: &Bound<'_, PyAny>, value: &str) -> PyResult<f64> {
        card.getattr(value)?.extract::<f64>()
    }
}
