use crate::Card;
use crate::error::Error;
use blittle::blit;
use hex_color::HexColor;
use nodekit_rs_board::{STRIDE, VISUAL_SIZE};
use nodekit_rs_graph::TextCard;
use nodekit_rs_text::{JustificationHorizontal, JustificationVertical};
use slotmap::new_key_type;

new_key_type! { pub struct TextKey; }

#[derive(Default)]
pub struct Text {
    pub text: String,
    pub font_size: u16,
    pub text_color: [u8; 3],
    pub background_color: [u8; 3],
    pub justification_horizontal: JustificationHorizontal,
    pub justification_vertical: JustificationVertical,
}

impl Text {
    pub fn new(card: &TextCard) -> Result<Self, Error> {
        let text_color = HexColor::parse_rgb(card.text_color.as_str()).map_err(Error::HexColor)?;
        let background_color =
            HexColor::parse_rgb(card.background_color.as_str()).map_err(Error::HexColor)?;
        let justification_horizontal = match &card.justification_horizontal {
            nodekit_rs_graph::JustificationHorizontal::Left => JustificationHorizontal::Left,
            nodekit_rs_graph::JustificationHorizontal::Center => JustificationHorizontal::Center,
            nodekit_rs_graph::JustificationHorizontal::Right => JustificationHorizontal::Right,
        };
        let justification_vertical = match &card.justification_vertical {
            nodekit_rs_graph::JustificationVertical::Top => JustificationVertical::Top,
            nodekit_rs_graph::JustificationVertical::Center => JustificationVertical::Center,
            nodekit_rs_graph::JustificationVertical::Bottom => JustificationVertical::Bottom,
        };
        Ok(Self {
            text: card.text.clone(),
            font_size: card.font_size.0 as u16,
            text_color: [text_color.r, text_color.g, text_color.b],
            background_color: [background_color.r, background_color.g, background_color.b],
            justification_horizontal,
            justification_vertical,
        })
    }

    pub fn blit(
        &self,
        text: &mut nodekit_rs_text::Text,
        card: &Card,
        board: &mut [u8],
    ) -> Result<(), Error> {
        let frame = text
            .render(
                &self.text,
                self.font_size,
                self.justification_horizontal,
                self.justification_vertical,
                card.rect.size,
                self.text_color,
                self.background_color,
            )
            .map_err(Error::Text)?;
        blit(
            &frame,
            &card.rect.size,
            board,
            &card.rect.position,
            &VISUAL_SIZE,
            STRIDE,
        );
        Ok(())
    }
}
