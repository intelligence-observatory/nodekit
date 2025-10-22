use crate::BOARD_SIZE;
use crate::board::BOARD_D;
use crate::components::*;
use crate::tick_result::TickResult;
use crate::{error::Error, systems::*};
use blittle::blit;
use bytemuck::cast_slice;
use hashbrown::HashMap;
use hex_color::HexColor;
use nodekit_rs_asset::MediaType;
use nodekit_rs_graph::{NodeCardsValue, NodeSensorsValue};
use nodekit_rs_image::Image;
use slotmap::new_key_type;
use std::path::Path;

new_key_type! { pub struct NodeKey; }

macro_rules! sensor {
    ($sensor:ident, $sensors:ident, $timers:ident, $sub_sensors:ident, $sensor_type:ident, $sensor_ids:ident, $sensor_id:ident) => {{
        // Add the sensor.
        let sensor = Sensor {
            state: EntityState::default(),
            id: $sensor_id.clone(),
        };
        let sensor_key = $sensors.sensors.insert(sensor);
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
        $sensor_ids.insert($sensor_id.to_string(), sensor_key);
    }};
}

macro_rules! blit_video {
    ($self:ident, $video_key:ident, $card:ident, $board:ident, $blitted:ident, $result:ident) => {{
        let video_result = $self.cards.videos[*$video_key]
            .blit($card, $board)
            .map_err(Error::Video)?;
        if video_result.blitted {
            $blitted = true;
        }
        // TODO overlay.
        if let Some(audio) = video_result.audio {
            $result.audio = Some(audio);
        }
    }};
}

struct CardsResult {
    pub cards: Cards,
    pub card_ids: HashMap<String, CardKey>,
    pub assets: Assets,
}

struct SensorsResult {
    pub sensors: Sensors,
    pub sensor_ids: HashMap<String, SensorKey>,
}

pub struct Node {
    pub cards: Cards,
    pub timers: Timers,
    pub sensors: Sensors,
    pub effects: Effects,
    pub board_color: [u8; 3],
    pub assets: Assets,
    state: EntityState,
}

