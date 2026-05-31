export interface SubmissionTarget<T extends PlatformContext = PlatformContext> {
    nodekitSubmitTo: string | null // an optional side channel where the Trace will be POSTed when Graph is finished
    externalPlatformContext: T // describes the end-of-Graph submission procedure for a third party platform
}

interface BasePlatformContext {
    platform: string
}

export interface MechanicalTurkContext extends BasePlatformContext {
    platform: "MechanicalTurk"
    assignment_id: string;
    worker_id: string; // null if preview mode
    hit_id: string; // null if preview mode
    turk_submit_to: string; // null if preview mode
}
export interface MechanicalTurkPreviewModeContext extends BasePlatformContext {
    platform: "MechanicalTurkPreviewMode"
}

export interface ProlificContext extends BasePlatformContext {
    platform: "Prolific"
    completion_code: string
    prolific_pid: string
    study_id: string
    session_id: string
}

export interface NoPlatformContext extends BasePlatformContext {
    platform: "None"
}


export type PlatformContext =
    | MechanicalTurkContext
    | MechanicalTurkPreviewModeContext
    | ProlificContext
    | NoPlatformContext

