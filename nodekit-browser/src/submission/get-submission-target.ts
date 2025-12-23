import type {MechanicalTurkContext, MechanicalTurkPreviewModeContext, PlatformContext, ProlificContext, SubmissionTarget} from "./submission-contexts.ts";


export function getSubmissionTarget(): SubmissionTarget {
    let externalPlatformContext: PlatformContext = {platform: "None"}

    // Not running in a browser:
    if (typeof window === "undefined" || !window.location) {
        return {
            nodekitSubmitTo: null,
            externalPlatformContext: externalPlatformContext,
        };
    }

    // Extract nodekitSubmitTo
    const params = new URLSearchParams(window.location.search);
    const nodekitSubmitTo = params.get("nodekitSubmitTo");

    // Infer external platform contexts:
    const mturkContext = inferMturkContext();
    const prolificContext = inferProlificContext();

    // Check that not both are present:
    if (mturkContext && prolificContext) {
        const error = new Error("Multiple platform contexts detected.");
        error.name = "BadPlatformContextError";
        throw error;
    }

    // Throw an error if Prolific is detected, but no nodekitSubmitTo was specified.
    if (prolificContext && !nodekitSubmitTo) {
        const error = new Error("nodekitSubmitTo is required when using Prolific.");
        error.name = "BadPlatformContextError";
        throw error;
    }

    if (mturkContext) {
        externalPlatformContext = mturkContext;
    } else if (prolificContext) {
        externalPlatformContext = prolificContext;
    }

    return {
        nodekitSubmitTo: nodekitSubmitTo,
        externalPlatformContext: externalPlatformContext,
    }
}

function inferMturkContext(): MechanicalTurkContext | MechanicalTurkPreviewModeContext | null {
    const params = new URLSearchParams(window.location.search);

    // MTurk-style query params
    const assignmentId = params.get("assignmentId");
    const hitId = params.get("hitId");
    const workerId = params.get("workerId");
    const turkSubmitTo = params.get("turkSubmitTo");

    const looksLikeMTurk =
        assignmentId !== null ||
        hitId !== null ||
        workerId !== null ||
        turkSubmitTo !== null;

    if (!looksLikeMTurk) {
        return null;
    }

    // Preview mode per MTurk docs: assignmentId is present and equals this sentinel.
    const PREVIEW_SENTINEL = "ASSIGNMENT_ID_NOT_AVAILABLE";
    const previewMode = assignmentId === PREVIEW_SENTINEL;

    if (previewMode){
        return {
            platform: "MechanicalTurkPreviewMode"
        }
    }

    // Not previewing -> require all fields
    if (!turkSubmitTo || !hitId || !assignmentId || !workerId) {
        const error = new Error("Missing required parameters in the query for MTurk platform.");
        error.name = "BadPlatformContextError";
        throw error;
    }

    return {
        platform: "MechanicalTurk",
        assignment_id: assignmentId,
        worker_id: workerId,
        hit_id: hitId,
        turk_submit_to: turkSubmitTo,
    };
}

function inferProlificContext(): ProlificContext | null {
    const params = new URLSearchParams(window.location.search);

    const prolificPid = params.get("PROLIFIC_PID");
    const studyId = params.get("STUDY_ID");
    const sessionId = params.get("SESSION_ID");
    const completionCode = params.get("prolificCompletionCode");

    const looksLikeProlific =
        prolificPid !== null ||
        studyId !== null ||
        sessionId !== null ||
        completionCode !== null;

    if (!looksLikeProlific) {
        return null;
    }

    if (!prolificPid || !studyId || !sessionId || !completionCode) {
        const error = new Error("Missing required parameters in the query for Prolific platform.");
        error.name = "BadPlatformContextError";
        throw error;
    }

    return {
        platform: "Prolific",
        completion_code: completionCode,
        prolific_pid: prolificPid,
        study_id: studyId,
        session_id: sessionId,
    };
}
