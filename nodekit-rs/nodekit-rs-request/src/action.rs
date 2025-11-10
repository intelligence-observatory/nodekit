use glam::DVec2;
use serde::{Deserialize, Serialize};

/// An action that can be executed by an agent.
#[derive(Clone, Deserialize, Serialize)]
pub enum Action {
    Mouse {
        delta: Option<DVec2>,
        clicked: bool,
    },
    /// Press a key.
    KeyPress(String),
    /// TODO
    Submit(),
}
