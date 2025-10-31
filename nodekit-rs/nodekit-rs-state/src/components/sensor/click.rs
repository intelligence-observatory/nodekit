use crate::rect::Rect;
use nodekit_rs_graph::Mask;
use slotmap::new_key_type;

new_key_type! { pub struct ClickSensorKey; }

#[derive(Default)]
pub struct ClickSensor {
    pub rect: Rect,
    pub mask: Mask,
}

impl From<&nodekit_rs_graph::ClickSensor> for ClickSensor {
    fn from(value: &nodekit_rs_graph::ClickSensor) -> Self {
        let rect = Rect::new(value.x.0, value.y.0, value.w.0, value.h.0);
        Self {
            rect,
            mask: value.mask,
        }
    }
}
