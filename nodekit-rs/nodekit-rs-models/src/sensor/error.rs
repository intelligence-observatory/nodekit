use crate::card::CardKey;
use std::fmt::{Display, Formatter};

#[derive(Debug)]
pub struct ChoiceKeyError(pub String);

impl Display for ChoiceKeyError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Invalid choice key for select sensor: {}", &self.0)
    }
}

#[derive(Debug)]
pub struct CardKeyError(pub CardKey);

impl Display for CardKeyError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Invalid card key for select sensor: {:?}", &self.0)
    }
}

#[derive(Debug)]
pub struct ButtonStateError(pub String);

impl Display for ButtonStateError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Invalid button state: {}", &self.0)
    }
}
