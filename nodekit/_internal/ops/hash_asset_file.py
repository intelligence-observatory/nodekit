from nodekit._internal.types.common import SHA256, MediaType
import pydantic
from pathlib import Path
import hashlib


def hash_asset_file(path: Path) -> SHA256:
    """
    Compute the SHA-256 hash of a file at the given path.
    """
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):  # 1 MB chunks
            h.update(chunk)

    sha256_hexdigest = h.hexdigest()
    type_adapter = pydantic.TypeAdapter(SHA256)
    validated_sha256 = type_adapter.validate_python(sha256_hexdigest)
    return validated_sha256


def get_extension_from_media_type(media_type: MediaType) -> str:
    """
    Returns the file extension, without the leading dot, for a given media (MIME) type.
    """
    mime_to_extension = {
        "image/png": "png",
        "image/svg+xml": "svg",
        "video/mp4": "mp4",
    }
    if media_type not in mime_to_extension:
        raise ValueError(f"Unsupported media type: {media_type}")
    return mime_to_extension[media_type]
