use blittle::PositionI;
use crate::board::*;
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
    pub const fn get_position(&self) -> PositionI {
        Self::position(self.x, self.y)
    }

    pub const fn position(x: i64, y: i64) -> PositionI {
        PositionI {
            x: HORIZONTAL.i_size_half + x as isize,
            y: VERTICAL.i_size_half - y as isize
        }
    }
}

impl Default for Region {
    fn default() -> Self {
        Self {
            x: -HORIZONTAL.i_64_half,
            y: VERTICAL.i_64_half,
            w: HORIZONTAL.i_64,
            h: VERTICAL.i_64,
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
    use blittle::PositionI;
    use crate::board::HORIZONTAL;
    use crate::Region;

    #[test]
    fn test_position() {
        let position = Region::position(-HORIZONTAL.i_64_half, HORIZONTAL.i_64_half);
        assert_eq!(position, PositionI::default());
        let position = Region::position(0, 0);
        assert_eq!(position, PositionI {
            x: 512,
            y: 512
        });
        let position = Region::position(HORIZONTAL.i_64_half, -HORIZONTAL.i_64_half);
        assert_eq!(position, PositionI {
            x: 1024,
            y: 1024
        });
    }
}