mod cards_result;
use crate::components::*;
use crate::node::cards_result::CardsResult;
use crate::{error::Error, systems::*};
use blittle::blit;
use bytemuck::{cast_slice, cast_slice_mut};
use hashbrown::HashMap;
use hex_color::HexColor;
use nodekit_rs_action::Action;
use nodekit_rs_graph::{NodeCardsValue, NodeSensorsValue};
use nodekit_rs_response::Response;
use nodekit_rs_visual::*;
use slotmap::new_key_type;

new_key_type! { pub struct NodeKey; }

macro_rules! sensor {
    ($sensor:ident, $sensors:ident, $timers:ident, $sub_sensors:ident, $sensor_type:ident, $sensor_id:ident, $component_key:ident) => {{
        // Add the sensor.
        let sensor = Sensor {
            state: EntityState::default(),
            id: $sensor_id.clone(),
        };
        let sensor_key = $sensors.sensors.insert(sensor);
        // Add the sub-sensor.
        let sub_sensor_key = $sensors.$sub_sensors.insert($sensor_type::from($sensor));
        // Link the sensor.
        $sensors.components.insert(
            SensorComponentKey::$component_key(sub_sensor_key),
            sensor_key,
        );
        $sensors.sensor_ids.insert($sensor_id.clone(), sensor_key);
        sensor_key
    }};
}

macro_rules! sensor_and_timer {
    ($sensor:ident, $sensors:ident, $timers:ident, $sub_sensors:ident, $sensor_type:ident, $sensor_id:ident, $component_key:ident) => {{
        let sensor_key = sensor!(
            $sensor,
            $sensors,
            $timers,
            $sub_sensors,
            $sensor_type,
            $sensor_id,
            $component_key
        );
        // Add a timer.
        $timers.add_sensor(Timer::new($sensor.start_msec, $sensor.end_msec), sensor_key);
    }};
}

macro_rules! blit_video {
    ($self:ident, $video_key:ident, $card:ident, $visual:ident, $blitted:ident, $frame:ident) => {{
        let video_result = $self.cards.videos[*$video_key]
            .0
            .blit($card, $visual)
            .map_err(Error::Video)?;
        if video_result.blitted {
            $blitted = true;
        }
        if let Some(audio) = video_result.audio {
            $frame.audio = Some(audio);
        }
    }};
}

pub struct Node {
    pub cards: Cards,
    pub timers: Timers,
    pub sensors: Sensors,
    pub effects: Effects,
    pub board_color: [u8; 3],
    state: EntityState,
}

impl Node {
    pub fn from_node(node: &nodekit_rs_graph::Node) -> Result<Self, Error> {
        let mut timers = Timers::default();
        let cards_result = Self::add_cards(node, &mut timers)?;
        let board_color = HexColor::parse(node.board_color.as_str()).map_err(Error::HexColor)?;
        let board_color = [board_color.r, board_color.g, board_color.b];
        let sensors = Self::add_sensors(node, &cards_result.card_ids, &mut timers);
        let node = Node {
            cards: cards_result.cards,
            timers,
            sensors,
            effects: Effects::default(),
            board_color,
            state: Default::default(),
        };
        Ok(node)
    }

    pub fn start(&mut self, visual: &mut [u8]) -> Response {
        // Set the state.
        self.state = EntityState::StartedNow;
        // Fill the board with my color.
        cast_slice_mut::<u8, [u8; 3]>(visual)
            .iter_mut()
            .for_each(|pixel| {
                pixel[0] = self.board_color[0];
                pixel[1] = self.board_color[1];
                pixel[2] = self.board_color[2];
            });
        Response {
            visual: Some(VisualFrame {
                buffer: visual.to_vec(),
                width: VISUAL_D_U32,
                height: VISUAL_D_U32,
            }),
            audio: None,
            sensor: None,
            ended: false,
        }
    }

