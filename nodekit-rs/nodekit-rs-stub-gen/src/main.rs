use pyo3_stub_gen::Result;

fn main() -> Result<()> {
    let stub = nodekit_rs_client::nodekit_rs_client::stub_info()?;
    stub.generate()?;
    Ok(())
}
