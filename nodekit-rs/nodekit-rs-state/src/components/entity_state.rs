#[derive(Copy, Clone, Default, Debug, Eq, PartialEq)]
pub enum EntityState {
    #[default]
    Pending,
    StartedNow,
    Active,
    EndedNow,
    Finished,
}
