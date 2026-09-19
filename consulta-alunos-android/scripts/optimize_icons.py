from pathlib import Path

from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = PROJECT_ROOT / "assets" / "images"
TARGETS = {
    "icon.png": 512,
    "android-icon-foreground.png": 512,
    "splash-icon.png": 512,
    "favicon.png": 128,
}


for file_name, max_side in TARGETS.items():
    path = IMAGE_DIR / file_name
    image = Image.open(path).convert("RGBA")
    image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    image.save(path, format="PNG", optimize=True, compress_level=9)
    print(f"Otimizado: {file_name} ({image.width}x{image.height})")
