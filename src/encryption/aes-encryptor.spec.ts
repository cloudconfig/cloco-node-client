/**
 *   aes-encryptor.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { AesEncryptor } from "./aes-encryptor";
import { EncryptionError } from "./encryption-error";
import { Logger } from "../logging/logger";

/*
The data in this test has been encrypted using the following command:
echo "Cloco Unit Test: Encrypted Data" | openssl enc -aes256 -a -A -pass pass:Cloco_Unit_Test_Environment_2017 -p
U2FsdGVkX199kFYvw1zd
salt=7D90562FC35CDDF2
key=72BA0031B4A0F868CA180604F543BB64D484A279A80FF1E614FA7FB1811F2AAF
iv =54E081E4C4597D909FFD08116FAD2EF2
8srwLZj1XhR1EKENvSQgsbGo1k5msX6pwCnuCIEc9/wmCwGiHhfrICQk0iFRNRxWgw==
 */
describe("AesEncryptor unit tests", function(): void {

    // initialize the connection.
    beforeEach(function(): void {
        Logger.init({});
    });

    it("object should encrypt successfully.", function(): void {

        let input: any = {
            foo: "bar",
        };

        let passphrase: string = "encryption-string-32-characters-";
        let encryptor: AesEncryptor = new AesEncryptor(passphrase);

        let encrypted: string = encryptor.encrypt(JSON.stringify(input));

        let decrypted: string = encryptor.decrypt(encrypted);
        let result: any = JSON.parse(decrypted);

        expect(encrypted.length).toEqual(44);
        expect(result.foo).toEqual("bar");
    });

    it("object should decrypt successfully.", function(): void {

        let encrypted: string = "U2FsdGVkX199kFYvw1zd8srwLZj1XhR1EKENvSQgsbGo1k5msX6pwCnuCIEc9/wmCwGiHhfrICQk0iFRNRxWgw==";

        let passphrase: string = "Cloco_Unit_Test_Environment_2017";
        let encryptor: AesEncryptor = new AesEncryptor(passphrase);

        let decrypted: string = encryptor.decrypt(encrypted);

        expect(decrypted).toEqual("Cloco Unit Test: Encrypted Data\n"); // note line ending added
    });

    it("object encrypted with different key should fail.", function(): void {

        let badPassphrase: string = "an-alternative-encryption-string";
        let encryptor: AesEncryptor = new AesEncryptor(badPassphrase);

        let encrypted: string = "U2FsdGVkX199kFYvw1zd8srwLZj1XhR1EKENvSQgsbGo1k5msX6pwCnuCIEc9/wmCwGiHhfrICQk0iFRNRxWgw==";

        try {
            let decrypted: any = encryptor.decrypt(encrypted);
            fail("Expect JSON.parse to fail.");
        } catch (e) {
            expect(e instanceof EncryptionError).toBeTruthy();
        }
    });

    it("decrypt with no passphrase should fail", function(): void {

        let encryptor: AesEncryptor = new AesEncryptor("");
        let encrypted: string = "lzf/qL5Vqdt5SJNMhsevsQ==";

        try {
            let decrypted: any = encryptor.decrypt(encrypted);
            fail("Expect exception to be raised due to no key.");
        } catch (e) {
            expect(e instanceof EncryptionError).toBeTruthy();
        }
    });

    it("encrypt with no key should fail", function(): void {

        let input: any = {
            foo: "bar",
        };

        let encryptor: AesEncryptor = new AesEncryptor("");

        try {
            let encrypted: any = encryptor.encrypt(JSON.stringify(input));
            fail("Expect exception to be raised due to no key.");
        } catch (e) {
            expect(e instanceof EncryptionError).toBeTruthy();
        }
    });
});
