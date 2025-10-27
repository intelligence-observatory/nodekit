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
            (Rate::Standard, 1) => Ok(Self {
                multiplier: 2,
                src_channels: SrcChannels::One,
            }),
            (Rate::Standard, 2) => Ok(Self {
                multiplier: 1,
                src_channels: SrcChannels::Two,
            }),
            (Rate::Standard, other) => Ok(Self {
                multiplier: 1,
                src_channels: SrcChannels::More(other),
            }),
            (Rate::Half, 1) => Ok(Self {
                multiplier: 4,
                src_channels: SrcChannels::One,
            }),
            (Rate::Half, 2) => Ok(Self {
                multiplier: 2,
                src_channels: SrcChannels::Two,
            }),
            (Rate::Half, other) => Ok(Self {
                multiplier: 2,
                src_channels: SrcChannels::More(other),
            }),
            (Rate::Quarter, 1) => Ok(Self {
                multiplier: 8,
                src_channels: SrcChannels::One,
            }),
            (Rate::Quarter, 2) => Ok(Self {
                multiplier: 4,
                src_channels: SrcChannels::Two,
            }),
            (Rate::Quarter, other) => Ok(Self {
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
        assert!(SizeMultiplier::new(Rate::Standard, 0).is_err());

        let s = SizeMultiplier::new(Rate::Standard, 1).unwrap();
        assert_eq!(s.multiplier, 2);
        assert_eq!(s.src_channels, SrcChannels::One);

        let s = SizeMultiplier::new(Rate::Standard, 2).unwrap();
        assert_eq!(s.multiplier, 1);
        assert_eq!(s.src_channels, SrcChannels::Two);

        let s = SizeMultiplier::new(Rate::Standard, 4).unwrap();
        assert_eq!(s.multiplier, 1);
        assert_eq!(s.src_channels, SrcChannels::More(4));

        let s = SizeMultiplier::new(Rate::Half, 1).unwrap();
        assert_eq!(s.multiplier, 4);
        assert_eq!(s.src_channels, SrcChannels::One);

        let s = SizeMultiplier::new(Rate::Half, 2).unwrap();
        assert_eq!(s.multiplier, 2);
        assert_eq!(s.src_channels, SrcChannels::Two);

        let s = SizeMultiplier::new(Rate::Half, 4).unwrap();
        assert_eq!(s.multiplier, 2);
        assert_eq!(s.src_channels, SrcChannels::More(4));

        let s = SizeMultiplier::new(Rate::Quarter, 1).unwrap();
        assert_eq!(s.multiplier, 8);
        assert_eq!(s.src_channels, SrcChannels::One);

        let s = SizeMultiplier::new(Rate::Quarter, 2).unwrap();
        assert_eq!(s.multiplier, 4);
        assert_eq!(s.src_channels, SrcChannels::Two);

        let s = SizeMultiplier::new(Rate::Quarter, 4).unwrap();
        assert_eq!(s.multiplier, 4);
        assert_eq!(s.src_channels, SrcChannels::More(4));
    }
}
