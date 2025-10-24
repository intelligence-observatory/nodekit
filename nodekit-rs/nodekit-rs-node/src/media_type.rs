pub enum MediaType {
    Image,
    Video {
        muted: bool,
        looped: bool
    },
}