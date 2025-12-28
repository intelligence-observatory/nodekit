
This tutorial walks through how to install NodeKit on your system. 

NodeKit is a Python library, and is installed using the [uv](https://docs.astral.sh/uv/) Python package and project manager. 

???+ tip "Quick install for uv users"
    If you already know how to use uv and have it on your system, navigate to the directory containing the Python project where you'd like to install NodeKit. Then run: 

    ```bash
    uv add nodekit
    ```
    
    You can then proceed to the next tutorial. 


## Step 1: Install uv 

Follow the [uv installation guide](https://docs.astral.sh/uv/getting-started/installation/), if you don't already use uv on your system. 

You can confirm uv is successfully installed by running the following command in your terminal: 

```bash
uv --version
```

The terminal should print out a version number, like this: 
```text
uv 0.8.12 (36151df0e 2025-08-18)
```


## Step 2: Start a Python project for the tutorial code 

1. Navigate to any directory where you'd like to house a folder containing the NodeKit tutorial code.
2. Run the following command in your terminal: 
```bash 
uv init nodekit-tutorial
```
 You should see a new directory called "nodekit-tutorial" containing a `pyproject.toml` file, a `main.py` file, and a `README.md` file appear. 



??? tip "PyCharm user?"
    If you're a PyCharm user, you can follow the instructions [here](https://www.jetbrains.com/help/pycharm/uv.html) to start a new Python project using uv without touching the terminal. 

## Step 3: Install `nodekit`  
Ensure you are in the directory containing the `pyproject.toml` file (from the previous step, this should be the `nodekit-tutorial` directory). Then, run the following command in the terminal: 

```bash
uv add nodekit
```

You should see the console report that a virtual environment created, and that several Python packages have been installed. 

To verify that everything worked: 

1. Run the following command in your terminal: 
    ```bash
    uv run python
    ```
    An interactive Python console should appear in your terminal. 
2. Type the following command into the Python console: 
    ```python 
    import nodekit as nk
    ```

If the above worked with no error messages popping up, you've successfully installed NodeKit!