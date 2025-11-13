use pyo3_stub_gen;

fn main() -> pyo3_stub_gen::Result<()> {
    let stub = nodekit_rs_models::nodekit_rs_models::stub_info()?;
    stub.generate()?;
    Ok(())
}
