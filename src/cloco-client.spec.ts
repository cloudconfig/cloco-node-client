/**
 *   cloco-client.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   unit tests for the cloco client.
 */
import * as bunyan from "bunyan";
import * as fs from "fs";
import { JwtGenerator } from "./test/jwt-generator";
import { AesEncryptor } from "./encryption/aes-encryptor";
import { ApiClientMock } from "./test/api-client-mock";
import { ApiClient } from "./api-client";
import { Cache } from "./cache/cache";
import { CacheItem } from "./cache/cache-item";
import { ClocoClient } from "./cloco-client";
import { ClocoApp, ConfigObjectWrapper } from "./types/clocoapp";
import { IOptions } from "./types/ioptions";
import { Logger } from "./logging/logger";
import { Settings } from "./settings";

describe("ClocoClient unit tests", function(): void {

  let options: IOptions;
  let configSpy: jasmine.Spy;
  let app: ClocoApp;
  let cob: ConfigObjectWrapper;
  let aes: AesEncryptor;
  let getCobHitIndex: number;

  beforeAll(function(done: () => void): void {
    Logger.init({});
    configSpy = spyOn(Settings, "readFileContent").and.callFake((path: string) => {
      return "file-content";
    });
    done();
  });

  beforeEach(function(done: () => void): void {

    Cache.init();

    getCobHitIndex = 0;

    options = {};
    options.tokens = { accessToken: "", refreshToken: "refresh-token" };
    options.url = "https://test.api.cloco.io";
    options.subscription = "subscription";
    options.application = "application";
    options.environment = "test";
    options.cacheCheckInterval = -1;

    app = {
      applicationIdentifier: "test-app",
      configObjects: [
        {
          description: "a sample configuration object",
          encrypted: false,
          format: "JSON",
          objectIdentifier: "test-cob",
          objectName: "Test Configuration Object",
        },
      ],
      coreDetails: {
        applicationName: "Test Application",
        description: "A test application for unit testing.",
        isDefault: false,
      },
      created: new Date(),
      createdBy: "unit-test",
      displayIndex: 1,
      environments: [
        {
          description: "the test environment",
          environmentIdentifier: "test",
          environmentName: "Test",
          isDefault: true,
        },
      ],
      lastUpdated: new Date(),
      lastUpdatedBy: "unit-test",
      revisionNumber: 2,
      subscriptionIdentifier: "test-subscription",
    };

    cob = {
      applicationIdentifier: "test-app",
      configurationData: {
        foo: "bar",
      },
      contentLength: 100,
      created: new Date(),
      createdBy: "unit-test",
      environmentIdentifier: "test",
      lastUpdated: new Date(),
      lastUpdatedBy: "unit-test",
      objectIdentifier: "test-cob",
      revisionNumber: 2,
      subscriptionIdentifier: "test-subscription",
      versionNote: "created by unit test",
    };

    aes = new AesEncryptor("cloco-unit-test-encryption-key");

    let generator: JwtGenerator = new JwtGenerator();
    generator.generateJwt("A1234", "some-user")
      .then((jwt: string) => {
        options.tokens.accessToken = jwt;
        done();
      });
  });

  it("constructor: construct the client from the options.", function(): void {
      let client: ClocoClient = new ClocoClient(options);
      expect(client.onCacheExpired).toBeTruthy();
  });

  it("constructor: error raised in setting defaults.", function(): void {

      options.environment = "";

      let envSpy: jasmine.Spy = spyOn(Settings, "getDefaultEnvironment").and.callFake((): void => {
        throw new Error("unit-test-error");
      });

      let client: ClocoClient;

      try {
        client = new ClocoClient(options);
        fail("expect error to have been thrown.");
      } catch (e) {
        expect(e.message).toEqual("unit-test-error");
        expect(envSpy).toHaveBeenCalledTimes(1);
      }
  });

  it("init: successful happy path initialization, loads application and config object.", function(done: () => void): void {
      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
      .then(() => {
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(1);
        expect(Cache.current.items[0].value).toEqual(cob.configurationData);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(1);
        done();
      })
      .catch((e: Error) => {
        console.log(e);
        fail("error not expected");
        done();
      });
  });

  it("init: successful initialization, loads application and config object, cache on disk.", function(done: () => void): void {

      options.useDiskCaching = true;
      let filenames: string[] = [];

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let writeFileSpy: jasmine.Spy = spyOn(fs, "writeFile")
        .and.callFake((f: string, data: string, enc: string, callback: (err: Error) => void): any => {
          filenames.push(f);
          callback(undefined);
      });

      client.init()
      .then(() => {
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(1);
        expect(Cache.current.items[0].value).toEqual(cob.configurationData);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(1);
        expect(filenames.length).toEqual(2);
        expect(filenames[0]).toEqual(`${process.env.HOME}/.cloco/cache/application_application`);
        done();
      })
      .catch((e: Error) => {
        console.log(e);
        fail("error not expected");
        done();
      });
  });

  it("init: successful initialization, loads application and config object, fail to cache on disk.", function(done: () => void): void {

      options.useDiskCaching = true;
      let filenames: string[] = [];

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let writeFileSpy: jasmine.Spy = spyOn(fs, "writeFile")
        .and.callFake((f: string, data: string, enc: string, callback: (err: Error) => void): any => {
          filenames.push(f);
          callback(new Error("disk-error"));
      });
      let fileExistsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.returnValue(false);

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("disk-error");
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        expect(writeFileSpy).toHaveBeenCalledTimes(1);
        expect(fileExistsSpy).toHaveBeenCalledTimes(0);
        expect(filenames.length).toEqual(1);
        expect(filenames[0]).toEqual(`${process.env.HOME}/.cloco/cache/application_application`);
        done();
      });
  });

  it("init: failure to load application, error.", function(done: () => void): void {
      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication")
        .and.returnValue(ApiClientMock.getApplication(app, new Error("app-error")));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("app-error");
        expect(client.app).toEqual(undefined);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it("init: failure to load application, load from disk, success.", function(done: () => void): void {

      options.useDiskCaching = true;
      let filenames: string[] = [];

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication")
        .and.returnValue(ApiClientMock.getApplication(app, new Error("app-error")));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let fileExistsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.returnValue(true);
      let readFileSpy: jasmine.Spy = spyOn(fs, "readFile")
        .and.callFake((f: string, enc: string, callback: (err: Error, data: string) => void): void => {
          callback(undefined, JSON.stringify(app));
      });
      let writeFileSpy: jasmine.Spy = spyOn(fs, "writeFile")
        .and.callFake((f: string, data: string, enc: string, callback: (err: Error) => void): any => {
          filenames.push(f);
          callback(undefined);
      });

      client.init()
      .then(() => {
        expect(client.app.applicationIdentifier).toEqual(app.applicationIdentifier);
        expect(Cache.current.items.length).toEqual(1);
        expect(Cache.current.items[0].value).toEqual(cob.configurationData);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(1);
        expect(fileExistsSpy).toHaveBeenCalledTimes(1);
        expect(readFileSpy).toHaveBeenCalledTimes(1);
        expect(filenames.length).toEqual(1);
        done();
      })
      .catch((e: Error) => {
        console.log(e);
        fail("error not expected");
        done();
      });
  });

  it("init: failure to load application, load from disk, file not found, fail.", function(done: () => void): void {

      options.useDiskCaching = true;

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication")
        .and.returnValue(ApiClientMock.getApplication(app, new Error("app-error")));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let fileExistsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.returnValue(false);
      let readFileSpy: jasmine.Spy = spyOn(fs, "readFile")
        .and.callFake((f: string, enc: string, callback: (err: Error, data: string) => void): void => {
          callback(undefined, JSON.stringify(app));
      });

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("app-error");
        expect(client.app).toEqual(undefined);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        expect(fileExistsSpy).toHaveBeenCalledTimes(1);
        expect(readFileSpy).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it("init: failure to load application, load from disk, invalid JSON, fail.", function(done: () => void): void {

      options.useDiskCaching = true;

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication")
        .and.returnValue(ApiClientMock.getApplication(app, new Error("app-error")));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let fileExistsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.returnValue(true);
      let readFileSpy: jasmine.Spy = spyOn(fs, "readFile")
        .and.callFake((f: string, enc: string, callback: (err: Error, data: string) => void): void => {
          callback(undefined, "{invalid-JSON]");
      });

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("Unexpected token i in JSON at position 1");
        expect(client.app).toEqual(undefined);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        expect(fileExistsSpy).toHaveBeenCalledTimes(1);
        expect(readFileSpy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it("init: failure to load application, load from disk, disk read fails, fail.", function(done: () => void): void {

      options.useDiskCaching = true;

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication")
        .and.returnValue(ApiClientMock.getApplication(app, new Error("app-error")));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let fileExistsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.returnValue(true);
      let readFileSpy: jasmine.Spy = spyOn(fs, "readFile")
        .and.callFake((f: string, enc: string, callback: (err: Error, data: string) => void): void => {
          callback(new Error("cat-error"), undefined);
      });

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("cat-error");
        expect(client.app).toEqual(undefined);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        expect(fileExistsSpy).toHaveBeenCalledTimes(1);
        expect(readFileSpy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it("init: failure to load configuration, error.", function(done: () => void): void {
      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject")
        .and.returnValue(ApiClientMock.getConfigObject(cob, new Error("cob-error")));

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("cob-error");
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it("init: environment not found in application, error.", function(done: () => void): void {

      options.environment = "unknown";

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("The environment 'unknown' does not exist in application.");
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it("init: no application returned by api, error.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(undefined));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("The environment 'test' does not exist in application.");
        expect(client.app).toEqual(undefined);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it("init: no environments in application returned by api, error.", function(done: () => void): void {

      app.environments = undefined;

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("The environment 'test' does not exist in application.");
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it("init: empty environments array in application returned by api, error.", function(done: () => void): void {

      app.environments = [];

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("The environment 'test' does not exist in application.");
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it("init: empty environments option, error.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      options.environment = "";

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("The environment '' does not exist in application.");
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it("init: failure to load config, use disk cache, success.", function(done: () => void): void {

      options.useDiskCaching = true;
      let filenames: string[] = [];

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject")
        .and.returnValue(ApiClientMock.getConfigObject(cob, new Error("cob-error")));
      let fileExistsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.returnValue(true);
      let readFileSpy: jasmine.Spy = spyOn(fs, "readFile")
        .and.callFake((f: string, enc: string, callback: (err: Error, data: string) => void): void => {
          callback(undefined, JSON.stringify(cob));
      });
      let writeFileSpy: jasmine.Spy = spyOn(fs, "writeFile")
        .and.callFake((f: string, data: string, enc: string, callback: (err: Error) => void): any => {
          filenames.push(f);
          callback(undefined);
      });

      client.init()
      .then(() => {
        expect(client.app.applicationIdentifier).toEqual(app.applicationIdentifier);
        expect(Cache.current.items.length).toEqual(1);
        expect(Cache.current.items[0].value).toEqual(cob.configurationData);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(1);
        expect(fileExistsSpy).toHaveBeenCalledTimes(1);
        expect(readFileSpy).toHaveBeenCalledTimes(1);
        expect(writeFileSpy).toHaveBeenCalledTimes(1);
        expect(filenames.length).toEqual(1);
        done();
      })
      .catch((e: Error) => {
        console.log(e);
        fail("error not expected");
        done();
      });
  });

  it("init: failure to decrypt config, fail.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });
      spyOn(client, "decryptAndDecode").and.callFake((): void => {
        throw new Error("decrypt-error");
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
      .then(() => {
        fail("expect error to have been thrown.");
        done();
      })
      .catch((e: Error) => {
        expect(e.message).toEqual("decrypt-error");
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it("init: load config, no item added to cache, success.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);
      spyOn(client, "checkCacheTimeouts").and.callFake((): void => {
        return;
      });

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let addItemSpy: jasmine.Spy = spyOn(Cache.current, "addItem").and.returnValue(undefined);

      client.init()
      .then(() => {
        expect(client.app).toEqual(app);
        expect(Cache.current.items.length).toEqual(0);
        expect(getAppSpy).toHaveBeenCalledTimes(1);
        expect(getCobSpy).toHaveBeenCalledTimes(1);
        expect(addItemSpy).toHaveBeenCalledTimes(1);
        done();
      })
      .catch((e: Error) => {
        fail("expect error to have been thrown.");
        done();
      });
  });

  it("checkCacheTimeouts: cache item expired, reloads the config.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // the client is initialized now, so set an expiry on the cache item
          let item: CacheItem = Cache.current.items[0];
          item.expires = new Date();
          item.expires.setDate(item.expires.getDate() - 1); // set to be expired

          client.checkCacheTimeouts();
          expect(getCobSpy).toHaveBeenCalledTimes(2);
          done();
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  it("checkCacheTimeouts: cache item not expired, reload config, no update.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let dispatchSpy: jasmine.Spy = spyOn(client.onConfigurationLoaded, "dispatch").and.callThrough();

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // the client is initialized now, so set an expiry on the cache item
          let item: CacheItem = Cache.current.items[0];
          item.expires = new Date();
          item.expires.setDate(item.expires.getDate() - 1); // set to be expired

          spyOn(Cache.current, "addItem").and.returnValue(undefined); // no item added to cache

          client.checkCacheTimeouts();
          expect(getCobSpy).toHaveBeenCalledTimes(2); // shows that the config loaded twice.
          expect(dispatchSpy).toHaveBeenCalledTimes(1); // shows that the config published once.
          done();
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  it("checkCacheTimeouts: cache item not expired, no reload of config.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // the client is initialized now, so set an expiry on the cache item
          let item: CacheItem = Cache.current.items[0];
          item.expires = new Date();
          item.expires.setDate(item.expires.getDate() + 1); // set to be expired

          client.checkCacheTimeouts();
          expect(getCobSpy).toHaveBeenCalledTimes(1); // shows that the config is not reloaded.
          done();
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  /*it("checkCacheTimeouts: cache item expired, reloads config, error.", function(done: () => void): void {

      Logger.log = bunyan.createLogger({
            level: "debug",
            name: "cloco-node-client",
        });

      let client: ClocoClient = new ClocoClient(options);
      let emittedError: Error;
      client.onError.subscribe((sender: ClocoClient, e: Error): void => {
          console.log(e);
          emittedError = e;
      });

      let func: any = (sender: ClocoClient, value: CacheItem): void => {
        console.log(value);
        console.log(`Hit index: ${getCobHitIndex}`);
        if (getCobHitIndex === 2) {
          throw new Error("subsequent-error");
        }
      };

      // set up a subscription to throw an error next time config is loaded
      client.onConfigurationLoaded.subscribe(func);
      console.log(client.onConfigurationLoaded.subscriptions);

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // the client is initialized now, so set an expiry on the cache item
          let item: CacheItem = Cache.current.items[0];
          item.expires = new Date();
          item.expires.setDate(item.expires.getDate() - 1); // set to be expired
          item.revision--;

          getCobHitIndex = 2;

          client.checkCacheTimeouts();
          expect(getCobSpy).toHaveBeenCalledTimes(2); // shows that the config is reloaded.
          expect(emittedError).toBeTruthy();
          expect(emittedError.message).toEqual("subsequent-error");
          done();
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });*/

  it("get: get item from cache, item exists.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // retrieve the cache item by the key (objectIdentifier).
          let data: any = client.get<any>("test-cob");
          expect(data).toEqual(cob.configurationData);
          done();
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  it("get: get item from cache, item does not exist.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // retrieve the cache item by the key (objectIdentifier).
          let data: any = client.get<any>("unknown-cob");
          expect(data).toEqual(undefined);
          done();
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  it("get: get encypted item from cache, item exists, decrypts successfully.", function(done: () => void): void {

      options.encryptor = aes;
      let originalData: any = cob.configurationData;
      cob.configurationData = aes.encrypt(JSON.stringify(originalData)); // encrypt the data packet.
      let client: ClocoClient = new ClocoClient(options);

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // retrieve the cache item by the key (objectIdentifier).
          let data: any = client.get<any>("test-cob");
          expect(data).toEqual(originalData);
          done();
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  it("put: update item in cache, success.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);

      let updatedCob: ConfigObjectWrapper = JSON.parse(JSON.stringify(cob));
      updatedCob.configurationData.foo = "baa";
      updatedCob.revisionNumber++;

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let putCobSpy: jasmine.Spy = spyOn(ApiClient, "putConfigObject").and.returnValue(ApiClientMock.putConfigObject(updatedCob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // update the item.
          client.put<any>("test-cob", updatedCob.configurationData)
          .then(() => {
            expect(Cache.current.items.length).toEqual(1);
            expect(Cache.current.items[0].value).toEqual(updatedCob.configurationData);
            expect(Cache.current.items[0].revision).toEqual(updatedCob.revisionNumber);
            expect(putCobSpy).toHaveBeenCalledTimes(1);
            done();
          });
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  it("put: update item in cache, unknown cob key, errors.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);

      let updatedCob: ConfigObjectWrapper = JSON.parse(JSON.stringify(cob));
      updatedCob.configurationData.foo = "baa";
      updatedCob.revisionNumber++;

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let putCobSpy: jasmine.Spy = spyOn(ApiClient, "putConfigObject").and.returnValue(ApiClientMock.putConfigObject(updatedCob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // update the item.
          client.put<any>("unknown-cob", updatedCob.configurationData)
          .then(() => {
            fail("expect exception to be raised");
            done();
          })
          .catch((e: Error) => {
            expect(e.message).toEqual("Config object metadata for 'unknown-cob' not found in application.");
            expect(Cache.current.items[0].value).toEqual(cob.configurationData);
            expect(Cache.current.items[0].revision).toEqual(cob.revisionNumber);
            expect(putCobSpy).toHaveBeenCalledTimes(0);
            done();
          });
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  it("put: update item in cache, config objects missing, errors.", function(done: () => void): void {

      let client: ClocoClient = new ClocoClient(options);

      let updatedCob: ConfigObjectWrapper = JSON.parse(JSON.stringify(cob));
      updatedCob.configurationData.foo = "baa";
      updatedCob.revisionNumber++;

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let putCobSpy: jasmine.Spy = spyOn(ApiClient, "putConfigObject").and.returnValue(ApiClientMock.putConfigObject(updatedCob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // update the item.
          client.app.configObjects = undefined; // corrupt the metadata.
          client.put<any>("unknown-cob", updatedCob.configurationData)
          .then(() => {
            fail("expect exception to be raised");
            done();
          })
          .catch((e: Error) => {
            expect(e.message).toEqual("Config object metadata for 'unknown-cob' not found in application.");
            expect(Cache.current.items[0].value).toEqual(cob.configurationData);
            expect(Cache.current.items[0].revision).toEqual(cob.revisionNumber);
            expect(putCobSpy).toHaveBeenCalledTimes(0);
            done();
          });
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });

  it("put: update encrypted item in cache, success.", function(done: () => void): void {

      options.encryptor = aes;
      cob.configurationData = aes.encrypt(JSON.stringify(cob.configurationData)); // encrypt the data packet.
      let client: ClocoClient = new ClocoClient(options);

      let updatedCob: ConfigObjectWrapper = JSON.parse(JSON.stringify(cob));
      let updatedData: any = { foo: "baa" };
      updatedCob.configurationData = aes.encrypt(JSON.stringify(updatedData)); // encrypt the data packet.
      updatedCob.revisionNumber++;

      let getAppSpy: jasmine.Spy = spyOn(ApiClient, "getApplication").and.returnValue(ApiClientMock.getApplication(app));
      let getCobSpy: jasmine.Spy = spyOn(ApiClient, "getConfigObject").and.returnValue(ApiClientMock.getConfigObject(cob));
      let putCobSpy: jasmine.Spy = spyOn(ApiClient, "putConfigObject").and.returnValue(ApiClientMock.putConfigObject(updatedCob));

      client.init()
        .then(() => {
          expect(Cache.current.items.length).toEqual(1);
          expect(getCobSpy).toHaveBeenCalledTimes(1);

          // update the item.
          client.put<any>("test-cob", updatedData)
          .then(() => {
            expect(Cache.current.items.length).toEqual(1);
            expect(Cache.current.items[0].value).toEqual(updatedData);
            expect(Cache.current.items[0].revision).toEqual(updatedCob.revisionNumber);
            expect(putCobSpy).toHaveBeenCalledTimes(1);
            done();
          });
        })
        .catch((e: Error) => {
          console.log(e);
          fail("error not expected");
          done();
        });
  });
});
