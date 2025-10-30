mod audio;
mod visual;

use flatbuffers::FlatBufferBuilder;
use nodekit_rs_fb::response;
pub use visual::*;
use pyo3::exceptions::PyTypeError;
use pyo3::prelude::*;
use pyo3_stub_gen::derive::*;
pub use audio::*;

#[gen_stub_pyclass]
#[pyclass]
#[derive(Default)]
pub struct Response {
    /// The visual frame. 
    /// If None, the visual frame didn't update.
    #[pyo3(get)]
    pub visual: Option<VisualFrame>,
    /// The audio frame. 
    /// If None, the audio frame either didn't update or there is no audio.
    pub audio: Option<AudioFrame>,
    /// If not None, this is the ID of the sensor triggered the end of the node. 
    pub sensor: Option<String>,
    pub finished: bool,
}

impl Response {
    pub fn serialize(&self) -> Vec<u8> {
        let mut fbb = FlatBufferBuilder::new();

        let visual = self.visual.as_ref().map(|visual| {
            let buffer = Some(fbb.create_vector(&visual.buffer));
            let args = response::VisualFrameArgs {
                buffer,
                width: visual.width,
                height: visual.height,
            };
            response::VisualFrame::create(&mut fbb, &args)
        });

        let audio = self.audio.as_ref().map(|audio| {
            let buffer = Some(fbb.create_vector(&audio.buffer));
            let format = match audio.format.as_ref() {
                Some(format) => match format {
                    AudioFormat::U8 => response::AudioFormat::U8,
                    AudioFormat::I16 => response::AudioFormat::I16,
                    AudioFormat::I32 => response::AudioFormat::I32,
                    AudioFormat::I64 => response::AudioFormat::I64,
                    AudioFormat::F32 => response::AudioFormat::F32,
                    AudioFormat::F64 => response::AudioFormat::F64,
                },
                None => response::AudioFormat::None,
            };
            let args = response::AudioFrameArgs {
                buffer,
                format,
                rate: audio.rate,
                channels: audio.channels,
            };
            response::AudioFrame::create(&mut fbb, &args)
        });

        let sensor = self.sensor.as_ref().map(|s| fbb.create_string(s));

        let args = response::ResponseArgs {
            visual,
            audio,
            sensor,
            finished: self.finished,
        };
        let offset = response::Response::create(&mut fbb, &args);
        response::finish_response_buffer(&mut fbb, offset);
        fbb.finished_data().to_vec()
    }
}

#[gen_stub_pymethods]
#[pymethods]
impl Response {
    /// Deserialize a `Response`.
    #[new]
    pub fn deserialize(buffer: Vec<u8>) -> PyResult<Self> {
        match response::root_as_response(&buffer) {
            Ok(response) => Ok(Self {
                visual: response.visual().map(|visual| VisualFrame {
                    buffer: visual.buffer().bytes().to_vec(),
                    width: visual.width(),
                    height: visual.height(),
                }),
                audio: response.audio().map(|audio| AudioFrame {
                    buffer: audio.buffer().bytes().to_vec(),
                    format: match audio.format() {
                        response::AudioFormat::U8 => Some(AudioFormat::U8),
                        response::AudioFormat::I16 => Some(AudioFormat::I16),
                        response::AudioFormat::I32 => Some(AudioFormat::I32),
                        response::AudioFormat::I64 => Some(AudioFormat::I64),
                        response::AudioFormat::F32 => Some(AudioFormat::F32),
                        response::AudioFormat::F64 => Some(AudioFormat::F64),
                        _ => None,
                    },
                    channels: audio.channels(),
                    rate: audio.rate(),
                }),
                sensor: response.sensor().map(|sensor| sensor.to_string()),
                finished: response.finished(),
            }),
            Err(error) => Err(PyTypeError::new_err(error.to_string())),
        }
    }
}
