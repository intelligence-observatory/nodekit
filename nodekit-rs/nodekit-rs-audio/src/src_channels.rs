#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum SrcChannels {
    One,
    Two,
    More(usize),
}
