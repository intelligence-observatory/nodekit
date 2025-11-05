mod cards_result;
use crate::{
    board::*, components::*, cursor::Cursor, error::Error, node::cards_result::CardsResult,
    systems::*,
};
use blittle::blit;
use bytemuck::{cast_slice, cast_slice_mut};
use glam::DVec2;
use hashbrown::HashMap;
use hex_color::HexColor;
use nodekit_rs_graph::{NodeCardsValue, NodeSensorsValue};
use nodekit_rs_request::Action;
use nodekit_rs_response::*;
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

pub struct Node {
    pub cards: Cards,
    pub timers: Timers,
    pub sensors: Sensors,
    pub effects: Effects,
    pub board_color: [u8; 3],
    state: EntityState,
    cursor: Cursor,
}

impl Node {
    pub fn from_node(node: &nodekit_rs_graph::Node) -> Result<Self, Error> {
        let mut timers = Timers::default();
        let cards_result = Self::add_cards(node, &mut timers)?;
        let board_color = HexColor::parse(node.board_color.as_str()).map_err(Error::HexColor)?;
        let board_color = [board_color.r, board_color.g, board_color.b];
        let sensors = Self::add_sensors(node, &cards_result.card_ids, &mut timers);
        let effects = Self::add_effects(node, &mut timers);
        let node = Node {
            cards: cards_result.cards,
            timers,
            sensors,
            effects,
            board_color,
            state: Default::default(),
            cursor: Default::default(),
        };
        Ok(node)
    }

    fn start(&mut self, board: &mut [u8]) -> Response {
        // Set the state.
        self.state = EntityState::StartedNow;
        // Fill the board with my color.
        cast_slice_mut::<u8, [u8; 3]>(board)
            .iter_mut()
            .for_each(|pixel| {
                pixel[0] = self.board_color[0];
                pixel[1] = self.board_color[1];
                pixel[2] = self.board_color[2];
            });
        Response {
            visual: Some(VisualFrame {
                buffer: board.to_vec(),
                width: BOARD_D_U32,
                height: BOARD_D_U32,
            }),
            audio: None,
            sensor: None,
            finished: false,
        }
    }

    pub fn tick(
        &mut self,
        action: Option<Action>,
        cursor: &mut DVec2,
        text_engine: &mut nodekit_rs_text::Text,
        board_pre_cursor: &mut [u8],
        board: &mut [u8],
    ) -> Result<Response, Error> {
        if self.state == EntityState::Pending {
            self.start(board_pre_cursor);
        }
        let mut response = Response::default();
        // We haven't timed out yet.
        if !self.tick_timeouts(&mut response) {
            let mouse_moved = matches!(
                action.as_ref(),
                Some(Action::Mouse {
                    delta: Some(_),
                    clicked: _
                })
            );

            // Apply the action.
            self.on_action(action, cursor, &mut response);
            // Tick all timers.
            self.tick_timers();
            // Update all cards.
            let mut blitted = self.tick_cards(text_engine, board_pre_cursor, &mut response)?;

            // Blit the cursor if:
            // - The node started now
            // - At least one card blitted
            // - The mouse moved
            if self.state == EntityState::StartedNow || blitted || mouse_moved {
                blitted = self.tick_cursor(*cursor, board_pre_cursor, board);
            }

            if blitted {
                response.visual = Some(VisualFrame {
                    buffer: board.to_vec(),
                    width: BOARD_D_U32,
                    height: BOARD_D_U32,
                });
            }
        }

        if self.state == EntityState::StartedNow {
            self.state = EntityState::Active;
        }

        Ok(response)
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
                TimedEntityKey::Effect(key) => {
                    self.effects.effects[key] = timer.state;
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
            response.finished = true;
        }
        ended
    }

