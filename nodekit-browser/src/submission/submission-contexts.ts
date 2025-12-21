export interface SubmissionTarget {
    nodekitSubmitTo: string | null // an optional side channel where the Trace will be POSTed when Graph is finished
    externalPlatformContext: PlatformContext // describes the end-of-Graph submission procedure for a third party platform
}

interface BasePlatformContext {
    platform: string
}

export interface MechanicalTurkContext extends BasePlatformContext {
    platform: "MechanicalTurk"
    assignment_id: string;
    worker_id: string;
    hit_id: string;
    turk_submit_to: string;
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
    | ProlificContext
    | NoPlatformContext

