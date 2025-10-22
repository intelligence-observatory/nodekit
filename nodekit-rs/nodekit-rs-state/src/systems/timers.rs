use crate::components::*;
use slotmap::{SecondaryMap, SlotMap};

#[derive(Copy, Clone)]
pub enum TimedEntityKey {
    Card(CardKey),
    Sensor(SensorKey),
}

pub struct TickResult {
    pub started: Vec<TimedEntityKey>,
    pub ended: Vec<TimedEntityKey>,
}

#[derive(Default)]
pub struct Timers {
    timers: SlotMap<TimerKey, Timer>,
    entities: SecondaryMap<TimerKey, TimedEntityKey>,
}

impl Timers {
    pub fn add_card(&mut self, timer: Timer, card_key: CardKey) {
        let timer_key = self.timers.insert(timer);
        self.entities
            .insert(timer_key, TimedEntityKey::Card(card_key));
    }

    pub fn add_sensor(&mut self, timer: Timer, sensor_key: SensorKey) {
        let timer_key = self.timers.insert(timer);
        self.entities
            .insert(timer_key, TimedEntityKey::Sensor(sensor_key));
    }

    pub fn tick(&mut self) -> TickResult {
        // Advance all timers.
        self.timers
            .values_mut()
            .filter(|timer| timer.state != TimerState::Finished)
            .for_each(|timer| timer.advance());
        let mut started = Vec::default();
        let mut ended = Vec::default();
        for (key, timer) in self.timers.iter() {
            match &timer.state {
                TimerState::StartedNow => started.push(self.entities[key]),
                TimerState::EndedNow => ended.push(self.entities[key]),
                _ => (),
            }
        }
        TickResult { started, ended }
    }
}
