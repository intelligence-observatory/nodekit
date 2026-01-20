use crate::SELECTABLE_BORDER_COLOR;
use crate::asset::NonInteractiveAsset;
use crate::hoverable::Hoverable;
use blittle::ClippedRect;
use blittle::overlay::Vec4;
use nodekit_rs_visual::RgbaBuffer;

pub struct Selectable {
    pub hoverable: Hoverable,
    pub border: RgbaBuffer,
}

impl Selectable {
    pub fn new(asset: NonInteractiveAsset) -> Option<Self> {
        let hoverable = Hoverable::new(asset)?;
        let border = Self::selectable_border(hoverable.overlay.rect);
        Some(Self { hoverable, border })
    }

    fn selectable_border(rect: ClippedRect) -> RgbaBuffer {
        let mut buffer = vec![Vec4::ZERO; rect.src_size.w * rect.src_size.h];
        // Horizontal.
        let horizontal = vec![SELECTABLE_BORDER_COLOR; rect.src_size.w];
        for y in [0, 1, rect.src_size.h - 2, rect.src_size.h - 1] {
            let index = y * rect.src_size.w;
            buffer[index..index + rect.src_size.w].copy_from_slice(&horizontal);
        }
        // Vertical.
        let xs = [0, 1, rect.src_size.w - 2, rect.src_size.h - 1];
        for y in 2..rect.src_size.h - 2 {
            for x in xs {
                let index = x + y * rect.src_size.w;
                buffer[index] = SELECTABLE_BORDER_COLOR;
            }
        }
        RgbaBuffer { buffer, rect }
    }
}
