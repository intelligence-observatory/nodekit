use crate::Error;
use blittle::{ClippedRect, PositionI};
use blittle::overlay::{rgba8_to_rgba32, Vec4};
use nine_slices::fast_image_resize::{PixelType, ResizeAlg};
use nine_slices::{BorderOffsets, BorderScaling, NineSlicedSprite};
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_visual::{Board, RgbaBuffer, UnclippedRect};
use crate::gutter::{Gutter, GutterState};

/// A text box with arbitrary text.
pub struct TextEntry {
    background: RgbaBuffer,
    /// The text buffer.
    /// This is initially None, and gets set by TextEngine.
    pub(crate) foreground: Option<RgbaBuffer>,
    /// Render the gutter.
    gutter: Option<Gutter>
}

impl TextEntry {
    pub fn new(region: &Region, gutter_confirm_button_text: &[Vec4]) -> Result<Option<Self>, Error> {
        const CORNER_SIZE: usize = 8;

        const BORDERS: BorderOffsets = BorderOffsets {
            left: CORNER_SIZE,
            top: CORNER_SIZE,
            right: CORNER_SIZE,
            bottom: 1,
        };

        match UnclippedRect::new(region).into_clipped_rect(BOARD_SIZE) {
            Some(rect) => {
                // Load the raw bitmap that will be 9-sliced scaled into the background.
                let image = nine_slices::fast_image_resize::images::Image::from_vec_u8(
                    17,
                    9,
                    include_bytes!("../backgrounds/text_entry.raw").to_vec(),
                    PixelType::U8x4,
                )
                .map_err(Error::TextEntryBackground)?;
                // Resize.
                let mut nine_sliced = NineSlicedSprite::new(image, BORDERS, BorderScaling::Stretch)
                    .map_err(Error::NineSlice)?;
                nine_sliced.set_resize_algorithm(ResizeAlg::Nearest);
                let image = nine_sliced
                    .resize(rect.src_size.w as u32, rect.src_size.h as u32)
                    .map_err(Error::NineSlice)?;
                let background = RgbaBuffer {
                    buffer: rgba8_to_rgba32(image.buffer()),
                    rect
                };

                let gutter_position = PositionI {
                    x: rect.dst_position.x,
                    y: rect.dst_position.y + rect.src_size.h.cast_signed() + 1
                };
                let gutter = Gutter::new(gutter_position, rect.src_size.w, &gutter_confirm_button_text);

                Ok(Some(Self {
                    background,
                    foreground: None,
                    gutter
                }))
            }
            None => Ok(None),
        }
    }

    pub const fn set_gutter_state(&mut self, gutter_state: GutterState) {
        if let Some(gutter) = self.gutter.as_mut() {
            gutter.set_state(gutter_state);
        }
    }

    pub fn blit(&self, board: &mut Board) {
        board.overlay_rgba(&self.background);
        if let Some(text) = self.foreground.as_ref() {
            board.overlay_rgba(text);
        }
        if let Some(gutter) = self.gutter.as_ref() {
            gutter.blit(board);
        }
    }

    pub fn get_clones_of_overlays(&self) -> Vec<RgbaBuffer> {
        let mut buffers = vec![self.background.clone()];
        if let Some(text) = self.foreground.clone() {
            buffers.push(text);
        }
        buffers
    }

    pub const fn rect(&self) -> ClippedRect {
        let mut rect = self.background.rect;
        if let Some(gutter) = self.gutter.as_ref() {
            rect.src_size.h += gutter.rect.src_size.h + 1;
        }
        rect
    }
}
