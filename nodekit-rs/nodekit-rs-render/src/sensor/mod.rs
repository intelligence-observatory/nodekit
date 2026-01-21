mod hover;
mod select;

pub use hover::Hover;
pub use select::Select;

pub enum Sensor {
    Hover(Hover),
    Select(Select),
}