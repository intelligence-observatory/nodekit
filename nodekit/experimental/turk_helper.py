import botocore

import nodekit as nk
from typing import Dict , Iterable
import boto3
import pydantic

# %%
type HitId = str
type AssignmentId = str

# %%

class TurkClient:
    """
    Experimental; this might be moved to PsyHub.

    Before you use:
    - Ensure you created the S3 bucket, and your s3_client has write access to it, and can set public ACLs on objects in the bucket.
    - Ensure your turk_client has enough money
    """
    def __init__(
            self,
            turk_client,
            s3_client,
            s3_bucket_name: str,
            local_cachedir: str | None = None
    ):
        ...

    def list_hits(self) -> Iterable[HitId]:
        """
        Lists all HITs in the cache.
        """
        ...

    def create_hit(
            self,
            graph: nk.Graph,
            num_assignments: int,
            base_payment_usd: str,
            title: str,
    ) -> HitId:
        """
        Creates a HIT based on the given Graph.
        Automatically syncs any referenced Assets in the Graph with S3.
        Caches the HIT (and its Graph) in the local cache.
        """
        ...

    def list_assignments(
            self,
            hit_id: HitId,
    ) -> Iterable[AssignmentId]:
        """
        Lists assignments associated with the given HIT ID.
        Automatically approves any newly un-approved assignments, and saves
        them in the local cache.

        """
        ...

    def pay_bonus(
            self,
            assignment_id: AssignmentId,
            amount_usd: str,
    ) -> None:
        ...


    def get_graph(
            self,
            hit_id: HitId,
    ) -> nk.Graph:
        """
        Loads the Graph associated with the given HIT ID.
        """
        ...

    def get_trace(
            self,
            assignment_id: AssignmentId,
    ) -> nk.Trace:
        ...
