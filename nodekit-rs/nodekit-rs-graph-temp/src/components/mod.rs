mod card;
mod effect;
mod sensor;
mod timer;

pub use card::*;
pub use effect::*;
pub use sensor::*;
pub use timer::*;

#[macro_export]
macro_rules! fb_enum {
    ($name:ident, $error:literal, $($value:ident), *) => {
        pub enum $name {
            $(
                $value,
            )*
        }

        impl From<nodekit_rs_fb::$name> for $name {
            fn from(value: nodekit_rs_fb::$name) -> Self {
                match value {
                    $(
                        nodekit_rs_fb::$name::$value => Self::$value,
                    )*
                    other => unreachable!("Invalid {}: {}", $error, other.0)
                }
            }
        }
    };
}
