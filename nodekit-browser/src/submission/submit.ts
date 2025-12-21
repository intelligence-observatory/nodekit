import type {Trace} from "../types/node.ts";
import type {PlatformContext, SubmissionTarget} from "./submission-contexts.ts";

export function submitToTurk(
    trace: Trace,
    assignmentId: string,
    turkSubmitTo: string,
): void {
    // Submission procedure for Mechanical Turk. See:
    // https://docs.aws.amazon.com/AWSMechTurk/latest/AWSMechanicalTurkRequester/mturk-hits-defining-questions-html-javascript.html
    // Note the following undocumented gotcha: the form must have at least one input element other than assignmentId, otherwise
    // Mechanical Turk will not accept the submission. Here, we have the input element `trace`, which satisfies this requirement.

    // Create the form element and point it to the correct endpoint.
    const form = document.createElement("form");
    form.action = new URL("mturk/externalSubmit", turkSubmitTo).href;
    form.method = "post";

    // Attach the assignmentId.
    const inputAssignmentId = document.createElement("input");
    inputAssignmentId.name = "assignmentId";
    inputAssignmentId.value = assignmentId;
    inputAssignmentId.hidden = true;
    form.appendChild(inputAssignmentId);

    // Attach a runId to allow for Experimenters to map HITs to Sessions.
    const inputRunId = document.createElement("input");
    inputRunId.name = "trace";
    inputRunId.value = JSON.stringify(trace);
    inputRunId.hidden = true;
    form.appendChild(inputRunId);

    // Attach the form to the HTML document and trigger submission.
    document.body.appendChild(form);

    // Submit the form.
    form.submit();
}



//
export interface SubmissionPayload {
    trace: Trace
    platform_context: PlatformContext
}

/**
 * Submit the Trace to the given target. This function may cause the page to redirect.
 * @param trace
 * @param submissionTarget
 */
export function submitTrace(
    trace: Trace,
    submissionTarget: SubmissionTarget,
    ): void {

}