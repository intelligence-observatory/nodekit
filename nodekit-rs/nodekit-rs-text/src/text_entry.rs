use crate::Error;
use blittle::ClippedRect;
use nine_slices::fast_image_resize::{PixelType, ResizeAlg};
use nine_slices::{BorderOffsets, BorderScaling, NineSlicedSprite};
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_visual::{Board, RgbBuffer, RgbaBuffer, UnclippedRect};

/// A text box with arbitrary text.
pub struct TextEntry {
    background: RgbBuffer,
    /// The text buffer.
    /// This is initially None, and gets set by TextEngine.
    pub(crate) foreground: Option<RgbaBuffer>,
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
                // Load the raw bitmap that will be 9-sliced scaled into the background.
                let image = nine_slices::fast_image_resize::images::Image::from_vec_u8(
                    17,
                    40,
                    include_bytes!("../backgrounds/text-entry.raw").to_vec(),
                    PixelType::U8x3,
                )
                .map_err(Error::TextEntryBackground)?;
                // Resize.
                let mut nine_sliced = NineSlicedSprite::new(image, BORDERS, BorderScaling::Stretch)
                    .map_err(Error::NineSlice)?;
                nine_sliced.set_resize_algorithm(ResizeAlg::Nearest);
                let image = nine_sliced
                    .resize(rect.src_size.w as u32, rect.src_size.h as u32)
                    .map_err(Error::NineSlice)?;
                let background = RgbBuffer::new(image.into_vec(), rect);

                Ok(Some(Self {
                    background,
                    foreground: None,
                }))
            }
            None => Ok(None),
        }
    }

    pub fn blit(&self, board: &mut Board) {
        board.blit_rgb(&self.background);
        if let Some(text) = self.foreground.as_ref() {
            board.overlay_rgba(text);
        }
    }

    pub fn get_clones_of_overlays(&self) -> Vec<RgbaBuffer> {
        let mut buffers = vec![self.background.as_rgba()];
        if let Some(text) = self.foreground.clone() {
            buffers.push(text);
        }
        buffers
    }

    pub const fn rect(&self) -> ClippedRect {
        self.background.rect
    }
}
