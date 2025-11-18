mod error;

use blittle::blit;
use bytemuck::cast_slice_mut;
pub use error::Error;
use nodekit_rs_image::*;
use nodekit_rs_models::{Status, nodekit_rs_models::*};
use nodekit_rs_visual::*;

#[derive(Default)]
pub struct Renderer {
    pub board: Vec<u8>,
    color: [u8; STRIDE],
    text: nodekit_rs_text::Text,
}

impl Renderer {
    pub fn start_node(&mut self, node: &Node) -> Result<(), Error> {
        self.color = parse_color(&node.board_color).map_err(Error::ParseColor)?;
        // Fill the board.
        if self.board.is_empty() {
            self.board = board(self.color);
        } else {
            cast_slice_mut::<u8, [u8; STRIDE]>(&mut self.board).fill(self.color);
        }
        self.blit(node)
    }

    pub fn blit(&mut self, node: &Node) -> Result<(), Error> {
        for card in node.get_ordered_cards().iter() {
            match card.status(node.t_msec) {
                Status::Pending | Status::Finished => (),
                Status::StartedNow => match &card.card_type {
                    CardType::Image(image) => {
                        blit_image(image, card.rect, &mut self.board).map_err(Error::Image)?
                    }
                    CardType::Text(text) => self.text.blit(card, text, &mut self.board).map_err(Error::Text)?,
                    CardType::Video(video) => nodekit_rs_video::blit(card, video, &mut self.board).map_err(Error::Video)?,
                },
                Status::Active => {
                    if let CardType::Video(video) = &card.card_type {
                        nodekit_rs_video::blit(card, video, &mut self.board).map_err(Error::Video)?;
                    }
                }
                Status::EndedNow => {
                    self.erase(card.rect);
                }
            }
        }
        Ok(())
    }

    fn erase(&mut self, rect: Rect) {
        let width = size_coordinate(rect.size.w);
        let height = size_coordinate(rect.size.h);
        // An empty image.
        let erasure = bitmap(width, height, self.color);
        // Blit it.
        let blit_rect = BlitRect::from(rect);
        blit(
            &erasure,
            &blit_rect.size,
            &mut self.board,
            &blit_rect.position,
            &BOARD_SIZE,
            STRIDE,
        );
    }
}
