from PIL import Image
from pathlib import Path
import numpy as np

for path in Path(__file__).parent.iterdir():
    if path.is_file() and path.suffix == '.png':
        image = Image.open(path.as_posix())
        arr = np.array(image)
        path.with_suffix('.raw').write_bytes(arr.tobytes())