    pub fn tick(&mut self, action: Option<Action>, board: &mut [u8]) -> Result<Response, Error> {
        if self.state == EntityState::StartedNow {
            self.state = EntityState::Active;
        }
        let mut result = Response::default();
        // We haven't timed out yet.
        if !self.tick_timeouts(&mut result) {
            // Apply the action.
            self.on_action(action, &mut result);
            // Tick all timers.
            self.tick_timers();
            // Update all cards.
            self.tick_cards(board, &mut result)?;
        }
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

    fn tick_timeouts(&mut self, response: &mut Response) -> bool {
        let ended = self
            .sensors
            .timeout_sensors
            .values_mut()
            .any(|sensor| sensor.tick());
        if ended {
            self.state = EntityState::EndedNow;
            response.ended = true;
        }
        ended
    }

    fn tick_cards(&mut self, visual: &mut [u8], response: &mut Response) -> Result<(), Error> {
        let mut blitted = false;
        for (card_key, card) in self.cards.cards.iter() {
            match &card.state {
                // Ignore inactive cards.
                EntityState::Pending | EntityState::Finished => (),
                EntityState::StartedNow => match &self.cards.components[card_key] {
                    CardComponentKey::Image(image_key) => {
                        let (image, _) = &self.cards.images[*image_key];
                        image.blit(card, visual)?;
                        blitted = true;
                    }
                    CardComponentKey::Video(video_key) => {
                        blit_video!(self, video_key, card, visual, blitted, response);
                    }
                    CardComponentKey::Text(_) => todo!("blit text"),
                },
                EntityState::Active => {
                    if let CardComponentKey::Video(video_key) = &self.cards.components[card_key] {
                        blit_video!(self, video_key, card, visual, blitted, response);
                    }
                }
                // Erase the card.
                EntityState::EndedNow => {
                    let clear = vec![self.board_color; card.rect.size.w * card.rect.size.h];
                    let src = cast_slice::<[u8; 3], u8>(&clear);
                    blit(
                        src,
                        &card.rect.size,
                        visual,
                        &card.rect.position,
                        &VISUAL_SIZE,
                        STRIDE,
                    );
                    blitted = true;
                }
            }
        }
        // Return the board.
        if blitted {
            response.visual = Some(VisualFrame {
                buffer: visual.to_vec(),
                width: VISUAL_D_U32,
                height: VISUAL_D_U32,
            });
        }
        Ok(())
    }

    fn on_action(&mut self, action: Option<Action>, response: &mut Response) {
        if let Some(action) = action {
            let sensor_key = match action {
                Action::Click { x, y } => self.sensors.on_click(x, y),
                Action::KeyPress(key) => self.sensors.on_key(&key),
                Action::Submit() => todo!(),
            };
            // End the node.
            if let Some(sensor_key) = sensor_key {
                self.state = EntityState::EndedNow;
                response.ended = true;
                response.sensor = Some(self.sensors.sensors[sensor_key].id.clone());
            }
        }
    }

    fn add_cards(node: &nodekit_rs_graph::Node, timers: &mut Timers) -> Result<CardsResult, Error> {
        let mut cards = Cards::default();
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
                    let image_key = cards.images.insert((Image::new(image)?, card_key));
                    cards
                        .components
                        .insert(card_key, CardComponentKey::Image(image_key));
                }
                NodeCardsValue::VideoCard(video) => {
                    // Add a video.
                    let video_key = cards.videos.insert((Video::new(video)?, card_key));
                    cards
                        .components
                        .insert(card_key, CardComponentKey::Video(video_key));
                }
                _ => (),
            }
        }
        Ok(CardsResult { cards, card_ids })
    }

    fn add_sensors(
        node: &nodekit_rs_graph::Node,
        card_ids: &HashMap<String, CardKey>,
        timers: &mut Timers,
    ) -> Sensors {
        let mut sensors = Sensors::default();
        for (sensor_id, sensor) in node.sensors.iter() {
            match sensor {
                NodeSensorsValue::TimeoutSensor(sensor) => {
                    // Add the sensor.
                    sensor!(
                        sensor,
                        sensors,
                        timers,
                        timeout_sensors,
                        TimeoutSensor,
                        sensor_id,
                        Timeout
                    );
                }
                NodeSensorsValue::ClickSensor(sensor) => {
                    sensor_and_timer!(
                        sensor,
                        sensors,
                        timers,
                        click_sensors,
                        ClickSensor,
                        sensor_id,
                        Click
                    );
                }
                NodeSensorsValue::KeySensor(sensor) => {
                    sensor_and_timer!(
                        sensor,
                        sensors,
                        timers,
                        key_sensors,
                        KeySensor,
                        sensor_id,
                        Key
                    );
                }
                NodeSensorsValue::SubmitSensor(sensor) => {
                    // Add the sensor.
                    let s = Sensor {
                        state: EntityState::default(),
                        id: sensor_id.clone(),
                    };
                    let sensor_key = sensors.sensors.insert(s);
                    // Get the submitter card.
                    let submitter_key = card_ids[sensor.submitter_id.as_str()];
                    // Get the source keys.
                    let source_keys = sensor
                        .source_ids
                        .iter()
                        .map(|id| card_ids[id.as_str()])
                        .collect::<Vec<CardKey>>();
                    // Add the submit sensor.
                    let submit_sensor_key = sensors.submit_sensors.insert(SubmitSensor {
                        submitter_key,
                        source_keys,
                    });
                    // Link the submit sensor.
                    sensors
                        .components
                        .insert(SensorComponentKey::Submit(submit_sensor_key), sensor_key);
                    // Add the timer.
                    timers.add_sensor(Timer::new(sensor.start_msec, sensor.end_msec), sensor_key);
                }
            }
        }
        sensors
    }
}
