/**
 *   logger.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import * as bunyan from "bunyan";
import { Logger } from "./logger";

describe("Logger unit tests", function(): void {

    it("when logger passed in options this should be used to init the logger.", function(): void {

      let options: any = {};
      options.log = bunyan.createLogger({
              name: "unit-test",
          });

      Logger.init(options);
      expect(Logger.log).toEqual(options.log);
    });
});
