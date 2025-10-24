mod state;

use pyo3::prelude::*;
pub use state::TimerState;

#[pyclass]
pub struct Timer {
    t0: u64,
    t1: Option<u64>,
    t: u64,
    state: TimerState,
}

#[pymethods]
impl Timer {
    #[new]
    pub fn new(t0: u64, t1: Option<u64>) -> Self {
        Self {
            t0,
            t1,
            t: 0,
            state: TimerState::Pending,
        }
    }

    pub fn tick(&mut self) {
        // Start.
        if self.t == self.t0 {
            self.state = TimerState::Starting;
        } else if let Some(t1) = self.t1
            && self.t == t1
        {
            self.state = TimerState::Ending;
        } else if self.state == TimerState::Starting {
            self.state = TimerState::Active;
        } else if self.state == TimerState::Ending {
            self.state = TimerState::Finished;
        }
        self.t += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_timer() {
        let mut timer = Timer::new(0, None);
        assert_eq!(timer.state, TimerState::Pending);
        timer.tick();
        assert_eq!(timer.state, TimerState::Starting);
        assert_eq!(timer.t, 1);

        let t0 = 10;
        let t1 = Some(20);
        timer = Timer::new(t0, t1);
        assert_eq!(timer.state, TimerState::Pending);
        (0..t0).for_each(|t| {
            timer.tick();
            assert_eq!(timer.state, TimerState::Pending);
            assert_eq!(timer.t, t + 1);
        });
        timer.tick();
        assert_eq!(timer.state, TimerState::Starting);
        (0..t0 - 1).for_each(|_| {
            timer.tick();
            assert_eq!(timer.state, TimerState::Active);
        });
        timer.tick();
        assert_eq!(timer.state, TimerState::Ending);
        timer.tick();
        assert_eq!(timer.state, TimerState::Finished);
    }
}