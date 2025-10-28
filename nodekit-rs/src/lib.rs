mod blit;
mod rect;
mod video_indices;

use blit::*;
use nodekit_rs_cursor::blit_cursor;
use nodekit_rs_visual::*;
use pyo3::{prelude::*, types::PyDict};
use pyo3_stub_gen::{define_stub_info_gatherer, derive::*};

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
    pub use nodekit_rs_audio::{AudioFormat, AudioFrame};
    #[pymodule_export]
    pub use nodekit_rs_visual::VisualFrame;

    /// A frame of audio/visual data.
    #[gen_stub_pyclass]
    #[pyclass]
    pub struct Frame {
        /// A raw bitmap buffer plus its width and height.
        #[pyo3(get)]
        pub visual: VisualFrame,
        /// The audio buffer. None if there was no audio on this frame.
        #[pyo3(get)]
        pub audio: Option<AudioFrame>,
    }

    /// Given a `node`, a `time_msec` (time in milliseconds), and a cursor position,
    /// render the audio/visual state of the node.
    #[pyfunction]
    #[gen_stub_pyfunction]
    pub fn render(
        node: &Bound<'_, PyAny>,
        time_msec: u64,
        cursor_x: f64,
        cursor_y: f64,
    ) -> PyResult<Frame> {
        let mut visual = vec![0u8; VISUAL_D * VISUAL_D * STRIDE];
        let mut audio = None;
        // Fill the visual.
        fill_visual(node, &mut visual)?;
        // Add cards.
        for card in node.getattr("cards")?.cast::<PyDict>()?.values() {
            // Ignore cards before or after `time`.
            if is_active_at_time(&card, time_msec)? {
                blit_card(&card, time_msec, &mut audio, &mut visual)?;
            }
        }

        // Blit the cursor on top of everything.
        blit_cursor(cursor_x, cursor_y, &mut visual);

        let visual = VisualFrame {
            buffer: visual,
            width: VISUAL_D_U32,
            height: VISUAL_D_U32,
        };

        Ok(Frame { visual, audio })
    }

    define_stub_info_gatherer!(stub_info);
}
