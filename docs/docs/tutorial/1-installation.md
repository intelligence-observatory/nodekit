NodeKit uses the [uv](https://docs.astral.sh/uv/) Python package and project manager. 

If you already have uv set up for your project, you can just run `uv add nodekit` to install NodeKit. 

Otherwise, follow the instructions below. 

=== "macOS and Linux"

    Install uv (if you don’t have it yet):

    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

    Install NodeKit in your project:

    ```bash
    uv init  # optional: creates pyproject.toml and a virtualenv
    uv add nodekit
    ```

=== "Windows"

    Install uv (if you don't have it yet):

    ```powershell
    irm https://astral.sh/uv/install.ps1 | iex
    ```

    Install NodeKit in your project:

    ```powershell
    uv init  # optional: creates pyproject.toml and a virtualenv
    uv add nodekit

    ```
