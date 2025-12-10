mod asset;
mod card_type;
mod region;

pub use region::*;

#[macro_export]
macro_rules! test_extraction {
    ($f:ident, $t:ty) => {
        #[pyfunction]
        pub fn $f(obj: &Bound<'_, PyAny>) -> PyResult<()> {
            obj.extract::<$t>().map(|_| ())
        }
    };
}

pub struct Card {
    pub x: f32,
    pub y: f32,
    pub z_index: Option<i32>,
    pub w: f32,
    pub h: f32,
    pub start_msec: u32,
    pub end_msec: u32,
}