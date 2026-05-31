"""Asset routes for nodekit-server."""

import tempfile
from pathlib import Path
from typing import Annotated

import fastapi
import hashlib
import sqlmodel
from fastapi.responses import FileResponse

import nodekit.server.contracts as contracts
from nodekit.values import MediaType, SHA256
from nodekit_server.auth import UserDep
from nodekit_server.deps import AssetStoreDep, SessionDep
from nodekit_server.records import AssetRecord, as_utc


# %% Router
router = fastapi.APIRouter()


# %% Helpers
def _asset_record_to_item(asset_record: AssetRecord) -> contracts.SiteAssetItem:
    return contracts.SiteAssetItem(
        sha256=asset_record.sha256,
        media_type=asset_record.media_type,
        size_bytes=asset_record.size_bytes,
        url=None,
        timestamp_created=as_utc(asset_record.timestamp_created),
    )


def _get_asset_record(
    session: sqlmodel.Session,
    identifier: contracts.AssetIdentifier,
) -> AssetRecord | None:
    statement = sqlmodel.select(AssetRecord)
    statement = statement.where(AssetRecord.sha256 == identifier.sha256)
    statement = statement.where(AssetRecord.media_type == identifier.media_type)
    return session.exec(statement).one_or_none()


def _get_asset_record_by_sha256(
    session: sqlmodel.Session,
    sha256: SHA256,
) -> AssetRecord | None:
    statement = sqlmodel.select(AssetRecord)
    statement = statement.where(sqlmodel.col(AssetRecord.sha256) == sha256)
    statement = statement.order_by(sqlmodel.col(AssetRecord.media_type))
    return session.exec(statement).first()


async def _stage_uploaded_file(
    upload_file: fastapi.UploadFile,
    temp_dir: Path,
) -> tuple[Path, SHA256, int]:
    temp_dir.mkdir(parents=True, exist_ok=True)
    file_descriptor, temp_path_string = tempfile.mkstemp(
        prefix="asset-upload.",
        dir=temp_dir,
    )
    temp_path = Path(temp_path_string)
    hasher = hashlib.sha256()
    size_bytes = 0

    try:
        with open(file_descriptor, "wb", closefd=True) as out_file:
            while chunk := await upload_file.read(1024 * 1024):
                size_bytes += len(chunk)
                hasher.update(chunk)
                out_file.write(chunk)
            out_file.flush()
        return temp_path, hasher.hexdigest(), size_bytes
    except Exception:
        temp_path.unlink(missing_ok=True)
        raise
    finally:
        await upload_file.close()


# %% Check Assets
@router.post("/assets/check")
def check_assets(
    request: contracts.CheckAssetsRequest,
    session: SessionDep,
    user: UserDep,
) -> contracts.CheckAssetsResponse:
    """Return which requested Assets are not known to the server."""

    _ = user
    missing: list[contracts.AssetIdentifier] = []
    seen: set[tuple[str, str]] = set()
    for identifier in request.assets:
        key = (str(identifier.sha256), str(identifier.media_type))
        if key in seen:
            continue
        seen.add(key)
        if _get_asset_record(session=session, identifier=identifier) is None:
            missing.append(identifier)

    return contracts.CheckAssetsResponse(missing=tuple(missing))


# %% Upload Asset
@router.post("/assets")
async def upload_asset(
    file: Annotated[fastapi.UploadFile, fastapi.File(description="Asset file")],
    sha256: Annotated[SHA256, fastapi.Form(description="Claimed SHA-256 hash")],
    media_type: Annotated[MediaType, fastapi.Form(description="Asset MIME type")],
    session: SessionDep,
    user: UserDep,
    asset_store: AssetStoreDep,
) -> contracts.UploadAssetResponse:
    """Upload one Asset, verifying its content hash before storage."""

    _ = user
    temp_path, computed_sha256, size_bytes = await _stage_uploaded_file(
        upload_file=file,
        temp_dir=asset_store.root / ".tmp",
    )
    if computed_sha256 != sha256:
        temp_path.unlink(missing_ok=True)
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Uploaded Asset bytes do not match claimed SHA-256.",
        )

    identifier = contracts.AssetIdentifier(sha256=sha256, media_type=media_type)
    asset_record = _get_asset_record(session=session, identifier=identifier)
    if asset_record is not None:
        if not asset_store.exists(asset_record.storage_key):
            asset_store.put_file(storage_key=asset_record.storage_key, source_path=temp_path)
        else:
            temp_path.unlink(missing_ok=True)
        return contracts.UploadAssetResponse(asset=_asset_record_to_item(asset_record))

    storage_key = asset_store.storage_key_for_sha256(sha256=sha256)
    asset_store.put_file(storage_key=storage_key, source_path=temp_path)
    asset_record = AssetRecord(
        sha256=sha256,
        media_type=media_type,
        size_bytes=size_bytes,
        storage_key=storage_key,
    )
    session.add(asset_record)
    session.commit()
    session.refresh(asset_record)

    return contracts.UploadAssetResponse(asset=_asset_record_to_item(asset_record))


# %% Resolve Asset
@router.get("/assets/{sha256}", include_in_schema=False)
def resolve_asset(
    sha256: SHA256,
    session: SessionDep,
    asset_store: AssetStoreDep,
) -> FileResponse:
    """Resolve participant-facing Asset bytes through the configured storage backend."""

    asset_record = _get_asset_record_by_sha256(session=session, sha256=sha256)
    if asset_record is None or not asset_store.exists(asset_record.storage_key):
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Asset not found.",
        )

    return FileResponse(
        path=asset_store.path_for_key(asset_record.storage_key),
        media_type=asset_record.media_type,
    )
