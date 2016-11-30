/**
 *   passthrough-encryptor.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { PassthroughEncryptor } from "./passthrough-encryptor";
import { EncryptionError } from "./encryption-error";
import { Logger } from "../logging/logger";

describe("PassthroughEncryptor unit tests", function(): void {

    // initialize the connection.
    beforeEach(function(): void {
        Logger.init({});
    });

    it("object should encrypt successfully.", function(): void {

        let input: any = {
          foo: "bar",
        };

        let encryptor: PassthroughEncryptor = new PassthroughEncryptor();
        let encrypted: any = encryptor.encrypt(input);

        expect(encrypted.foo).toEqual(input.foo);
    });

    it("object should decrypt successfully.", function(): void {

        let input: any = {
          foo: "bar",
        };

        let encryptor: PassthroughEncryptor = new PassthroughEncryptor();

        let encrypted: string = JSON.stringify(input);
        encrypted = new Buffer(encrypted).toString("base64");

        let decrypted: any = encryptor.decrypt(encrypted);
        decrypted = JSON.parse(decrypted);

        expect(decrypted.foo).toEqual("bar");
    });

    it("object passed through should be returned.", function(): void {

        let encrypted: any = {
          foo: "bar",
        };

        let encryptor: PassthroughEncryptor = new PassthroughEncryptor();
        let decrypted: any = encryptor.decrypt(encrypted);
        expect(decrypted.foo).toEqual("bar");
    });
});
