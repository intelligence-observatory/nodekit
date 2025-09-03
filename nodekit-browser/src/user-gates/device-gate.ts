import {UAParser} from "ua-parser-js";

export class DeviceGate {
    static isValidDevice(): boolean {
        // Infer the user device:
        const parser = new UAParser();
        const detectedDevice = parser.getDevice();
        // UAParser's IDevice.type is undefined when it cannot confirm several non-desktop devices (see https://docs.uaparser.dev/info/device/type.html)
        return !detectedDevice.type;
    }
}