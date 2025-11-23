import {UAParser} from "ua-parser-js";

export function userDeviceIsValid(): boolean {
    // Infer the user device:
    const parser = new UAParser();
    const detectedDevice = parser.getDevice();
    // UAParser's IDevice.type is undefined when it cannot confirm several non-desktop devices (see https://docs.uaparser.dev/info/device/type.html)
    return !detectedDevice.type;
}