use std::marker::PhantomData;
use std::mem;
use ffmpeg_next::format::context::Input;
use ffmpeg_next::{Error, Packet, Stream};

pub struct PacketIter<'a> {
    context: Input,
    _a: PhantomData<&'a ()>
}

impl From<Input> for PacketIter<'_> {
    fn from(value: Input) -> Self {
        Self {
            context: value,
            _a: Default::default()
        }
    }
}

impl<'a> Iterator for PacketIter<'a> {
    type Item = (Stream<'a>, Packet);

    fn next(&mut self) -> Option<<Self as Iterator>::Item> {
        let mut packet = Packet::empty();

        loop {
            match packet.read(&mut self.context) {
                Ok(..) => unsafe {
                    return Some((
                        Stream::wrap(mem::transmute_copy(&self.context), packet.stream()),
                        packet,
                    ));
                },

                Err(Error::Eof) => return None,

                Err(..) => (),
            }
        }
    }
}