mod timer;
mod media_type;
mod card;

use pyo3::prelude::*;
use media_type::MediaType;
use timer::Timer;
use card::Card;
use nodekit_rs_render::Frame;

#[pyclass]
pub struct Node {
    pub cards: Vec<Card>
}

#[pymethods]
impl Node {
    pub fn render(&self, time: u64) -> PyResult<Frame> {
        let mut images = Vec::default();
        let mut videos = Vec::default();
        self.cards.iter().filter(|card| {
            card.timer.t1.map(|t1| {
                card.timer.t0 >= time && time < t1
            })
        }).for_each(|card| {
            
        })
    }
}