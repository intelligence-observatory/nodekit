use crate::Error;
use nine_slice::fast_image_resize::{PixelType, ResizeAlg};
use nine_slice::{BorderOffsets, BorderScaling, NineSlicedSprite};
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_visual::{Board, RgbBuffer, RgbaBuffer, UnclippedRect};

/// A text box with arbitrary text.
pub struct TextEntry {
    pub background: RgbBuffer,
    pub text: Option<RgbaBuffer>,
}

impl TextEntry {
    pub fn new(region: &Region) -> Result<Option<Self>, Error> {
        const CORNER_SIZE: usize = 8;

        const BORDERS: BorderOffsets = BorderOffsets {
            left: CORNER_SIZE,
            top: CORNER_SIZE,
            right: CORNER_SIZE,
            bottom: 31,
        };

        match UnclippedRect::new(region).into_clipped_rect(BOARD_SIZE) {
            Some(rect) => {
                let image = nine_slice::fast_image_resize::images::Image::from_vec_u8(
                    17,
                    40,
                    include_bytes!("../text-entry/text-entry.raw").to_vec(),
                    PixelType::U8x3,
                )
                .map_err(Error::TextEntryBackground)?;
                let mut nine_sliced = NineSlicedSprite::new(image, BORDERS, BorderScaling::Stretch)
                    .map_err(Error::TextEntryNineSlice)?;
                nine_sliced.set_resize_algorithm(ResizeAlg::Nearest);
                let image = nine_sliced
                    .resize(rect.src_size.w as u32, rect.src_size.h as u32)
                    .map_err(Error::TextEntryNineSlice)?;
                let background = RgbBuffer::new(image.into_vec(), rect);

                Ok(Some(Self {
                    background,
                    text: None,
                }))
            }
            None => Ok(None),
        }
    }

    pub fn blit(&self, board: &mut Board) {
        board.blit_rgb(&self.background);
        if let Some(text) = self.text.as_ref() {
            board.overlay_rgba(text);
        }
    }
}
