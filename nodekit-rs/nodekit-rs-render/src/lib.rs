mod image;
mod visual_buffer;
mod error;
mod board;
mod borrowed_visual_buffer;
mod blit_rect;

use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use blittle::blit;
use blittle::stride::RGB;
use bytemuck::cast_slice_mut;
use hex_color::HexColor;
use nodekit_rs_models::{nodekit_rs_models::*, Status};
use visual_buffer::VisualBuffer;
use crate::board::{bitmap, board, size_coordinate, BOARD_SIZE};
pub use error::Error;
use crate::blit_rect::BlitRect;
use crate::image::blit_image;

#[derive(Default)]
pub struct Renderer {
    pub board: Vec<u8>,
    color: [u8; 3]
}

impl Renderer {
    pub fn start_node(&mut self, node: &Node) -> Result<(), Error> {
        let color = HexColor::parse_rgba(node.board_color.as_str()).map_err(|e| Error::HexColor(node.board_color.clone(), e))?;
        self.color = [color.r, color.g, color.b];
        // Fill the board.
        if self.board.is_empty() {
            self.board = board(self.color);
        }
        else {
            cast_slice_mut::<u8, [u8; 3]>(&mut self.board).fill(self.color);
        }
        self.blit(node)?;
    }

    pub fn blit(&mut self, node: &Node) -> Result<(), Error> {

    }

    fn images(&mut self, node: &Node) -> Result<(), Error> {
        for (image, card) in node.get_images().iter() {
            let status = card.status(node.t_msec);
            // Blit the image now.
            if status == Status::StartedNow {
                blit_image(image, card.rect, &mut self.board)?;
            }
            // Erase the image.
            else if status == Status::EndedNow {
                self.erase(card.rect);
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
        blit(&erasure, &blit_rect.size, &mut self.board, &blit_rect.position, &BOARD_SIZE, RGB);
    }
}
