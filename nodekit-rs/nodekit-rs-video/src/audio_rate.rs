const STANDARD: u32 = 44100;
const HALF: u32 = 22050;
const QUARTER: u32 = 11025;

#[derive(Copy, Clone)]
pub enum AudioRate {
    /// 44100
    Standard,
    /// 22050
    Half,
    /// 11025
    Quarter,
}

impl AudioRate {
    pub const fn rate(&self) -> u32 {
        match self {
            Self::Standard => STANDARD,
            Self::Half => HALF,
            Self::Quarter => QUARTER,
        }
    }
}

impl From<u32> for AudioRate {
    fn from(value: u32) -> Self {
        match value {
            STANDARD => Self::Standard,
            HALF => Self::Half,
            QUARTER => Self::Quarter,
            other => panic!("Invalid audio rate: {other}"),
        }
    }
}
