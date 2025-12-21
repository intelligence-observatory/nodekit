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
export async function submitTrace(
    trace: Trace,
    submissionTarget: SubmissionTarget,
    ): Promise<void> {

    const {nodekitSubmitTo, externalPlatformContext} = submissionTarget;
    const payload: SubmissionPayload = {
        trace: trace,
        platform_context: externalPlatformContext,
    };

    // Post the SubmissionPayload to nodekitSubmitTo, if not null:
    if (nodekitSubmitTo) {
        const response = await fetch(nodekitSubmitTo, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const bodyText = await response.text();
            const error = new Error(`Submission failed with status ${response.status}`);
            error.name = "SubmissionError";
            (error as { responseStatus?: number }).responseStatus = response.status;
            (error as { responseBody?: string }).responseBody = bodyText;
            throw error;
        }
    }

    // If using Turk, post the SubmissionPayload using submitToTurk.
    if (externalPlatformContext.platform === "MechanicalTurk" && !nodekitSubmitTo) {
        submitToTurk(
            trace,
            externalPlatformContext.assignment_id,
            externalPlatformContext.turk_submit_to,
        );
    }

    // If using Prolific, just redirect using the given completion code.
    if (externalPlatformContext.platform === "Prolific") {
        const completionUrl = new URL("https://app.prolific.com/submissions/complete");
        completionUrl.searchParams.set("cc", externalPlatformContext.completion_code);
        window.location.assign(completionUrl.toString());
    }

}
