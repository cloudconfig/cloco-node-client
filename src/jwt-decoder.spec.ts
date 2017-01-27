/**
 *   jwt-decoder.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { JwtDecoder } from "./jwt-decoder";
import { JwtGenerator } from "./test/jwt-generator";
import { Logger } from "./logging/logger";

describe("JwtDecoder unit tests", function(): void {

    // initialize.
    beforeAll(function(): void {
        Logger.init({});
    });

    it("valid jwt decodes successfully and is not expired.", function(done: () => void): void {

        let generator: JwtGenerator = new JwtGenerator();
        generator.generateJwt("A1234", "some-user")
          .then((jwt: string) => {
            let decoder: JwtDecoder = new JwtDecoder(jwt);
            expect(decoder.isValid).toBeTruthy();
            expect(decoder.expiryDate).toBeTruthy();
            expect(decoder.isExpired).toBeFalsy();
            expect(decoder.claims.sub).toEqual("A1234");
            expect(decoder.claims.username).toEqual("some-user");
            done();
          })
          .catch((e: Error) => {
            console.log(e);
            fail("no error expected.");
            done();
          });
    });

    it("empty jwt fails to decode.", function(done: () => void): void {

        let jwt: string = "";
        let decoder: JwtDecoder = new JwtDecoder(jwt);
        expect(decoder.isValid).toBeFalsy();
        expect(decoder.expiryDate).toBeFalsy();
        expect(decoder.isExpired).toBeFalsy();
        expect(decoder.claims).toBeFalsy();
        done();
    });

    it("jwt with one part fails to decode.", function(done: () => void): void {

        let jwt: string = "part1";
        let decoder: JwtDecoder = new JwtDecoder(jwt);
        expect(decoder.isValid).toBeFalsy();
        expect(decoder.expiryDate).toBeFalsy();
        expect(decoder.isExpired).toBeFalsy();
        expect(decoder.claims).toBeFalsy();
        done();
    });

    it("jwt with two parts fails to decode.", function(done: () => void): void {

        let jwt: string = "part1.part2";
        let decoder: JwtDecoder = new JwtDecoder(jwt);
        expect(decoder.isValid).toBeFalsy();
        expect(decoder.expiryDate).toBeFalsy();
        expect(decoder.isExpired).toBeFalsy();
        expect(decoder.claims).toBeFalsy();
        done();
    });

    it("invalid jwt with three parts fails to decode.", function(done: () => void): void {

        let jwt: string = "part1.part2.part3";
        let decoder: JwtDecoder = new JwtDecoder(jwt);
        expect(decoder.isValid).toBeFalsy();
        expect(decoder.expiryDate).toBeFalsy();
        expect(decoder.isExpired).toBeFalsy();
        expect(decoder.claims).toBeFalsy();
        done();
    });

    it("bearerTokenExpired: valid jwt not expired.", function(done: () => void): void {

        let generator: JwtGenerator = new JwtGenerator();
        generator.generateJwt("A1234", "some-user")
          .then((jwt: string) => {
            let expired: boolean = JwtDecoder.bearerTokenExpired(jwt);
            expect(expired).toBeFalsy();
            done();
          })
          .catch((e: Error) => {
            console.log(e);
            fail("no error expected.");
            done();
          });
    });

    it("bearerTokenExpired: invalid jwt throws exception.", function(): void {

        try {
          let jwt: string = "invalid.jwt";
          let expired: boolean = JwtDecoder.bearerTokenExpired(jwt);
          fail("Expect an error to have been thrown.");
        } catch (e) {
          expect(e.message).toEqual("Bearer token invalid.");
        }
    });
});
