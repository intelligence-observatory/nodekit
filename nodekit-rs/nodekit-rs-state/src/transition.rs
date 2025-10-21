use crate::{components::*, node::NodeKey};

pub struct Transition {
    pub sensor: SensorKey,
    pub from: NodeKey,
}
