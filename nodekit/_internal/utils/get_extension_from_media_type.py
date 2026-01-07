from nodekit._internal.types.values import MediaType


def get_extension_from_media_type(media_type: MediaType) -> str:
    """
    Returns the file extension, without the leading dot, for a given media (MIME) type.
    """
    mime_to_extension = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/svg+xml": "svg",
        "video/mp4": "mp4",
    }
    if media_type not in mime_to_extension:
        raise ValueError(f"Unsupported media type: {media_type}")
    return mime_to_extension[media_type]
