mod card;
mod media_type;
mod timer;

use card::Card;
use media_type::MediaType;
use nodekit_rs_render::Frame;
use pyo3::prelude::*;
use timer::Timer;

#[pyclass]
pub struct Node {
    pub cards: Vec<Card>,
}

#[pymethods]
impl Node {
    pub fn render(&self, time: u64) -> PyResult<Frame> {
        let mut images = Vec::default();
        let mut videos = Vec::default();
        self.cards
            .iter()
            .filter(|card| card.timer.t1.map(|t1| card.timer.t0 >= time && time < t1))
            .for_each(|card| {})
    }
}
