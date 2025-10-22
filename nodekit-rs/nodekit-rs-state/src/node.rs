use crate::components::*;
use crate::{error::Error, systems::*};
use hashbrown::HashMap;
use hex_color::HexColor;
use nodekit_rs_graph::{NodeCardsValue, NodeSensorsValue};
use slotmap::new_key_type;
use std::path::Path;

new_key_type! { pub struct NodeKey; }

macro_rules! sensor {
    ($sensor:ident, $sensors:ident, $timers:ident, $sub_sensors:ident, $sensor_type:ident, $sensor_ids:ident, $sensor_id:ident) => {{
        // Add the sensor.
        let sensor_key = $sensors.sensors.insert(Sensor::default());
        let sub_sensor_key = $sensors
            .$sub_sensors
            .components
            .insert($sensor_type::from($sensor));
        // Link the sensor.
        $sensors
            .$sub_sensors
            .entities
            .insert(sub_sensor_key, sensor_key);
        // Add a timer.
        $timers.add_sensor(Timer::new($sensor.start_msec, $sensor.end_msec), sensor_key);
        $sensor_ids.insert($sensor_id, sensor_key);
    }};
}

struct CardsResult<'c> {
    pub cards: Cards<'c>,
    pub card_ids: HashMap<&'c str, CardKey>,
    pub assets: Assets<'c>,
}

struct SensorsResult<'s> {
    pub sensors: Sensors,
    pub sensor_ids: HashMap<&'s String, SensorKey>,
}

pub struct Node<'n> {
    pub cards: Cards<'n>,
    pub timers: Timers,
    pub sensors: Sensors,
    pub effects: Effects,
    pub board_color: [u8; 3],
    pub assets: Assets<'n>,
}

impl<'n> Node<'n> {
    pub fn from_node<P: AsRef<Path>>(
        node: &'n nodekit_rs_graph::Node,
        directory: P,
    ) -> Result<ReturnedNode<'n>, Error> {
        let mut timers = Timers::default();
        let cards_result = Self::add_cards(node, directory, &mut timers)?;
        let board_color = HexColor::parse(node.board_color.as_str()).map_err(Error::HexColor)?;
        let board_color = [board_color.r, board_color.g, board_color.b];
        let sensors = Self::add_sensors(node, &cards_result.card_ids, &mut timers);
        let node = Node {
            cards: cards_result.cards,
            timers,
            sensors: sensors.sensors,
            effects: Effects::default(),
            board_color,
            assets: cards_result.assets,
        };
        Ok(ReturnedNode {
            node,
            sensor_ids: sensors.sensor_ids,
        })
    }
    
    pub fn tick(&mut self) {
        self.tick_timers();
    }

    fn tick_timers(&mut self) {
        let tick_result = self.timers.tick();
        for k in tick_result.started {
            self.set_active(k, true);
        }
        for k in tick_result.ended {
            self.set_active(k, false);
        }
    }
    
    fn set_active(&mut self, k: TimedEntityKey, active: bool) {
        match k {
            TimedEntityKey::Card(key) => {
                self.cards.cards[key].active = active;
            }
            TimedEntityKey::Sensor(key) => {
                self.sensors.sensors[key].active = active;
            }
        }
    }

    fn add_cards<'c, P: AsRef<Path>>(
        node: &'c nodekit_rs_graph::Node,
        directory: P,
        timers: &mut Timers,
    ) -> Result<CardsResult<'c>, Error> {
        let mut cards = Cards::default();
        let mut assets = Assets::new(directory).map_err(Error::Asset)?;
        let mut card_ids = HashMap::default();
        for (card_id, card) in node.cards.iter() {
            // Insert a new card.
            let card_key = cards.cards.insert(Card::from(card));
            card_ids.insert(card_id.as_str(), card_key);
            // Add a new timer.
            timers.add_card(Timer::from(card), card_key);
            // Add an asset.
            match card {
                NodeCardsValue::ImageCard(image) => {
                    // Add an image.
                    let image_key = cards.images.components.insert(Image::default());
                    // Link the image.
                    cards.images.entities.insert(image_key, card_key);
                    // Prepare the asset.
                    assets
                        .add_image(image_key, &image.image.locator, &image.image.sha256)
                        .map_err(Error::Asset)?;
                }
                NodeCardsValue::VideoCard(video) => {
                    // Add a video.
                    let video_key = cards.videos.components.insert(Video::from(video));
                    // Link the video.
                    cards.videos.entities.insert(video_key, card_key);
                    // Prepare the asset.
                    assets
                        .add_video(video_key, &video.video.locator, &video.video.sha256)
                        .map_err(Error::Asset)?;
                }
                _ => (),
            }
        }
        Ok(CardsResult {
            cards,
            card_ids,
            assets,
        })
    }

    fn add_sensors<'s>(
        node: &'s nodekit_rs_graph::Node,
        card_ids: &HashMap<&str, CardKey>,
        timers: &mut Timers,
    ) -> SensorsResult<'s> {
        let mut sensors = Sensors::default();
        let mut sensor_ids = HashMap::default();
        for (sensor_id, sensor) in node.sensors.iter() {
            // Add a sensor.
            let sensor_key = sensors.sensors.insert(Sensor::default());
            match sensor {
                NodeSensorsValue::TimeoutSensor(sensor) => {
                    // Add the sensor.
                    let timeout_sensor_key = sensors
                        .timeout_sensors
                        .components
                        .insert(TimeoutSensor::from(sensor));
                    // Link the sensor.
                    sensors
                        .timeout_sensors
                        .entities
                        .insert(timeout_sensor_key, sensor_key);
                }
                NodeSensorsValue::ClickSensor(sensor) => {
                    sensor!(
                        sensor,
                        sensors,
                        timers,
                        click_sensors,
                        ClickSensor,
                        sensor_ids,
                        sensor_id
                    );
                }
                NodeSensorsValue::KeySensor(sensor) => {
                    sensor!(
                        sensor,
                        sensors,
                        timers,
                        key_sensors,
                        KeySensor,
                        sensor_ids,
                        sensor_id
                    );
                }
                NodeSensorsValue::SubmitSensor(sensor) => {
                    // Add the sensor.
                    let sensor_key = sensors.sensors.insert(Sensor::default());
                    let submitter_id = card_ids[sensor.submitter_id.as_str()];
                    let source_ids = sensor
                        .source_ids
                        .iter()
                        .map(|id| card_ids[id.as_str()])
                        .collect::<Vec<CardKey>>();
                    // Add the submit sensor.
                    let submit_sensor_key =
                        sensors.submit_sensors.components.insert(SubmitSensor {
                            submitter_id,
                            source_ids,
                        });
                    // Link the submit sensor.
                    sensors
                        .submit_sensors
                        .entities
                        .insert(submit_sensor_key, sensor_key);
                    // Add the timer.
                    timers.add_sensor(Timer::new(sensor.start_msec, sensor.end_msec), sensor_key);
                }
            }
        }
        SensorsResult {
            sensors,
            sensor_ids,
        }
    }
}

pub struct ReturnedNode<'n> {
    pub node: Node<'n>,
    pub sensor_ids: HashMap<&'n String, SensorKey>,
}
