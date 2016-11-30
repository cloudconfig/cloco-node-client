/**
 *   json-encoder.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { JsonEncoder } from "./json-encoder";
import { Logger } from "../logging/logger";

describe("JsonEncoder unit tests", function(): void {



    // initialize the connection.
    beforeEach(function(): void {
        Logger.init({});
    });

    it("Object should be encoded correctly", function(): void {

      let input: any = {
        foo: "bar",
      };

      let encoder: JsonEncoder = new JsonEncoder();
      let encoded: string = encoder.encode(input);
      expect(encoded).toEqual(JSON.stringify(input));
    });

    it("Object should decode successfully.", function(): void {

      let input: any = {
        foo: "bar",
      };

      let encoder: JsonEncoder = new JsonEncoder();
      let encoded: string = JSON.stringify(input);
      let decoded: any = encoder.decode(encoded);
      expect(decoded.foo).toEqual(input.foo);
    });
});
