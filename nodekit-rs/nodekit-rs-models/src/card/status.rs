/// The status of a timer.
#[derive(Copy, Clone, Default, Debug, Eq, PartialEq)]
pub enum Status {
    /// The timer hasn't started.
    #[default]
    Pending,
    /// The timer just started.
    StartedNow,
    /// The timer is running.
    Active,
    /// The timer just ended.
    EndedNow,
    /// The timer has ended.
    Finished,
}
