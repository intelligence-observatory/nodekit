use crate::components::*;
use slotmap::{SecondaryMap, SlotMap};

#[derive(Copy, Clone)]
pub enum TimedEntityKey {
    Card(CardKey),
    Sensor(SensorKey),
}

#[derive(Default)]
pub struct Timers {
    pub timers: SlotMap<TimerKey, Timer>,
    pub entities: SecondaryMap<TimerKey, TimedEntityKey>,
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

    pub fn tick(&mut self) {
        // Advance all timers.
        self.timers
            .values_mut()
            .filter(|timer| timer.state != EntityState::Finished)
            .for_each(|timer| timer.advance());
        let mut started = Vec::default();
        let mut ended = Vec::default();
        for (key, timer) in self.timers.iter() {
            match &timer.state {
                EntityState::StartedNow => started.push(self.entities[key]),
                EntityState::EndedNow => ended.push(self.entities[key]),
                _ => (),
            }
        }
    }
}
