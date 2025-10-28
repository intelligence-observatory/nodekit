mod asset;
mod media_type;
mod video_asset;
mod extractors;
mod blitters;

use nodekit_rs_cursor::blit_cursor;
use nodekit_rs_visual::*;
use pyo3::{
    prelude::*,
    types::PyDict,
};
use pyo3_stub_gen::{derive::*, define_stub_info_gatherer};
use extractors::*;
use blitters::*;

fn is_active_at_time(card: &Bound<PyAny>, time: u64) -> PyResult<bool> {
    let t0 = card.getattr("start_msec")?.extract::<u64>()?;
    let t1 = card.getattr("end_msec")?.extract::<Option<u64>>()?;
    Ok(time >= t0
        && match t1 {
            Some(t1) => t1 < time,
            None => true,
        })
}

#[pymodule]
pub mod nodekit_rs {
    use super::*;
    #[pymodule_export]
    pub use nodekit_rs_visual::VisualFrame;
    #[pymodule_export]
    pub use nodekit_rs_video::{Audio, AudioFormat};

    /// A frame of audio/visual data.
    #[pyclass]
    #[gen_stub_pyclass]
    pub struct Frame {
        /// A raw bitmap buffer plus its width and height.
        #[pyo3(get)]
        pub visual: VisualFrame,
        /// The audio buffer. None if there was no audio on this frame.
        #[pyo3(get)]
        pub audio: Option<Audio>,
    }

    /// Given a `node`, a cursor position, and a `time` in milliseconds,
    /// render the audio/visual state of the node.
    #[pyfunction]
    #[pyo3(signature = (node: "Node", cursor_x: "float", cursor_y: "float", time: "int") -> "Frame")]
    pub fn render(
        node: &Bound<'_, PyAny>,
        cursor_x: f64,
        cursor_y: f64,
        time: u64,
    ) -> PyResult<Frame> {
        let mut visual = vec![0u8; VISUAL_D * VISUAL_D * STRIDE];
        let mut audio = None;
        // Fill the visual.
        fill_visual(node, &mut visual)?;
        // Add cards.
        for card in node.getattr("cards")?.cast::<PyDict>()?.values() {
            // Ignore cards before or after `time`.
            if is_active_at_time(&card, time)? {
                // Get the blit-able position and size of the card.
                let (position, size) = get_rect(&card)?;
                // Got an asset.
                if let Some(asset) = get_asset(&card)? {
                    blit_asset(asset, time, &mut audio, &mut visual, &position, &size)?;
                }
            }
        }

        // Blit the cursor on top of everything.
        blit_cursor(cursor_x, cursor_y, &mut visual);

        let visual = VisualFrame {
            buffer: visual,
            width: VISUAL_D_U32,
            height: VISUAL_D_U32
        };

        Ok(Frame { visual, audio })
    }

    define_stub_info_gatherer!(stub_info);
}
