/// A raw RGB24 pixel buffer, decoded from an image file, with its original dimensions.
pub struct DecodedImage {
    pub bytes: Vec<u8>,
    pub width: u32,
    pub height: u32,
}
