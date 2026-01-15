from PIL import Image
from pathlib import Path

d = Path(__file__).parent
path = d.joinpath('test_image.png').resolve().as_posix()
d.joinpath('rgba.raw').write_bytes(Image.open(path).tobytes())
img = Image.open(path)
img.load()
dst = Image.new('RGB', (300, 600))
dst.paste(img, mask=img.split()[3])
d.joinpath('rgb.raw').write_bytes(dst.tobytes())
