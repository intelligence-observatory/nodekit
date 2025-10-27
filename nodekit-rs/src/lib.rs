use blittle::*;
use bytemuck::cast_slice_mut;
use hex_color::HexColor;
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::PyFloat;

const BOARD_D: usize = 768;
const BOARD_D_F64: f64 = 768.;
const BOARD_D_HALF_F64: f64 = 384.;
const BOARD_SIZE: Size = Size {
    w: BOARD_D,
    h: BOARD_D,
};
const STRIDE: usize = stride::RGB;

fn fill_board(node: &Bound<'_, PyAny>, board: &mut [u8]) -> PyResult<()> {
    let color = HexColor::parse(node.getattr("board_color")?.str()?.to_str()?).map_err(|e| PyErr::from(PyValueError::new_err(e.to_string())))?;
    board.chunks_exact_mut(3).for_each(|pixel| {
        pixel[0] = color.r;
        pixel[1] = color.g;
        pixel[2] = color.b;
    });
    Ok(())
}

fn to_f64(card: &Bound<PyAny>, name: &str) -> PyResult<f64> {
    Ok(card.getattr(name)?.cast::<PyFloat>()?.value())
}

fn spatial_coordinate(card: &Bound<PyAny>, name: &str) -> PyResult<isize> {
    Ok((BOARD_D_HALF_F64 + BOARD_D_F64 * to_f64(card, name)?) as isize)
}

fn size_coordinate(card: &Bound<PyAny>, name: &str) -> PyResult<usize> {
    Ok((BOARD_D_F64 * to_f64(card, name)?) as usize)
}

fn get_rect(card: &Bound<PyAny>) -> PyResult<(PositionU, Size)>{
    let position = PositionI {
        x: spatial_coordinate(&card, "x")?,
        y: spatial_coordinate(&card, "y")?,
    };
    let mut size = Size {
        w: size_coordinate(&card, "w")?,
        h: size_coordinate(&card, "h")?,
    };
    let position = clip(&position, &BOARD_SIZE, &mut size);
    Ok((position, size))
}

#[pymodule]
mod nodekit_rs {
    use pyo3::types::PyList;
    use super::*;

    #[pyclass]
    #[derive(Default)]
    pub struct Frame {
        pub visual: Vec<u8>,
        pub audio: Option<u8>
    }

    #[pyfunction]
    fn render(node: &Bound<'_, PyAny>, cursor_x: f64, cursor_y: f64, time: f64) -> PyResult<Frame> {
        let mut board = vec![0u8; BOARD_D * BOARD_D * STRIDE];
        // Fill the board.
        fill_board(node, &mut board)?;
        // Add cards.
        for card in node.getattr("cards")?.cast::<PyList>()? {
            let (position, size) = get_rect(&card)?;
            
        }
        Ok(Frame::default())
    }
}