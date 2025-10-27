use crate::{Error, Rate, SrcChannels};

pub struct SizeMultiplier {
    pub multiplier: usize,
    pub src_channels: SrcChannels,
}

impl SizeMultiplier {
    pub const fn new(rate: Rate, channels: usize) -> Result<Self, Error> {
        match (rate, channels) {
            (Rate::FourEightZero, _) => panic!("48000"),
            (_, 0) => Err(Error::NoChannels),
            (Rate::FourFourOne, 1) => Ok(Self {
                multiplier: 2,
                src_channels: SrcChannels::One,
            }),
            (Rate::FourFourOne, 2) => Ok(Self {
                multiplier: 1,
                src_channels: SrcChannels::Two,
            }),
            (Rate::FourFourOne, other) => Ok(Self {
                multiplier: 1,
                src_channels: SrcChannels::More(other),
            }),
            (Rate::TwoTwoZero, 1) => Ok(Self {
                multiplier: 4,
                src_channels: SrcChannels::One,
            }),
            (Rate::TwoTwoZero, 2) => Ok(Self {
                multiplier: 2,
                src_channels: SrcChannels::Two,
            }),
            (Rate::TwoTwoZero, other) => Ok(Self {
                multiplier: 2,
                src_channels: SrcChannels::More(other),
            }),
            (Rate::OneOneZero, 1) => Ok(Self {
                multiplier: 8,
                src_channels: SrcChannels::One,
            }),
            (Rate::OneOneZero, 2) => Ok(Self {
                multiplier: 4,
                src_channels: SrcChannels::Two,
            }),
            (Rate::OneOneZero, other) => Ok(Self {
                multiplier: 4,
                src_channels: SrcChannels::More(other),
            }),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_size_multiplier() {
        assert!(SizeMultiplier::new(Rate::FourFourOne, 0).is_err());

        let s = SizeMultiplier::new(Rate::FourFourOne, 1).unwrap();
        assert_eq!(s.multiplier, 2);
        assert_eq!(s.src_channels, SrcChannels::One);

        let s = SizeMultiplier::new(Rate::FourFourOne, 2).unwrap();
        assert_eq!(s.multiplier, 1);
        assert_eq!(s.src_channels, SrcChannels::Two);

        let s = SizeMultiplier::new(Rate::FourFourOne, 4).unwrap();
        assert_eq!(s.multiplier, 1);
        assert_eq!(s.src_channels, SrcChannels::More(4));

        let s = SizeMultiplier::new(Rate::TwoTwoZero, 1).unwrap();
        assert_eq!(s.multiplier, 4);
        assert_eq!(s.src_channels, SrcChannels::One);

        let s = SizeMultiplier::new(Rate::TwoTwoZero, 2).unwrap();
        assert_eq!(s.multiplier, 2);
        assert_eq!(s.src_channels, SrcChannels::Two);

        let s = SizeMultiplier::new(Rate::TwoTwoZero, 4).unwrap();
        assert_eq!(s.multiplier, 2);
        assert_eq!(s.src_channels, SrcChannels::More(4));

        let s = SizeMultiplier::new(Rate::OneOneZero, 1).unwrap();
        assert_eq!(s.multiplier, 8);
        assert_eq!(s.src_channels, SrcChannels::One);

        let s = SizeMultiplier::new(Rate::OneOneZero, 2).unwrap();
        assert_eq!(s.multiplier, 4);
        assert_eq!(s.src_channels, SrcChannels::Two);

        let s = SizeMultiplier::new(Rate::OneOneZero, 4).unwrap();
        assert_eq!(s.multiplier, 4);
        assert_eq!(s.src_channels, SrcChannels::More(4));
    }
}
