use ffmpeg_next::codec::Audio;
use ffmpeg_next::format::input;
use ffmpeg_next::media::Type;
use ffmpeg_next::software::scaling::Context;
use std::path::Path;

mod board;
mod extract;

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
