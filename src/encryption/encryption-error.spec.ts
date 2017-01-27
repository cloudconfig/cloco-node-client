/**
 *   encryption-error.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { EncryptionError } from "./encryption-error";

describe("EncryptionError unit tests", function(): void {

    it("EncryptionError should be created successfully.", function(): void {

        let err: EncryptionError = new EncryptionError("unit-test", "AES256");

        expect(err instanceof EncryptionError).toBeTruthy();
        expect(err.toString()).toEqual("EncryptionError: AES256: unit-test");
    });
});
