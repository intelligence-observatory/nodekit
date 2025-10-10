pub(crate) use super::error::Error;
use paste::paste;
pub(crate) use std::io::Write;

macro_rules! write_value {
    ($t:ident) => {
        paste! {
            pub fn [<write_ $t>](file: &mut std::fs::File, value: $t) -> Result<(), Error> {
                file.write_all(&value.to_le_bytes()).map_or_else(|e| Err(Error::Io(e)), |_| Ok(()))
            }
        }
    };
}

write_value!(u32);
write_value!(usize);
