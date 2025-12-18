from PIL import Image
import numpy as np

for filename in ['gutter_sw', 'gutter_se', 'text_box_nw', 'text_box_ne']:
    image = Image.open(f'{filename}.png')
    arr = np.array(image)
    with open(f'{filename}.raw', 'wb') as f:
        f.write(arr.tobytes())

text_box_line = 'text_box_line'
image = Image.open(f'{text_box_line}.png')
arr = np.array(image)
with open(f'{text_box_line}.raw', 'wb') as f:
    f.write(np.rot90(arr)[0][:, :-1].reshape(-1).tobytes())
