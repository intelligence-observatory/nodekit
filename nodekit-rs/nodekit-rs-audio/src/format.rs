use ffmpeg_next::format::Sample;

pub enum Format {
    U8,
    I16,
    I32,
    I64,
    F32,
    F64,
    None,
}

impl From<Sample> for Format {
    fn from(value: Sample) -> Self {
        match value {
            Sample::None => Self::None,
            Sample::U8(_) => Self::U8,
            Sample::I16(_) => Self::I16,
            Sample::I32(_) => Self::I32,
            Sample::I64(_) => Self::I64,
            Sample::F32(_) => Self::F32,
            Sample::F64(_) => Self::F64,
        }
    }
}
