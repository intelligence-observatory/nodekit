# Run NodeKit Graphs on Mechanical Turk

This guide describes the process for deploying a Graph to Mechanical Turk (MTurk) and getting Traces from human participants.

## Prerequisites
- An AWS access key ID and secret access key that has Mechanical Turk privileges
- An HTTPS host for static files (e.g., S3 or CloudFront).
- A NodeKit Graph you want to run.

## 1. Build a static site from your Graph
Use the `nk.build_site` op to emit a self-contained folder with HTML, the NodeKit runtime, and all Graph assets. The harness knows how to infer MTurk context and will show a preview splash when MTurk passes `ASSIGNMENT_ID_NOT_AVAILABLE`.

```python
from pathlib import Path
import nodekit as nk

graph = nk.Graph(...)  # your Graph
result = nk.build_site(graph=graph, savedir=Path("my-mturk-site")) # Website will be saved at the ./my-mturk-site folder.

print("Entrypoint:", result.entrypoint)      # graphs/<hash>/index.html
print("Dependencies:", result.dependencies)  # runtime + assets
```

The directory layout matches what the `build_site` op produces:
- `runtime/nodekit.<sha>.js` and `.css`
- `assets/<mime>/<sha>.<ext>` for all images/videos
- `graphs/<graph_hash>/index.html` (entrypoint) and `graph.json`

## 2. Host the site publicly
Sync the entire `site_root` to your host, preserving paths. For S3, a typical command is:

```bash
aws s3 sync build/mturk-site s3://your-bucket/task --delete
```

Ensure public read access (or CloudFront/Origin Access Control) and note the public URL of the `index.html` produced in step 1. That URL is what MTurk will load.

## 3. Create a HIT pointing to the hosted URL

Use your preferred AWS client to create an External Question HIT whose `ExternalURL` is the hosted entrypoint. Example with boto3 (simplified):

```python
import boto3
from xml.sax.saxutils import escape

client = boto3.client("mturk", region_name="us-east-1")
entrypoint_url = "https://your-bucket.s3.amazonaws.com/task/graphs/<hash>/index.html"

question_xml = f"""
<ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">
  <ExternalURL>{escape(entrypoint_url)}</ExternalURL>
  <FrameHeight>800</FrameHeight>
</ExternalQuestion>
""".strip()

resp = client.create_hit(
    Title="My NodeKit task",
    Description="Do a short experiment.",
    Keywords="psychology, experiment",
    Reward="1.00",
    AssignmentDurationInSeconds=900,
    LifetimeInSeconds=86400,
    Question=question_xml,
    MaxAssignments=10,
)
```


## 4. MTurk submission details (what the harness posts)
In the bundled MTurk harness, when the Graph finishes:
- The harness creates a form POST to `mturk/externalSubmit` (from the `turkSubmitTo` query param).
- It includes `assignmentId` and a `trace` field containing the serialized NodeKit trace JSON.
- In preview (`assignmentId == ASSIGNMENT_ID_NOT_AVAILABLE`), the harness shows a “Preview Mode” splash and does not run the task.

## 5. Retrieve Traces from MTurk
Assignments submitted via the external question carry the form data in the `Answer` XML. To extract the trace:

```python
import xml.etree.ElementTree as ET
import boto3
import nodekit as nk

client = boto3.client("mturk")
hit_id = "<your-hit-id>"

assignments = client.list_assignments_for_hit(HITId=hit_id, AssignmentStatuses=["Submitted", "Approved"])["Assignments"]
for asn in assignments:
    answer_xml = asn["Answer"]
    root = ET.fromstring(answer_xml)
    trace_text = None
    for answer in root.iter("{http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2005-10-01/Answers}Answer"):
        qid = answer.find("./{*}QuestionIdentifier").text
        if qid == "trace":
            trace_text = answer.find("./{*}FreeText").text
    if trace_text:
        trace = nk.Trace.model_validate_json(trace_text)
        print("Assignment", asn["AssignmentId"], "Trace length", len(trace.actions))
```