    fn tick_cards(
        &mut self,
        text_engine: &mut nodekit_rs_text::Text,
        board: &mut [u8],
        response: &mut Response,
    ) -> Result<bool, Error> {
        let mut blitted = false;
        for card_key in self.cards.order.iter() {
            let card_key = *card_key;
            let card = &self.cards.cards[card_key];
            match &card.state {
                // Ignore inactive cards.
                EntityState::Pending | EntityState::Finished => (),
                EntityState::StartedNow => match &self.cards.components[card_key] {
                    CardComponentKey::Image(image_key) => {
                        self.cards.images[*image_key].blit(card, board)?;
                        blitted = true;
                    }
                    CardComponentKey::Video(video_key) => {
                        if self.cards.videos[*video_key].blit(card, board, &mut response.audio)? {
                            blitted = true;
                        }
                    }
                    CardComponentKey::Text(text_key) => {
                        self.cards.text[*text_key].blit(text_engine, card, board)?;
                        blitted = true;
                    }
                },
                EntityState::Active => {
                    if let CardComponentKey::Video(video_key) = &self.cards.components[card_key]
                        && self.cards.videos[*video_key].blit(card, board, &mut response.audio)?
                    {
                        blitted = true;
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
                        STRIDE,
                    );
                    blitted = true;
                }
            }
        }
        Ok(blitted)
    }

    fn tick_cursor(
        &mut self,
        cursor: DVec2,
        board_pre_cursor: &mut [u8],
        board: &mut [u8],
    ) -> bool {
        if !self.effects.hide_pointer_effects.keys().any(|k| {
            let effect_key = self.effects.components[k];
            matches!(
                self.effects.effects[effect_key],
                EntityState::StartedNow | EntityState::Active | EntityState::EndedNow
            )
        }) {
            // Copy the pre-cursor image onto the final image.
            board.copy_from_slice(board_pre_cursor);
            self.cursor.blit(cursor, board);
            true
        } else {
            false
        }
    }

    fn on_action(&mut self, action: Option<Action>, cursor: &mut DVec2, response: &mut Response) {
        if let Some(action) = action {
            let sensor_key = match action {
                Action::Mouse { delta, clicked } => {
                    // Apply the delta.
                    if let Some(delta) = delta {
                        *cursor += delta;
                    }
                    // Click.
                    if clicked {
                        self.sensors.on_click(cursor)
                    } else {
                        None
                    }
                }
                Action::KeyPress(key) => self.sensors.on_key(&key),
                Action::Submit() => todo!(),
            };
            // End the node.
            if let Some(sensor_key) = sensor_key {
                self.state = EntityState::EndedNow;
                response.finished = true;
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
            // Store the card ID string.
            card_ids.insert(card_id.clone(), card_key);
            // Add a new timer.
            timers.add_card(Timer::from(card), card_key);
            // Add an asset.
            match card {
                NodeCardsValue::ImageCard(image) => {
                    // Add an image.
                    let image_key = cards.images.insert(Image::new(image)?);
                    cards
                        .components
                        .insert(card_key, CardComponentKey::Image(image_key));
                }
                NodeCardsValue::VideoCard(video) => {
                    // Add a video.
                    let video_key = cards.videos.insert(Video::from_video_card(video)?);
                    cards
                        .components
                        .insert(card_key, CardComponentKey::Video(video_key));
                }
                NodeCardsValue::TextCard(text) => {
                    // Add text.
                    let text_key = cards.text.insert(Text::new(text)?);
                    cards
                        .components
                        .insert(card_key, CardComponentKey::Text(text_key));
                }
                other => todo!("unsupported card: {card_id} {:?}", other),
            }
        }

        // Set the order.
        let mut z_indices = cards
            .cards
            .iter()
            .map(|(k, v)| (k, v.z_index))
            .collect::<Vec<(CardKey, i64)>>();
        z_indices.sort_by(|a, b| a.1.cmp(&b.1));
        cards.order = z_indices.into_iter().map(|(k, _)| k).collect();
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

    fn add_effects(node: &nodekit_rs_graph::Node, timers: &mut Timers) -> Effects {
        let mut effects = Effects::default();
        for effect in node.effects.iter() {
            let effect_key = effects.effects.insert(EntityState::default());
            let hide_pointer_key = effects.hide_pointer_effects.insert(());
            effects.components.insert(hide_pointer_key, effect_key);
            timers.add_effect(
                Timer::new(effect.start_msec, Some(effect.end_msec)),
                effect_key,
            );
        }
        effects
    }
}
