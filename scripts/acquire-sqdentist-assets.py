"""Download original SQ Dentist assets with source, type and hash verification."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import urllib.request
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public/sites/sqdentist"
RESEARCH = ROOT / "docs/research/sqdentist"
ORIGIN = "https://www.sqdentist.com"
LOCAL_SOURCE = Path("D:/source_sq_com/public")
ASSETS = [
    ("logo-gold", "/logo/logo-sqdentist-landscape.png"),
    ("logo-dark", "/logo/logo-sqdentist-black-text.png"),
    ("hero", "/images/hero-poster-desktop.webp"),
    ("consultation", "/images/2026/08/sq-dentist-consultation-room-hero-inset.webp"),
    ("technology", "/images/2026/08/sq-dentist-digital-dental-technology-card.webp"),
    ("team", "/images/2026/08/sq-dentist-clinical-team-hero.webp"),
    ("sterilization", "/images/2026/08/sq-dentist-sterilization-safety-standards-card.webp"),
    ("clinic", "/images/premium-dental-clinic-vietnam.webp"),
    ("city", "/images/sky-hochiminh.webp"),
    ("airplane", "/images/airplane-sq.webp"),
    ("result-kevin", "/images/result_kevin.webp"),
    ("result-joan", "/images/result_joan.webp"),
    ("result-saaed", "/images/result_saaed.webp"),
    ("favicon", "/favicon.png?v=2"),
]

OBSERVATIONS = {
    "logo-gold": "Original transparent gold-gradient landscape logo, suitable for dark backgrounds. No recoloring or filters applied.",
    "logo-dark": "Original transparent square logo with gold flower and dark grey lettering, including substantial transparent margins; not a drop-in landscape header logo. Original bytes retained.",
    "hero": "Isolated implant crown and screw with transparency; not a photographic clinic hero background.",
    "result-kevin": "Single smiling portrait of Kevin; not a before-and-after comparison.",
    "result-joan": "Single smiling portrait of Joan; not a before-and-after comparison.",
    "result-saaed": "Single smiling portrait of Saaed; not a before-and-after comparison.",
}

def acquire(item):
    name, source_path = item
    url = ORIGIN + source_path
    entry = {"semantic": name, "source": url}
    if name in OBSERVATIONS:
        entry["observation"] = OBSERVATIONS[name]
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Referer": ORIGIN + "/"})
        with urllib.request.urlopen(request, timeout=40) as response:
            data = response.read()
            entry["contentType"] = response.headers.get("Content-Type", "")
            entry["finalUrl"] = response.url
        with Image.open(BytesIO(data)) as image:
            image.load()
            extension = {"PNG": ".png", "JPEG": ".jpg", "WEBP": ".webp", "AVIF": ".avif"}[image.format]
            entry.update(width=image.width, height=image.height, format=image.format, mode=image.mode)
            if "A" in image.getbands():
                entry["alphaExtrema"] = image.getchannel("A").getextrema()
        target = DEST / (name + extension)
        target.write_bytes(data)
        local_source = LOCAL_SOURCE / source_path.split("?")[0].lstrip("/")
        digest = sha256(data).hexdigest()
        entry.update(local="/sites/sqdentist/" + target.name, bytes=len(data), sha256=digest, status="ok")
        if local_source.exists():
            entry["localSource"] = str(local_source)
            entry["matchesLocalSource"] = sha256(local_source.read_bytes()).hexdigest() == digest
    except Exception as exc:
        entry.update(status="failed", error=str(exc))
    return entry

if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)
    RESEARCH.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=5) as pool:
        assets = list(pool.map(acquire, ASSETS))
    result = {"origin": ORIGIN, "acquiredAt": datetime.now(timezone.utc).isoformat(), "assets": assets}
    (RESEARCH / "asset-map.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    for asset in assets:
        print(asset["semantic"], asset["status"], asset.get("local", asset.get("error")), asset.get("width"), asset.get("height"), asset.get("matchesLocalSource"))
