const COLOR: [u8; 4] = [255, 0, 255, 255];
const RADIUS: usize = 16;
const DIAMETER: usize = 32;

pub fn ok(){}

#[cfg(test)]
mod tests {
    use crate::DIAMETER;

    #[test]
    fn test_cursor_image() {
        let cursor = include_bytes!("../cursor");
        assert_eq!(cursor.len(), DIAMETER * DIAMETER * 4);
    }
}