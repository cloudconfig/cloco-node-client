/**
 *   settings.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import * as fs from "fs";
import { Settings } from "./settings";
import { IOptions } from "./types/ioptions";
import { Logger } from "./logging/logger";
import { PassthroughEncryptor } from "./encryption/passthrough-encryptor";
import { SettingsError } from "./settings-error";
import { Tokens } from "./types/tokens";

describe("Settings unit tests", function(): void {

  // initialize.
  beforeAll(function(): void {
      Logger.init({});
  });

  it("setDefaults: empty options set everything to default.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      let options: IOptions = {};

      Settings.setDefaults(options);

      expect(options.useEncryption).toEqual(false);
      expect(options.encryptor).toBeTruthy("options.encryptor");
      expect(options.encryptor instanceof PassthroughEncryptor).toBeTruthy("options.encryptor instanceof PassthroughEncryptor");
      expect(options.url).toEqual("file-content");
      expect(options.subscription).toEqual("file-content");
      expect(options.application).toEqual("file-content");
      expect(options.environment).toEqual("file-content");
      expect(options.cacheCheckInterval).toEqual(60000);
      expect(options.tokens).toBeTruthy("options.tokens");
      expect(options.tokens instanceof Tokens).toBeTruthy("options.tokens instanceof Tokens");
  });

  it("setDefaults: default url set blank, defaults to cloco prod value.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      spyOn(Settings, "getDefaultUrl").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};

      Settings.setDefaults(options);

      expect(options.url).toEqual("https://api.cloco.io");
  });

  it("setDefaults: encryptor supplied, marks as supporting encryption.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      let options: IOptions = {};
      options.encryptor = new PassthroughEncryptor();

      Settings.setDefaults(options);

      expect(options.useEncryption).toEqual(true);
  });

  it("setDefaults: default subscription empty, raises error.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      spyOn(Settings, "getDefaultSubscription").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};

      try {
          Settings.setDefaults(options);
          fail("expect failure because of no default subscription.");
      } catch (e) {
          expect(e).toBeTruthy();
          expect(e instanceof SettingsError).toBeTruthy();
          expect(e.setting).toEqual("options.subscription");
      }
  });

  it("setDefaults: default subscription empty, config file not available, raises error.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return false;
      });

      spyOn(Settings, "getDefaultSubscription").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};

      try {
          Settings.setDefaults(options);
          fail("expect failure because of no default subscription.");
      } catch (e) {
          expect(e).toBeTruthy();
          expect(e instanceof SettingsError).toBeTruthy();
          expect(e.setting).toEqual("options.subscription");
      }
  });

  it("setDefaults: default application empty, raises error.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      spyOn(Settings, "getDefaultApplication").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};

      try {
          Settings.setDefaults(options);
          fail("expect failure because of no default application.");
      } catch (e) {
          expect(e).toBeTruthy();
          expect(e instanceof SettingsError).toBeTruthy();
          expect(e.setting).toEqual("options.application");
      }
  });

  it("setDefaults: default environment empty, raises error.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      spyOn(Settings, "getDefaultEnvironment").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};

      try {
          Settings.setDefaults(options);
          fail("expect failure because of no default environment.");
      } catch (e) {
          expect(e).toBeTruthy();
          expect(e instanceof SettingsError).toBeTruthy();
          expect(e.setting).toEqual("options.environment");
      }
  });

  it("setDefaults: stored bearer token empty, raises error.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      spyOn(Settings, "getBearerToken").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};

      try {
          Settings.setDefaults(options);
          fail("expect failure because of no access token.");
      } catch (e) {
          expect(e).toBeTruthy();
          expect(e instanceof SettingsError).toBeTruthy();
          expect(e.setting).toEqual("options.tokens.accessToken");
      }
  });

  it("setDefaults: stored refresh token empty, raises error.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      spyOn(Settings, "getRefreshToken").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};

      try {
          Settings.setDefaults(options);
          fail("expect failure because of no refresh token.");
      } catch (e) {
          expect(e).toBeTruthy();
          expect(e instanceof SettingsError).toBeTruthy();
          expect(e.setting).toEqual("options.tokens.refreshToken");
      }
  });

  it("setDefaults: tokens supplied, no error initializing tokens.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      spyOn(Settings, "getRefreshToken").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};
      options.tokens = { accessToken: "token", refreshToken: "refresh" };
      Settings.setDefaults(options);
      expect(options.credentials).toBeFalsy();
  });

  it("setDefaults: credentials supplied, no error initializing tokens.", function(): void {

      let spy: jasmine.Spy = spyOn(fs, "readFileSync").and.callFake((path: string) => {
        return "file-content";
      });

      spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      spyOn(fs, "existsSync").and.callFake((path: string) => {
        return true;
      });

      spyOn(Settings, "getRefreshToken").and.callFake((path: string) => {
        return "";
      });

      let options: IOptions = {};
      options.credentials = { key: "key", secret: "secret" };
      Settings.setDefaults(options);
      expect(options.credentials).toBeTruthy();
      expect(options.tokens).toBeTruthy();
      expect(options.tokens.refreshToken).toBeFalsy();
  });

  it("storeBearerToken: credentials supplied, no error initializing tokens.", function(): void {

      let mkdirSpy: jasmine.Spy = spyOn(fs, "mkdir").and.callFake((path: string) => {
        return;
      });

      let existsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.returnValue(true);

      let writeSpy: jasmine.Spy = spyOn(fs, "writeFile")
        .and.callFake((f: string, data: string, enc: string, callback: (err: Error) => void): any => {
          callback(undefined);
      });

      Settings.storeBearerToken("token");

      expect(mkdirSpy).toHaveBeenCalledTimes(0);
      expect(existsSpy).toHaveBeenCalledTimes(0);
      expect(writeSpy).toHaveBeenCalledTimes(1);
  });
});
