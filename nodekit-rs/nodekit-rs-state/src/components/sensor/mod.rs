mod timeout;
mod click;
mod key;
mod submit;

use crate::components::EntityState;
use slotmap::new_key_type;
pub use click::*;
pub use key::*;
pub use submit::*;
pub use timeout::*;

new_key_type! { pub struct SensorKey; }

pub struct Sensor {
    pub state: EntityState,
}