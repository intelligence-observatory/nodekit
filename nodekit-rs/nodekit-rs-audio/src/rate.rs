use crate::Error;

const STANDARD: u32 = 44100;
const HALF: u32 = 22050;
const QUARTER: u32 = 11025;

#[derive(Copy, Clone)]
pub enum Rate {
    /// 48000
    FourEightZero,
    /// 44100
    FourFourOne,
    /// 22050
    TwoTwoZero,
    /// 11025
    OneOneZero,
}

impl Rate {
    pub const fn from_u32(value: u32) -> Result<Self, Error> {
        match value {
            48000 => Ok(Self::FourEightZero),
            44100 => Ok(Self::FourFourOne),
            22050 => Ok(Self::TwoTwoZero),
            11025 => Ok(Self::OneOneZero),
            other => Err(Error::Rate(other)),
        }
    }

    pub const fn size_multiplier(&self) -> usize {
        match self {
            Self::FourEightZero => panic!("48000 size multiplier"),
            Self::FourFourOne => 1,
            Self::TwoTwoZero => 2,
            Self::OneOneZero => 4,
        }
    }
}

impl From<u32> for Rate {
    fn from(value: u32) -> Self {
        match value {
            STANDARD => Self::FourFourOne,
            HALF => Self::TwoTwoZero,
            QUARTER => Self::OneOneZero,
            other => panic!("Invalid audio rate: {other}"),
        }
    }
}
