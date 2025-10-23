pub enum Action {
    Click { x: f32, y: f32 },
    KeyPress(String),
    Submit,
}
