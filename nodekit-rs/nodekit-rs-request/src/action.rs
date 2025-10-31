/// An action that can be executed by an agent.
#[derive(Clone)]
pub enum Action {
    /// Click at `(x, y)` where `x` and `y` are between -0.5 and 0.5
    Click { x: f64, y: f64 },
    /// Press a key.
    KeyPress(String),
    /// TODO
    Submit(),
}
