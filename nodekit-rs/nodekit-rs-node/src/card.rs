
use pyo3::prelude::*;
use nodekit_rs_render::CardRect;
use crate::{MediaType, Timer};

#[pyclass]
pub struct Card {
    pub rect: CardRect,
    pub media_type: MediaType,
    pub path: String,
    pub timer: Timer
}

#[pymethods]
impl Card {
    #[new]
    pub fn new(card: &Bound<'_, PyAny>) -> PyResult<Self> {
        let x = card.getattr("x")?.extract::<f64>()?;
        let y = card.getattr("y")?.extract::<f64>()?;
        let w = card.getattr("w")?.extract::<f64>()?;
        let h = card.getattr("h")?.extract::<f64>()?;
        let rect = CardRect {
            x,
            y,
            w,
            h
        };
        let (path, media_type) = if let Ok(image) = card.getattr("image") {
            (Self::get_path(&image)?, MediaType::Image)
        }
        else if let Ok(video) = card.getattr("video") {
            (Self::get_path(&video)?, MediaType::Video {
                muted: video.getattr("muted")?.extract::<bool>()?,
                looped: video.getattr("loop")?.extract::<bool>()?
            })
        }
        else {
            todo!("error handling")
        };
        let t0 = card.getattr("start_msec")?.extract::<u64>()?;
        let t1 = card.getattr("end_msec")?.extract::<Option<u64>>()?;
        let timer = Timer::new(t0, t1);
        Ok(Self {
            rect,
            path,
            media_type,
            timer
        })
    }
}

impl Card {
    fn get_path(media: &Bound<'_, PyAny>) -> PyResult<String> {
        media.getattr("locator")?.extract::<String>()
    }
}