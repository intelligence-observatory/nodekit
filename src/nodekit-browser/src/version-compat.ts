import {gt, major, valid} from 'semver';

const PEP440_DEV_RELEASE_PATTERN = /^(\d+)\.(\d+)\.(\d+)\.dev(\d+)(\+[0-9A-Za-z.-]+)?$/;

function toSemverCompatibleVersion(version: string): string {
    const semverVersion = valid(version);
    if (semverVersion !== null) {
        return semverVersion;
    }

    const pep440DevRelease = version.match(PEP440_DEV_RELEASE_PATTERN);
    if (pep440DevRelease !== null) {
        const [, majorVersion, minorVersion, patchVersion, devRelease, localVersion] = pep440DevRelease;
        return `${majorVersion}.${minorVersion}.${patchVersion}-dev.${devRelease}${localVersion ?? ''}`;
    }

    return version;
}

function requireSemverComparableVersion(version: string, label: string): string {
    const comparableVersion = toSemverCompatibleVersion(version);
    if (valid(comparableVersion) === null) {
        throw new Error(`Invalid NodeKit ${label} version: ${version}`);
    }
    return comparableVersion;
}

export function validateCompatibleNodeKitVersion(graphVersion: string, runtimeVersion: string): void {
    const comparableGraphVersion = requireSemverComparableVersion(graphVersion, 'Graph');
    const comparableRuntimeVersion = requireSemverComparableVersion(runtimeVersion, 'runtime');

    if (
        gt(comparableGraphVersion, comparableRuntimeVersion) ||
        major(comparableGraphVersion) !== major(comparableRuntimeVersion)
    ) {
        throw new Error(`Incompatible NodeKit version requested: ${graphVersion}, Runtime version: ${runtimeVersion}`);
    }
}
