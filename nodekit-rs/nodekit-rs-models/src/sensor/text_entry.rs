use pyo3::prelude::*;

pub struct TextEntry {
    pub prompt: String,
    pub font_size: f64,
    pub min_length: usize,
    pub max_length: usize,
    pub text: String,
}

impl FromPyObject<'_, '_> for TextEntry {
    type Error = PyErr;
    
    fn extract(obj: Borrowed<'_, '_, PyAny>) -> Result<Self, Self::Error> {
        let prompt = obj.getattr("prompt")?.extract::<String>()?;
        let font_size = obj.getattr("font_size")?.extract::<f64>()?;
        let min_length = obj.getattr("min_length")?.extract::<i64>()?.cast_unsigned() as usize;
        let max_length = obj.getattr("max_length")?.extract::<i64>()?.cast_unsigned() as usize;
        Ok(Self {
            prompt,
            font_size,
            min_length,
            max_length,
            text: String::default()
        })
    }
}