use crate::Error;
use crate::error::SvgError;
use blittle::Size;
use blittle::overlay::rgba8_to_rgba32;
use nodekit_rs_models::Region;
use nodekit_rs_models::board::BOARD_SIZE;
use nodekit_rs_visual::{RgbaBuffer, VisualBuffer, get_resized_rect};
use resvg::render;
use resvg::tiny_skia::{Pixmap, Transform};
use resvg::usvg::{Options, Tree};

/// Load a svg `asset` and rasterize it.
pub fn load_svg(
    asset: &str,
    region: &Region,
    buffer: Vec<u8>,
) -> Result<Option<VisualBuffer>, Error> {
    // Parse the .svg file into a tree.
    let tree = Tree::from_data(&buffer, &Options::default())
        .map_err(|e| Error::Svg(SvgError::Parse(e, asset.to_string())))?;
    let size = tree.size();
    // Resize the rect.
    let (rect, _) = get_resized_rect(
        Size {
            w: size.width() as usize,
            h: size.height() as usize,
        },
        region,
    );
    match rect.into_clipped_rect(BOARD_SIZE) {
        Some(rect) => {
            // Get an empty Pixmap.
            let mut map = Pixmap::new(rect.src_size.w as u32, rect.src_size.h as u32)
                .ok_or(Error::Svg(SvgError::Pixmap(asset.to_string())))?;
            // Set the scale. (1, 1) means no scaling.
            let transform = Transform::from_scale(
                rect.src_size.w as f32 / size.width(),
                rect.src_size.h as f32 / size.height(),
            );
            // Rasterize.
            render(&tree, transform, &mut map.as_mut());
            // Convert.
            let buffer = rgba8_to_rgba32(map.data());
            Ok(Some(VisualBuffer::Rgba(RgbaBuffer { buffer, rect })))
        }
        None => Ok(None),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use blittle::overlay::rgba32_to_rgba8;
    use nodekit_rs_asset::load_asset;
    use nodekit_rs_models::board::*;
    use nodekit_rs_models::card::Asset;
    use nodekit_rs_visual::Board;
    use std::path::PathBuf;

    #[test]
    fn test_load_svg() {
        let asset = Asset::Path(PathBuf::from("test_images/fixation-cross.svg"));
        let buffer = load_asset(&asset).unwrap();
        let svg = load_svg(&asset.to_string(), &Region::default(), buffer)
            .unwrap()
            .unwrap();
        let rect = svg.rect();
        assert_eq!(rect.src_size.w, HORIZONTAL);
        assert_eq!(rect.src_size.h, VERTICAL);
        let mut board = Board::new([50, 50, 50]);
        if let VisualBuffer::Rgba(buffer) = &svg {
            nodekit_rs_png::rgba_to_png(
                "out/svg.png",
                &rgba32_to_rgba8(&buffer.buffer),
                rect.src_size.w as u32,
                rect.src_size.h as u32,
            );
        }
        board.blit(&svg);
        nodekit_rs_png::board_to_png("out/svg_board.png", &board.render());
    }
}
