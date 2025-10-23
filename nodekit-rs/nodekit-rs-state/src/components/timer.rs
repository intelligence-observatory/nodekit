use super::entity_state::EntityState;
use nodekit_rs_graph::NodeCardsValue;
use slotmap::new_key_type;

new_key_type! { pub struct TimerKey; }

macro_rules! from_raw {
    ($card:ident) => {
        Self::new($card.start_msec, $card.end_msec)
    };
}

pub struct Timer {
    t0: u64,
    pub(crate) t1: Option<u64>,
    t: u64,
    pub state: EntityState,
}

impl Timer {
    pub fn tick(&mut self) {
        // Start.
        if self.t == self.t0 {
            self.state = EntityState::StartedNow;
        }
        // End.
        else if let Some(t1) = self.t1
            && self.t == t1
        {
            self.state = EntityState::EndedNow;
        } else if self.state == EntityState::StartedNow {
            self.state = EntityState::Active;
        } else if self.state == EntityState::EndedNow {
            self.state = EntityState::Finished;
        }
        self.t += 1;
    }

    pub fn new(t0: u64, t1: Option<u64>) -> Self {
        Self {
            t0,
            t1,
            t: 0,
            state: EntityState::default(),
        }
    }
}

impl From<&NodeCardsValue> for Timer {
    fn from(value: &NodeCardsValue) -> Self {
        match value {
            NodeCardsValue::FreeTextEntryCard(card) => from_raw!(card),
            NodeCardsValue::ImageCard(card) => from_raw!(card),
            NodeCardsValue::SliderCard(card) => from_raw!(card),
            NodeCardsValue::TextCard(card) => from_raw!(card),
            NodeCardsValue::VideoCard(card) => from_raw!(card),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_timer() {
        let mut timer = Timer::new(0, None);
        assert_eq!(timer.state, EntityState::Pending);
        timer.tick();
        assert_eq!(timer.state, EntityState::StartedNow);
        assert_eq!(timer.t, 1);

        let t0 = 10;
        let t1 = Some(20);
        timer = Timer::new(t0, t1);
        assert_eq!(timer.state, EntityState::Pending);
        (0..t0).for_each(|t| {
            timer.tick();
            assert_eq!(timer.state, EntityState::Pending);
            assert_eq!(timer.t, t + 1);
        });
        timer.tick();
        assert_eq!(timer.state, EntityState::StartedNow);
        (0..t0 - 1).for_each(|_| {
            timer.tick();
            assert_eq!(timer.state, EntityState::Active);
        });
        timer.tick();
        assert_eq!(timer.state, EntityState::EndedNow);
        timer.tick();
        assert_eq!(timer.state, EntityState::Finished);
    }
}
