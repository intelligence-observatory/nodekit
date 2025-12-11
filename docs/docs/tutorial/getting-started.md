## Install NodeKit

NodeKit uses the [uv](https://docs.astral.sh/uv/) Python package and project manager. 

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

## Write your first task

## Play your task locally

## Deploy to humans

## Deploy to models
