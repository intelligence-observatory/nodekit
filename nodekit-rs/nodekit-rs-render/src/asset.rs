use crate::hoverable::Hoverable;
use crate::selectable::Selectable;
use blittle::ClippedRect;
use nodekit_rs_text::{TextBuffers, TextEntryBuffers};
use nodekit_rs_video::Video;
use nodekit_rs_visual::VisualBuffer;

pub enum NonInteractiveAsset {
    Image(VisualBuffer),
    Text(TextBuffers),
    Video(Video),
}

impl NonInteractiveAsset {
    pub const fn rect(&self) -> Option<ClippedRect> {
        match self {
            Self::Image(buffer) => Some(buffer.rect()),
            Self::Text(buffers) => buffers.rect(),
            Self::Video(video) => Some(video.rgb_buffer.rect),
        }
    }
}

pub enum InteractiveAsset {
    TextEntry(TextEntryBuffers),
    Hoverable(Hoverable),
    Selectable(Selectable),
}

impl InteractiveAsset {
    pub const fn rect(&self) -> ClippedRect {
        match self {
            Self::TextEntry(buffers) => buffers.rect,
            Self::Hoverable(hoverable) => hoverable.overlay.rect,
            Self::Selectable(selectable) => selectable.hoverable.overlay.rect,
        }
    }
}

pub enum AssetType {
    Interactive(InteractiveAsset),
    NonInteractive(NonInteractiveAsset),
    MultiSelectConfirm(NonInteractiveAsset),
}

impl AssetType {
    pub const fn rect(&self) -> Option<ClippedRect> {
        match self {
            Self::NonInteractive(asset) | Self::MultiSelectConfirm(asset) => asset.rect(),
            Self::Interactive(asset) => Some(asset.rect()),
        }
    }
}

pub struct Asset {
    pub asset: AssetType,
    pub z_index: Option<i64>,
}
