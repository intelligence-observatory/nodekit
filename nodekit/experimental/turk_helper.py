import botocore

import nodekit as nk
from typing import Dict , Iterable
import boto3
import pydantic
import os
from pathlib import Path
from nodekit.experimental.s3 import S3Client

# %%
type HitId = str
type AssignmentId = str

# %%

class TurkClient:
    """
    Experimental; this might be moved to PsyHub.
    """
    def __init__(
            self,
            turk_client,
            s3_client: S3Client,
            local_cachedir: os.PathLike | str
    ):
        self.s3_client = s3_client
        self.local_cachedir = Path(local_cachedir)

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
        Automatically ensures a public site for the Graph exists on S3.
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
