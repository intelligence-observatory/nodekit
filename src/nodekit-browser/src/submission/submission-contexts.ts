export interface SubmissionTarget<T extends PlatformContext = PlatformContext> {
    nodekitSubmitTo: string | null // an optional side channel where the Trace will be POSTed when Graph is finished
    externalPlatformContext: T // describes the end-of-Graph submission procedure for a third party platform
}

interface BasePlatformContext {
    platform: string
}

interface BaseMechanicalTurkContext extends BasePlatformContext {
    assignment_id: string;
    worker_id: string;
    hit_id: string;
    turk_submit_to: string;
}

export interface MechanicalTurkContext extends BaseMechanicalTurkContext {
    platform: "MechanicalTurk"
}
export interface MechanicalTurkSandboxContext extends BaseMechanicalTurkContext {
    platform: "MechanicalTurkSandbox"
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
    platform: "NoPlatform"
}


export type PlatformContext =
    | MechanicalTurkContext
    | MechanicalTurkSandboxContext
    | MechanicalTurkPreviewModeContext
    | ProlificContext
    | NoPlatformContext

export type SubmittableMechanicalTurkContext =
    | MechanicalTurkContext
    | MechanicalTurkSandboxContext
