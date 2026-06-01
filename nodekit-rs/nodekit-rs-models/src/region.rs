use crate::board::*;
use blittle::PositionI;
use pyo3::prelude::*;

/// A card's spatial region.
#[derive(Clone, Debug)]
pub struct Region {
    pub x: i64,
    pub y: i64,
    pub w: i64,
    pub h: i64,
    pub z_index: Option<i64>,
}

impl Region {
    /// Convert x and y to a nodekit-rs position.
    /// In nodekit-rs, the top-left corner of the board is (0, 0),
    /// and assets pivot on their top-left corner rather than their center point.
    pub const fn get_position(&self) -> PositionI {
        Self::position(self.x, self.y, self.w as isize, self.h as isize)
    }

    pub const fn position(x: i64, y: i64, w: isize, h: isize) -> PositionI {
        PositionI {
            x: (HORIZONTAL.cast_signed() / 2) + x as isize - w / 2,
            y: (VERTICAL.cast_signed() / 2) - y as isize - h / 2,
        }
    }
}

impl Default for Region {
    fn default() -> Self {
        Self {
            x: 0,
            y: 0,
            w: HORIZONTAL.cast_signed() as i64,
            h: VERTICAL.cast_signed() as i64,
            z_index: None,
        }
    }
}

impl<'py> FromPyObject<'_, 'py> for Region {
    type Error = PyErr;

    fn extract(obj: Borrowed<'_, 'py, PyAny>) -> Result<Self, Self::Error> {
        Ok(Self {
            x: obj.getattr("x")?.extract::<i64>()?,
            y: obj.getattr("y")?.extract::<i64>()?,
            w: obj.getattr("w")?.extract::<i64>()?,
            h: obj.getattr("h")?.extract::<i64>()?,
            z_index: obj.getattr("z_index")?.extract::<Option<i64>>()?,
        })
    }
}

#[cfg(test)]
mod tests {
    use crate::Region;
    use crate::board::{HORIZONTAL, VERTICAL};
    use blittle::PositionI;

    #[test]
    fn test_position() {
        let x1 = HORIZONTAL.cast_signed() as i64 / 2;
        let y1 = VERTICAL.cast_signed() as i64 / 2;
        let position = Region::position(-x1, y1, 0, 0);
        assert_eq!(position, PositionI::default());
        let position = Region::position(0, 0, 0, 0);
        assert_eq!(
            position,
            PositionI {
                x: x1 as isize,
                y: y1 as isize
            }
        );
        let position = Region::position(x1, -y1, 0, 0);
        assert_eq!(position, PositionI { x: 1024, y: 1024 });

        let position = Region::position(x1, -y1, 400, 300);
        assert_eq!(position, PositionI { x: 824, y: 874 });
    }
}
