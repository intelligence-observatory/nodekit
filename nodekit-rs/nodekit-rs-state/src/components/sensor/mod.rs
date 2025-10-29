mod click;
mod key;
mod submit;
mod timeout;

use crate::components::EntityState;
pub use click::*;
pub use key::*;
use slotmap::new_key_type;
pub use submit::*;
pub use timeout::*;

new_key_type! { pub struct SensorKey; }

pub struct Sensor {
    pub state: EntityState,
    pub id: String,
}
