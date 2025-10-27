use crate::Error;

const STANDARD: u32 = 44100;
const HALF: u32 = 22050;
const QUARTER: u32 = 11025;

#[derive(Copy, Clone)]
pub enum Rate {
    /// 44100
    Standard,
    /// 22050
    Half,
    /// 11025
    Quarter,
}

impl Rate {
    pub const fn from_u32(value: u32) -> Result<Self, Error> {
        match value {
            STANDARD => Ok(Self::Standard),
            HALF => Ok(Self::Half),
            QUARTER => Ok(Self::Quarter),
            other => Err(Error::Rate(other)),
        }
    }

    pub const fn rate(&self) -> u32 {
        match self {
            Self::Standard => STANDARD,
            Self::Half => HALF,
            Self::Quarter => QUARTER,
        }
    }

    pub const fn size_multiplier(&self) -> usize {
        match self {
            Self::Standard => 1,
            Self::Half => 2,
            Self::Quarter => 4,
        }
    }
}

impl From<u32> for Rate {
    fn from(value: u32) -> Self {
        match value {
            STANDARD => Self::Standard,
            HALF => Self::Half,
            QUARTER => Self::Quarter,
            other => panic!("Invalid audio rate: {other}"),
        }
    }
}
