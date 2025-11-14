use crate::card::{Card, CardType, Video};
use crate::{Image, Text};
use hashbrown::HashMap;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::{gen_stub_pyclass, gen_stub_pymethods};

/// A node in a graph.
#[gen_stub_pyclass]
#[pyclass]
pub struct Node {
    /// The node's cards.
    cards: HashMap<String, Card>,
    /// The time elapsed from the start of the node.
    pub t_msec: u64,
    /// The background color.
    pub board_color: String,
}

#[gen_stub_pymethods]
#[pymethods]
impl Node {
    /// `board_color` must be a valid RGBA hex string e.g. "#808080ff"
    #[new]
    pub fn new(board_color: String) -> Self {
        Self {
            cards: Default::default(),
            t_msec: 0,
            board_color,
        }
    }

    /// Add a card to the node.
    pub fn add_card(&mut self, card_id: String, card: Card) {
        self.cards.insert(card_id, card);
    }
}

impl Node {
    /// Returns the cards in their render order.
    pub fn get_ordered_cards(&self) -> Vec<&Card> {
        let mut cards = self.cards.values().collect::<Vec<&Card>>();
        cards.sort_by(|a, b| a.z_index.cmp(&b.z_index));
        cards
    }
    
    /// Returns all videos in the node that are visible.
    /// Key: card ID.
    /// Value: The video, and the current time in the video, in milliseconds.
    pub fn get_video_times(&self) -> HashMap<&String, (&Video, u64)> {
        self.cards
            .iter()
            .filter_map(|(card_id, card)| {
                if card.is_visible(self.t_msec) {
                    if let CardType::Video(video) = &card.card_type {
                        let time = self.t_msec - card.timer.start_msec;
                        Some((card_id, (video, time)))
                    } else {
                        None
                    }
                } else {
                    None
                }
            })
            .collect()
    }
}
