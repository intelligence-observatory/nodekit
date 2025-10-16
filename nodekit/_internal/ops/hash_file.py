from nodekit._internal.types.common import SHA256
import pydantic
from pathlib import Path
from typing import BinaryIO
import hashlib


def hash_file(path: Path) -> SHA256:
    """
    Compute the SHA-256 hash of a file at the given path.
    """
    with path.open("rb") as f:
        return hash_byte_stream(f)


def hash_byte_stream(
        byte_stream: BinaryIO
) -> SHA256:
    """
    Compute the SHA-256 hash of a byte stream.
    """

    # Reset stream to the beginning
    initial_position = byte_stream.tell()
    byte_stream.seek(0)
    h = hashlib.sha256()
    for chunk in iter(lambda: byte_stream.read(1024 * 1024), b""):  # 1 MB chunks
        h.update(chunk)
    byte_stream.seek(initial_position) # Reset stream to the beginning again

    sha256_hexdigest = h.hexdigest()
    type_adapter = pydantic.TypeAdapter(SHA256)
    validated_sha256 = type_adapter.validate_python(sha256_hexdigest)

    return validated_sha256