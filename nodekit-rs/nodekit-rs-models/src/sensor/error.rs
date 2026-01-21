use std::fmt::{Display, Formatter};

#[derive(Debug)]
pub struct ChoiceKeyError(pub String);

impl Display for ChoiceKeyError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Invalid choice key for select sensor: {}", &self.0)
    }
}
