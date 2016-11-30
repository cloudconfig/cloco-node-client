/**
 *   aes-encryptor.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import * as CryptoJS from "crypto-js";
import { AesEncryptor } from "./aes-encryptor";
import { EncryptionError } from "./encryption-error";
import { Logger } from "../logging/logger";

describe("AesEncryptor unit tests", function(): void {



    // initialize the connection.
    beforeEach(function(): void {
        Logger.init({});
    });

    it("object should encrypt successfully.", function(): void {

        let input: any = {
          foo: "bar",
        };

        let key: string = "an-encryption-string";
        let encryptor: AesEncryptor = new AesEncryptor(key);

        let encrypted: string = encryptor.encrypt(JSON.stringify(input));

        let decrypted: any = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);

        expect(decrypted).toEqual(JSON.stringify(input));
    });

    it("object should decrypt successfully.", function(): void {

        let input: any = {
          foo: "bar",
        };

        let key: string = "an-encryption-string";
        let encryptor: AesEncryptor = new AesEncryptor(key);

        let encrypted: string = CryptoJS.AES.encrypt(JSON.stringify(input), key).toString();

        let decrypted: any = encryptor.decrypt(encrypted);
        decrypted = JSON.parse(decrypted);

        expect(decrypted.foo).toEqual("bar");
    });

    it("object encrypted with different key should fail.", function(): void {

        let input: any = {
          foo: "bar",
        };

        let key: string = "an-encryption-string";
        let key2: string = "an-alternative-encryption-string";
        let encryptor: AesEncryptor = new AesEncryptor(key2);

        let encrypted: string = CryptoJS.AES.encrypt(JSON.stringify(input), key).toString();

        try {
            let decrypted: any = encryptor.decrypt(encrypted);
            decrypted = JSON.parse(decrypted);
            fail("Expect JSON.parse to fail.");
        } catch (e) {
          console.log(e);
          expect(e instanceof SyntaxError).toBeTruthy();
        }
    });
});
