from pathlib import Path
from PIL import Image
import numpy as np

w = 34
h = 44
f = 0.75
src = Path(__file__).parent.joinpath("pointer")
bs = src.read_bytes()
arr = np.frombuffer(bs, dtype=np.uint8).reshape(h, w, 4)
image = Image.fromarray(arr)
size = (int(w * f), int(h * f))
image = image.resize(size)
Path(__file__).parent.parent.joinpath("pointer").resolve().write_bytes(image.tobytes())
print(size)
