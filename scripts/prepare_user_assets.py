from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path("/home/ubuntu/upload")
TARGET = ROOT / "assets" / "images"


def save_png(source: Path, target: Path, side: int) -> None:
    image = Image.open(source).convert("RGBA")
    image.thumbnail((side, side), Image.Resampling.LANCZOS)
    image.save(target, "PNG", optimize=True, compress_level=9)


icon_source = SOURCE / "iconedoappandroid.jfif"
for name, side in {
    "icon.png": 512,
    "android-icon-foreground.png": 512,
    "splash-icon.png": 512,
    "favicon.png": 128,
}.items():
    save_png(icon_source, TARGET / name, side)

photo = Image.open(SOURCE / "fototestedealuno.jpeg").convert("RGB")
photo.thumbnail((512, 512), Image.Resampling.LANCZOS)
photo.save(TARGET / "fototestedealuno.jpeg", "JPEG", quality=86, optimize=True)

print("Ícone e foto de teste preparados.")
