import {expect, test} from '@playwright/test';

import {validateCompatibleNodeKitVersion} from '../src/version-compat.ts';

test.describe('NodeKit version gate', () => {
    test('accepts matching PEP 440 dev versions', () => {
        expect(() => validateCompatibleNodeKitVersion('0.3.0.dev1', '0.3.0.dev1')).not.toThrow();
    });

    test('accepts older PEP 440 dev versions for a final runtime', () => {
        expect(() => validateCompatibleNodeKitVersion('0.3.0.dev1', '0.3.0')).not.toThrow();
    });

    test('rejects final releases newer than a PEP 440 dev runtime', () => {
        expect(() => validateCompatibleNodeKitVersion('0.3.0', '0.3.0.dev1')).toThrow(
            'Incompatible NodeKit version requested: 0.3.0, Runtime version: 0.3.0.dev1',
        );
    });

    test('rejects newer PEP 440 dev versions', () => {
        expect(() => validateCompatibleNodeKitVersion('0.3.0.dev2', '0.3.0.dev1')).toThrow(
            'Incompatible NodeKit version requested: 0.3.0.dev2, Runtime version: 0.3.0.dev1',
        );
    });

    test('rejects incompatible major versions', () => {
        expect(() => validateCompatibleNodeKitVersion('1.0.0', '0.3.0.dev1')).toThrow(
            'Incompatible NodeKit version requested: 1.0.0, Runtime version: 0.3.0.dev1',
        );
    });

    test('rejects invalid Graph versions', () => {
        expect(() => validateCompatibleNodeKitVersion('not-a-version', '0.3.0.dev1')).toThrow(
            'Invalid NodeKit Graph version: not-a-version',
        );
    });
});
