import {expect, test} from '@playwright/test';

import {getSubmissionTarget} from '../src/submission/get-submission-target';

function setSearch(search: string): void {
    Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: {
            location: {
                search,
            },
        },
    });
}

function mturkSearch(turkSubmitTo: string): string {
    const params = new URLSearchParams({
        assignmentId: 'assignment-1',
        hitId: 'hit-1',
        workerId: 'worker-1',
        turkSubmitTo,
    });
    return `?${params.toString()}`;
}

test.describe('MTurk submission target inference', () => {
    test.afterEach(() => {
        Reflect.deleteProperty(globalThis, 'window');
    });

    test('uses the server-compatible NoPlatform discriminator by default', () => {
        setSearch('');

        const target = getSubmissionTarget();

        expect(target.externalPlatformContext).toEqual({
            platform: 'NoPlatform',
        });
    });

    test('infers production MechanicalTurk from turkSubmitTo', () => {
        setSearch(mturkSearch('https://www.mturk.com'));

        const target = getSubmissionTarget();

        expect(target.externalPlatformContext).toEqual({
            platform: 'MechanicalTurk',
            assignment_id: 'assignment-1',
            worker_id: 'worker-1',
            hit_id: 'hit-1',
            turk_submit_to: 'https://www.mturk.com',
        });
    });

    test('infers MechanicalTurkSandbox from turkSubmitTo', () => {
        setSearch(mturkSearch('https://workersandbox.mturk.com'));

        const target = getSubmissionTarget();

        expect(target.externalPlatformContext).toEqual({
            platform: 'MechanicalTurkSandbox',
            assignment_id: 'assignment-1',
            worker_id: 'worker-1',
            hit_id: 'hit-1',
            turk_submit_to: 'https://workersandbox.mturk.com',
        });
    });

    test('keeps MechanicalTurkPreviewMode unchanged', () => {
        setSearch('?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE');

        const target = getSubmissionTarget();

        expect(target.externalPlatformContext).toEqual({
            platform: 'MechanicalTurkPreviewMode',
        });
    });

    test('rejects unknown turkSubmitTo host', () => {
        setSearch(mturkSearch('https://example.com'));

        expect(() => getSubmissionTarget()).toThrow('Unknown turkSubmitTo host');
    });
});
