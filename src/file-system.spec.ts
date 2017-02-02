/**
 *   jwt-decoder.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { FileSystem } from "./file-system";
import { Logger } from "./logging/logger";

describe("FileSystem unit tests", function(): void {

    let home: string;
    let userprofile: string;

    // initialize.
    beforeAll(function(): void {
        Logger.init({});
        home = process.env.HOME;
        userprofile = process.env.USERPROFILE;
    });

    // restore.
    beforeEach(function(): void {
        process.env.HOME = home;
        process.env.USERPROFILE = userprofile;
    });

    // restore.
    afterAll(function(): void {
        process.env.HOME = home;
        process.env.USERPROFILE = userprofile;
    });

    it("Default user profile is returned successfully.", function(): void {
      spyOn(FileSystem, "getPlatform").and.returnValue("linux");
      process.env.HOME = "home";
      process.env.USERPROFILE = "userprofile";

      expect(FileSystem.getUserHome()).toEqual("home");
    });

    it("win32 user profile is returned successfully.", function(): void {
      spyOn(FileSystem, "getPlatform").and.returnValue("win32");
      process.env.HOME = "home";
      process.env.USERPROFILE = "userprofile";

      expect(FileSystem.getUserHome()).toEqual("userprofile");
    });
});
