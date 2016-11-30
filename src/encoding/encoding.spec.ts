/**
 *   encoding.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { IEncoder } from "./iencoder";
import { Encoding } from "./encoding";
import { JsonEncoder } from "./json-encoder";
import { StringEncoder } from "./string-encoder";
import { Logger } from "../logging/logger";

describe("Encoding unit tests", function(): void {



    // initialize the connection.
    beforeEach(function(): void {
        Logger.init({});
    });

    it("JSON format should return JsonEncoder.", function(): void {

        let encoder: IEncoder = Encoding.getEncoder("JSON");
        expect(encoder instanceof JsonEncoder).toBeTruthy();
    });

    it("Text format should return StringEncoder.", function(): void {

        let encoder: IEncoder = Encoding.getEncoder("Text");
        expect(encoder instanceof StringEncoder).toBeTruthy();
    });
});
