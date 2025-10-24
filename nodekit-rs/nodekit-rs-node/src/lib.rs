mod timer;

pub enum MediaType {
    Image,
    Png,
}

pub enum TimerState {
    Pending,
    Starting,
    Running,
    Ending,
    Finished,
}

pub struct Card {}
