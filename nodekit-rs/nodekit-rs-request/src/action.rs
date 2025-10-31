use glam::DVec2;

/// An action that can be executed by an agent.
#[derive(Clone)]
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
