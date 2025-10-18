import os
import uuid
from decimal import Decimal
from pathlib import Path
from typing import Iterable

import nodekit as nk
from nodekit.experimental.recruitment_services.base import RecruiterServiceClient, CreateHitRequest
from nodekit.experimental.s3 import S3Client

# %%
type HitId = str
type AssignmentId = str

# %%

class Helper:
    """
    Experimental; this might be moved to PsyHub / PsychoScope.
    """
    def __init__(
            self,
            recruiter_service_client:RecruiterServiceClient,
            s3_client: S3Client,
            local_cachedir: os.PathLike | str
    ):
        self.recruiter_service_client = recruiter_service_client
        self.s3_client = s3_client
        self.local_cachedir = Path(local_cachedir)

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
            duration_sec: int,
            unique_request_token: str = None,
    ) -> HitId:
        """
        Creates a HIT based on the given Graph.
        Automatically ensures a public site for the Graph exists on S3.
        Caches the HIT (and its Graph) in the local cache.
        """

        graph_site_url = self.upload_graph_site(graph=graph)
        if unique_request_token is None:
            unique_request_token = uuid.uuid4().hex

        response = self.recruiter_service_client.create_hit(
            request=CreateHitRequest(
                entrypoint_url=graph_site_url,
                title=title,
                description=title,
                keywords=['psychology', 'task', 'cognitive', 'science', 'game'],
                num_assignments=num_assignments,
                duration_sec=duration_sec,
                completion_reward_usd=Decimal(base_payment_usd),
                unique_request_token=unique_request_token,
                allowed_participant_ids=[],
            )
        )
        hit_id: HitId =  response.hit_id
        print(hit_id)
        return hit_id

    def upload_graph_site(self, graph: nk.Graph) -> str:
        """
        Returns a URL to a public Graph site.
        """

        # Build the Graph site
        build_site_result = nk.build_site(graph=graph, savedir=self.local_cachedir)

        # Ensure index is sync'd
        index_path = build_site_result.site_root / build_site_result.entrypoint
        index_url = self.s3_client.sync_file(
            local_path=index_path,
            local_root=build_site_result.site_root,
            bucket_root='',
            force=False
        )

        # Ensure deps are sync'd
        for dep in build_site_result.dependencies:
            self.s3_client.sync_file(
                local_path=build_site_result.site_root / dep,
                local_root=build_site_result.site_root,
                bucket_root='',
                force=False
            )

        return index_url

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
