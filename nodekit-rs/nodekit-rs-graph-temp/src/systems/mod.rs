mod cards;
mod effects;
mod sensors;

pub use cards::Cards;
pub use effects::Effects;
pub use sensors::Sensors;

#[macro_export]
macro_rules! deserialize_system {
    ($key:ident, $name:ident) => {
        paste::paste! {
            pub fn deserialize<'c>(&mut self, node: &nodekit_rs_fb::Node<'c>) -> hashbrown::HashMap<&'c str, $key> {
                let mut ids = hashbrown::HashMap::default();
                if let Some(entities) = node.[<$name s>]() {
                    entities.iter().for_each(|entity| {
                        let (id, key) = self.[<deserialize_ $name>](&entity);
                        ids.insert(id, key);
                    });
                }
                ids
            }
        }
    };
}
