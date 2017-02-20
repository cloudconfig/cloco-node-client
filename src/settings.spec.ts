/**
 *   settings.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import * as fs from "fs";
import * as ini from "ini";
import { Settings } from "./settings";
import { IOptions } from "./types/ioptions";
import { Logger } from "./logging/logger";
import { PassthroughEncryptor } from "./encryption/passthrough-encryptor";
import { SettingsError } from "./settings-error";
import { Tokens } from "./types/tokens";

describe("Settings unit tests", function(): void {

    let config: any;
    let options: IOptions;

    // initialize.
    beforeAll(function(): void {
        Logger.init({});
    });

    beforeEach(function(): void {
        options = {};
        config = {
            credentials: {
                cloco_client_key: "api-key",
                cloco_client_secret: "api-secret",
            },
            preferences: {
                application: "application",
                environment: "environment",
                subscription: "subscription",
            },
            settings: {
                url: "cloco-url",
            },
        };
    });

    it("setDefaults: empty options set everything to default.", function(): void {

        let iniSpy: jasmine.Spy = spyOn(ini, "parse").and.callFake((path: string) => {
            return config;
        });

        let fsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.callFake((path: string) => {
            return true;
        });

        Settings.setDefaults(options);

        expect(options.useEncryption).toEqual(false);
        expect(options.encryptor).toBeTruthy("options.encryptor");
        expect(options.encryptor instanceof PassthroughEncryptor).toBeTruthy("options.encryptor instanceof PassthroughEncryptor");
        expect(options.url).toEqual("cloco-url");
        expect(options.subscription).toEqual("subscription");
        expect(options.application).toEqual("application");
        expect(options.environment).toEqual("environment");
        expect(options.cacheCheckInterval).toEqual(60000);
        expect(options.credentials).toBeTruthy("options.credentials");
        expect(options.credentials.key).toEqual("api-key");
        expect(options.credentials.secret).toEqual("api-secret");
        expect(options.tokens).toBeTruthy("options.tokens");
        expect(options.tokens instanceof Tokens).toBeTruthy("options.tokens instanceof Tokens");
    });

    it("setDefaults: default url set blank, defaults to cloco prod value.", function(): void {

        let iniSpy: jasmine.Spy = spyOn(ini, "parse").and.callFake((path: string) => {
            return config;
        });

        let fsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.callFake((path: string) => {
            return true;
        });

        config.settings.url = "";

        Settings.setDefaults(options);

        expect(options.url).toEqual("https://api.cloco.io");
    });

    it("setDefaults: encryptor supplied, marks as supporting encryption.", function(): void {

        let iniSpy: jasmine.Spy = spyOn(ini, "parse").and.callFake((path: string) => {
            return config;
        });

        let fsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.callFake((path: string) => {
            return true;
        });

        options.encryptor = new PassthroughEncryptor();

        Settings.setDefaults(options);

        expect(options.useEncryption).toEqual(true);
    });

    it("setDefaults: default subscription empty, raises error.", function(): void {

        let iniSpy: jasmine.Spy = spyOn(ini, "parse").and.callFake((path: string) => {
            return config;
        });

        let fsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.callFake((path: string) => {
            return true;
        });

        config.preferences.subscription = "";

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

        let iniSpy: jasmine.Spy = spyOn(ini, "parse").and.callFake((path: string) => {
            return config;
        });

        let fsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.callFake((path: string) => {
            return false;
        });

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

        let iniSpy: jasmine.Spy = spyOn(ini, "parse").and.callFake((path: string) => {
            return config;
        });

        let fsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.callFake((path: string) => {
            return true;
        });

        config.preferences.application = "";

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

        let iniSpy: jasmine.Spy = spyOn(ini, "parse").and.callFake((path: string) => {
            return config;
        });

        let fsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.callFake((path: string) => {
            return true;
        });

        config.preferences.environment = "";

        try {
            Settings.setDefaults(options);
            fail("expect failure because of no default environment.");
        } catch (e) {
            expect(e).toBeTruthy();
            expect(e instanceof SettingsError).toBeTruthy();
            expect(e.setting).toEqual("options.environment");
        }
    });

    it("setDefaults: credentials supplied, no error initializing tokens.", function(): void {

        let iniSpy: jasmine.Spy = spyOn(ini, "parse").and.callFake((path: string) => {
            return config;
        });

        let fsSpy: jasmine.Spy = spyOn(fs, "existsSync").and.callFake((path: string) => {
            return true;
        });

        config.credentials.cloco_client_key = "";
        config.credentials.cloco_client_secret = "";

        options.credentials = { key: "key", secret: "secret" };
        Settings.setDefaults(options);
        expect(options.credentials).toBeTruthy();
        expect(options.credentials.key).toEqual("key");
        expect(options.credentials.secret).toEqual("secret");
        expect(options.tokens).toBeTruthy();
        expect(options.tokens.refreshToken).toBeFalsy();
    });
});
