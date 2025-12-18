from PIL import Image
import numpy as np

for filename in ['gutter_sw', 'gutter_se']:
    image = Image.open(f'{filename}.png')
    arr = np.array(image)
    with open(f'{filename}.raw', 'wb') as f:
        f.write(arr.tobytes())
