use pyo3::prelude::*;

pub struct TextEntry {
    pub prompt: String,
    pub font_size: f64,
    pub text: String,
}

impl FromPyObject<'_, '_> for TextEntry {
    type Error = PyErr;
    
    fn extract(obj: Borrowed<'_, '_, PyAny>) -> Result<Self, Self::Error> {
        let prompt = obj.getattr("prompt")?.extract::<String>()?;
        let font_size = obj.getattr("font_size")?.extract::<f64>()?;
        Ok(Self {
            prompt,
            font_size,
            text: String::default()
        })
    }
}