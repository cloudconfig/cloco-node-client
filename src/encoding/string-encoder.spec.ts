/**
 *   string-encoder.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { StringEncoder } from "./string-encoder";
import { Logger } from "../logging/logger";

describe("StringEncoder unit tests", function(): void {



    // initialize the connection.
    beforeEach(function(): void {
        Logger.init({});
    });

    it("Object should be encoded correctly", function(): void {

      let input: any = {
        foo: "bar",
      };

      input.toString = function(): string {
        return "foo-bar";
      };

      let encoder: StringEncoder = new StringEncoder();
      let encoded: string = encoder.encode(input);
      expect(encoded).toEqual(input.toString());
    });

    it("Object should decode successfully.", function(): void {

      let encoder: StringEncoder = new StringEncoder();
      let encoded: string = "foo-bar";
      let decoded: any = encoder.decode(encoded);
      expect(decoded).toEqual(encoded);
    });
});