impl Node {
    pub fn from_node<P: AsRef<Path>>(
        node: &nodekit_rs_graph::Node,
        directory: P,
    ) -> Result<ReturnedNode, Error> {
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
            state: Default::default(),
        };
        Ok(ReturnedNode {
            node,
            sensor_ids: sensors.sensor_ids,
        })
    }

    pub fn start(&mut self, board: &mut [u8]) -> TickResult {
        // Set the state.
        self.state = EntityState::StartedNow;
        // Fill the board with my color.
        let filled = vec![self.board_color; BOARD_D * BOARD_D];
        board.copy_from_slice(cast_slice::<[u8; 3], u8>(&filled));
        TickResult {
            board: Some(board.to_vec()),
            audio: None,
            sensor: None,
            state: self.state,
        }
    }

    pub async fn get_assets(&mut self) -> Result<(), Error> {
        let mut errors = Vec::default();
        let mut got_error = false;
        for result in self.assets.asset_manager.get_all().await {
            match result {
                Ok(asset) => {
                    // Load the asset.
                    match &asset.media_type {
                        MediaType::Image => {
                            // Find the image.
                            let image_key = self.assets.images[&asset.id];
                            let card = &self.cards.cards[self.cards.image_cards[image_key]];
                            // Load the image.
                            self.cards.images[image_key] = Image::load(
                                &asset.path,
                                card.rect.size.w as u32,
                                card.rect.size.h as u32,
                            )
                            .map_err(Error::Image)?;
                        }
                        MediaType::Video => {
                            // Find the video.
                            let video_key = self.assets.videos[&asset.id];
                            let card = &self.cards.cards[self.cards.video_cards[video_key]];
                            // Load the video.
                            self.cards.videos[video_key].load(&asset.path, card)?;
                        }
                    }
                }
                Err(error) => {
                    got_error = true;
                    errors.push(error);
                }
            }
        }
        if got_error {
            Err(Error::LoadAssets(errors))
        } else {
            Ok(())
        }
    }

    pub fn tick(&mut self, board: &mut [u8]) -> Result<TickResult, Error> {
        if self.state == EntityState::StartedNow {
            self.state = EntityState::Active;
        }
        let mut result = TickResult {
            board: None,
            audio: None,
            sensor: None,
            state: self.state,
        };
        self.tick_timers();
        self.tick_cards(board, &mut result)?;
        // TODO sensors.
        Ok(result)
    }

    fn tick_timers(&mut self) {
        self.timers.tick();
        for (timer_key, timer) in self.timers.timers.iter() {
            match self.timers.entities[timer_key] {
                TimedEntityKey::Card(key) => {
                    self.cards.cards[key].state = timer.state;
                }
                TimedEntityKey::Sensor(key) => {
                    self.sensors.sensors[key].state = timer.state;
                }
            }
        }
    }

    fn tick_cards(&mut self, board: &mut [u8], result: &mut TickResult) -> Result<(), Error> {
        let mut blitted = false;
        for (card_key, card) in self.cards.cards.iter() {
            match &card.state {
                // Ignore inactive cards.
                EntityState::Pending | EntityState::Finished => (),
                EntityState::StartedNow => match &self.cards.components[card_key] {
                    CardComponentKey::Image(image_key) => {
                        let image = &self.cards.images[*image_key];
                        blit(
                            &image.bytes,
                            &image.size,
                            board,
                            &card.rect.position,
                            &BOARD_SIZE,
                            3,
                        );
                        blitted = true;
                    }
                    CardComponentKey::Video(video_key) => {
                        blit_video!(self, video_key, card, board, blitted, result);
                    }
                    CardComponentKey::Text(_) => todo!("blit text"),
                },
                EntityState::Active => {
                    if let CardComponentKey::Video(video_key) = &self.cards.components[card_key] {
                        blit_video!(self, video_key, card, board, blitted, result);
                    }
                }
                // Erase the card.
                EntityState::EndedNow => {
                    let clear = vec![self.board_color; card.rect.size.w * card.rect.size.h];
                    let src = cast_slice::<[u8; 3], u8>(&clear);
                    blit(
                        src,
                        &card.rect.size,
                        board,
                        &card.rect.position,
                        &BOARD_SIZE,
                        3,
                    );
                    blitted = true;
                }
            }
        }
        // Return the board.
        if blitted {
            result.board = Some(board.to_vec());
        }
        Ok(())
    }

    fn add_cards<P: AsRef<Path>>(
        node: &nodekit_rs_graph::Node,
        directory: P,
        timers: &mut Timers,
    ) -> Result<CardsResult, Error> {
        let mut cards = Cards::default();
        let mut assets = Assets::new(directory).map_err(Error::Asset)?;
        let mut card_ids = HashMap::default();
        for (card_id, card) in node.cards.iter() {
            // Insert a new card.
            let card_key = cards.cards.insert(Card::from(card));
            card_ids.insert(card_id.clone(), card_key);
            // Add a new timer.
            timers.add_card(Timer::from(card), card_key);
            // Add an asset.
            match card {
                NodeCardsValue::ImageCard(image) => {
                    // Add an image.
                    let image_key = cards.images.insert(Image::default());
                    cards.image_cards.insert(image_key, card_key);
                    cards
                        .components
                        .insert(card_key, CardComponentKey::Image(image_key));
                    // Prepare the asset.
                    assets
                        .add_image(image_key, &image.image.locator, &image.image.sha256)
                        .map_err(Error::Asset)?;
                }
                NodeCardsValue::VideoCard(video) => {
                    // Add a video.
                    let video_key = cards.videos.insert(Video::from(video));
                    cards.video_cards.insert(video_key, card_key);
                    cards
                        .components
                        .insert(card_key, CardComponentKey::Video(video_key));
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

    fn add_sensors(
        node: &nodekit_rs_graph::Node,
        card_ids: &HashMap<String, CardKey>,
        timers: &mut Timers,
    ) -> SensorsResult {
        let mut sensors = Sensors::default();
        let mut sensor_ids = HashMap::default();
        for (sensor_id, sensor) in node.sensors.iter() {
            // Add a sensor.
            let s = Sensor {
                state: EntityState::default(),
                id: sensor_id.clone(),
            };
            let sensor_key = sensors.sensors.insert(s);
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
                    let s = Sensor {
                        state: EntityState::default(),
                        id: sensor_id.clone(),
                    };
                    let sensor_key = sensors.sensors.insert(s);
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

pub struct ReturnedNode {
    pub node: Node,
    pub sensor_ids: HashMap<String, SensorKey>,
}
