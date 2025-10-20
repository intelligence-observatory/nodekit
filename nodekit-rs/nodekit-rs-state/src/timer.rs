#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum TimerState {
    NotStarted,
    StartedNow,
    Running,
    EndedNow,
    Finished
}
pub struct Timer {
    t0: u32,
    t1: Option<u32>,
    t: u32,
    pub state: TimerState,
}

impl Timer {
    pub fn advance(&mut self) {
        // Start.
        if self.t == self.t0 {
            self.state = TimerState::StartedNow;
        }
        // End.
        else if let Some(t1) = self.t1 && self.t == t1 {
            self.state = TimerState::EndedNow;
        }
        else if self.state == TimerState::StartedNow {
            self.state = TimerState::Running;
        }
        else if self.state == TimerState::EndedNow {
            self.state = TimerState::Finished;
        }
        self.t += 1;
    }

    fn new(t0: u32, t1: Option<u32>) -> Self {
        Self {
            t0,
            t1,
            t: 0,
            state: TimerState::NotStarted
        }
    }
}

impl From<nodekit_rs_graph::Timer> for Timer {
    fn from(value: nodekit_rs_graph::Timer) -> Self {
        Self::new(value.t0, value.t1)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_timer() {
        let mut timer = Timer::new(0, None);
        assert_eq!(timer.state, TimerState::NotStarted);
        timer.advance();
        assert_eq!(timer.state, TimerState::StartedNow);
        assert_eq!(timer.t, 1);

        let t0 = 10;
        let t1 = Some(20);
        timer = Timer::new(t0, t1);
        assert_eq!(timer.state, TimerState::NotStarted);
        (0..t0).for_each(|t| {
            timer.advance();
            assert_eq!(timer.state, TimerState::NotStarted);
            assert_eq!(timer.t, t + 1);
        });
        timer.advance();
        assert_eq!(timer.state, TimerState::StartedNow);
        (0..t0 - 1).for_each(|_| {
            timer.advance();
            assert_eq!(timer.state, TimerState::Running);
        });
        timer.advance();
        assert_eq!(timer.state, TimerState::EndedNow);
        timer.advance();
        assert_eq!(timer.state, TimerState::Finished);
    }
}