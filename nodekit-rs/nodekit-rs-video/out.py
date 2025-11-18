from PIL import Image
from pathlib import Path

bs = Path(__file__).parent.joinpath('out.raw').resolve().read_bytes()
Image.frombytes('RGB', (400, 300), bs).show()