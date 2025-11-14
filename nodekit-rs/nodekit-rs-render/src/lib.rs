mod error;

use blittle::blit;
use blittle::stride::RGB;
use bytemuck::cast_slice_mut;
pub use error::Error;
use nodekit_rs_image::*;
use nodekit_rs_models::{Status, nodekit_rs_models::*};
use nodekit_rs_visual::*;

#[derive(Default)]
pub struct Renderer {
    pub board: Vec<u8>,
    color: [u8; 3],
}

impl Renderer {
    pub fn start_node(&mut self, node: &Node) -> Result<(), Error> {
        let color = parse_color(&node.board_color).map_err(Error::ParseColor)?;
        self.color = [color[0], color[1], color[2]];
        // Fill the board.
        if self.board.is_empty() {
            self.board = board(self.color);
        } else {
            cast_slice_mut::<u8, [u8; 3]>(&mut self.board).fill(self.color);
        }
        self.blit(node)
    }

    pub fn blit(&mut self, node: &Node) -> Result<(), Error> {
        self.images(node)?;
        Ok(())
    }

    fn images(&mut self, node: &Node) -> Result<(), Error> {
        for (image, card) in node.get_images().iter() {
            let status = card.status(node.t_msec);
            // Blit the image now.
            if status == Status::StartedNow {
                blit_image(image, card.rect, &mut self.board).map_err(Error::Image)?;
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
        blit(
            &erasure,
            &blit_rect.size,
            &mut self.board,
            &blit_rect.position,
            &BOARD_SIZE,
            RGB,
        );
    }
}
