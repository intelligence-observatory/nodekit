mod image;
mod text;
mod video;

use std::path::PathBuf;
use blittle::*;
pub use image::*;
use nodekit_rs_board::*;
use nodekit_rs_graph::{AssetLocator, NodeCardsValue, Sha256};
use slotmap::new_key_type;
use url::Url;
use nodekit_rs_asset::{sha256_string_to_hash, AssetManager, MediaType};
pub use text::*;
pub use video::*;

new_key_type! { pub struct CardKey; }

pub struct Card {
    pub position: PositionU,
    pub size: Size,
}

impl Card {
    pub const fn spatial_coordinate(c: f64) -> isize {
        (BOARD_D_HALF_F64 + BOARD_D_F64 * c) as isize
    }

    pub const fn size_coordinate(c: f64) -> usize {
        (BOARD_D_F64 * c) as usize
    }
}

macro_rules! from_raw {
    ($card:ident) => {{
        let position = PositionI {
            x: Self::spatial_coordinate($card.x),
            y: Self::spatial_coordinate($card.y),
        };
        let mut size = Size {
            w: Self::size_coordinate($card.w),
            h: Self::size_coordinate($card.h),
        };
        let position = clip(&position, &BOARD_SIZE, &mut size);
        Self { position, size }
    }};
}

impl From<&NodeCardsValue> for Card {
    fn from(value: &NodeCardsValue) -> Self {
        match value {
            NodeCardsValue::FreeTextEntryCard(card) => from_raw!(card),
            NodeCardsValue::ImageCard(card) => from_raw!(card),
            NodeCardsValue::SliderCard(card) => from_raw!(card),
            NodeCardsValue::TextCard(card) => from_raw!(card),
            NodeCardsValue::VideoCard(card) => from_raw!(card),
        }
    }
}

pub(super) fn add_asset<'a>(locator: &'a AssetLocator, hash: &Sha256, media_type: MediaType, manager: &'a mut AssetManager<'a>) -> Result<bool, nodekit_rs_asset::Error> {
    match locator {
        AssetLocator::Url(url) => {
            let hash = sha256_string_to_hash(&hash.as_str())?;
            manager.downloader.add(Url::parse(&url.url).unwrap(), hash, media_type)
        }
        AssetLocator::FileSystemPath(path) => {
            manager.copier.add(&path.path, media_type)
        }
        AssetLocator::RelativePath(path) => {
            let path = PathBuf::from(&path.relative_path).canonicalize().unwrap();
            manager.copier.add(path, media_type)
        }
        AssetLocator::ZipArchiveInnerPath(zip ) => {
            manager.unzipper.add(&zip.zip_archive_path, &zip.inner_path, media_type)
        }
    }
}