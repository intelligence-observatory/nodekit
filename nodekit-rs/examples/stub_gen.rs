use pyo3_stub_gen;

fn main() -> pyo3_stub_gen::Result<()> {
    let stub = nodekit_rs::nodekit_rs::stub_info()?;
    stub.generate()?;
    Ok(())
}
