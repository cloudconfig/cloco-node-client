/**
 *   api-client.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { JwtGenerator } from "./test/jwt-generator";
import * as restify from "restify";
import { ApiClient } from "./api-client";
import { ClocoApp, ConfigObjectWrapper } from "./types/clocoapp";
import { IOptions } from "./types/ioptions";
import { Logger } from "./logging/logger";

describe("ApiClient unit tests", function(): void {

    let options: IOptions;
    let requestedPath: string;

    beforeAll(function(done: () => void): void {
        Logger.init({});
        done();
    });

    beforeEach(function(done: () => void): void {
        options = {};
        options.tokens = { accessToken: "", refreshToken: "" };
        options.url = "https://test.api.cloco.io";
        options.subscription = "subscription";
        options.application = "application";
        options.environment = "test";

        let generator: JwtGenerator = new JwtGenerator();
        generator.generateJwt("A1234", "some-user")
            .then((jwt: string) => {
                options.tokens.accessToken = jwt;
                done();
            });
    });

    it("getApplication: successful happy path call to api with valid bearer token.", function(done: () => void): void {

        let clientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            // tslint:disable-next-line:max-line-length
            client.get = (path: string, callback: (err: Error, req: restify.Request, res: restify.Response, obj: ClocoApp) => void): void => {
                requestedPath = path;
                let app: ClocoApp = new ClocoApp();
                app.applicationIdentifier = "unit-test-app";
                callback(undefined, undefined, undefined, app);
            };
            return client;
        });

        ApiClient.getApplication(options)
            .then((app: ClocoApp) => {
                expect(app).toBeTruthy();
                expect(app.applicationIdentifier).toEqual("unit-test-app");
                expect(requestedPath).toEqual("/subscription/applications/application");
                done();
            })
            .catch((e: Error) => {
                console.log(e);
                fail("no error expected.");
                done();
            });
    });

    it("getApplication: call to api errors, expect rejection of promise.", function(done: () => void): void {

        let clientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            // tslint:disable-next-line:max-line-length
            client.get = (path: string, callback: (err: Error, req: restify.Request, res: restify.Response, obj: ClocoApp) => void): void => {
                requestedPath = path;
                let error: Error = new Error("unit-test-error");
                callback(error, undefined, undefined, undefined);
            };
            return client;
        });

        ApiClient.getApplication(options)
            .then((app: ClocoApp) => {
                fail("error expected.");
                done();
            })
            .catch((e: Error) => {
                expect(e).toBeTruthy();
                expect(e.message).toEqual("unit-test-error");
                expect(requestedPath).toEqual("/subscription/applications/application");
                done();
            });
    });

    it("getConfigObject: successful happy path call to api with valid bearer token.", function(done: () => void): void {

        let clientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.get = (path: string,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: ConfigObjectWrapper) => void): void => {
                requestedPath = path;
                let cob: ConfigObjectWrapper = new ConfigObjectWrapper();
                cob.objectIdentifier = "unit-test-cob";
                callback(undefined, undefined, undefined, cob);
            };
            return client;
        });

        ApiClient.getConfigObject(options, "objectId")
            .then((cob: ConfigObjectWrapper) => {
                expect(cob).toBeTruthy();
                expect(cob.objectIdentifier).toEqual("unit-test-cob");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                done();
            })
            .catch((e: Error) => {
                console.log(e);
                fail("no error expected.");
                done();
            });
    });

    it("getConfigObject: call to api errors, expect rejection of promise.", function(done: () => void): void {

        let clientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.get = (path: string,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: ConfigObjectWrapper) => void): void => {
                requestedPath = path;
                let error: Error = new Error("unit-test-error");
                callback(error, undefined, undefined, undefined);
            };
            return client;
        });

        ApiClient.getConfigObject(options, "objectId")
            .then((app: ConfigObjectWrapper) => {
                fail("error expected.");
                done();
            })
            .catch((e: Error) => {
                expect(e).toBeTruthy();
                expect(e.message).toEqual("unit-test-error");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                done();
            });
    });

    it("putConfigObject: successful happy path call to api with valid bearer token, JSON object.", function(done: () => void): void {

        let clientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.put = (path: string, body: any,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                requestedPath = path;
                let cob: ConfigObjectWrapper = new ConfigObjectWrapper();
                cob.objectIdentifier = "unit-test-cob";
                callback(undefined, undefined, undefined, cob);
            };
            return client;
        });

        ApiClient.putConfigObject(options, "objectId", { objectType: "test" })
            .then((cob: ConfigObjectWrapper) => {
                expect(cob).toBeTruthy();
                expect(cob.objectIdentifier).toEqual("unit-test-cob");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                done();
            })
            .catch((e: Error) => {
                console.log(e);
                fail("no error expected.");
                done();
            });
    });

    it("putConfigObject: successful happy path call to api with valid bearer token, string.", function(done: () => void): void {

        let clientSpy: jasmine.Spy = spyOn(restify, "createStringClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.put = (path: string, body: any,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                requestedPath = path;
                let cob: ConfigObjectWrapper = new ConfigObjectWrapper();
                cob.objectIdentifier = "unit-test-cob";
                cob.configurationData = body;
                callback(undefined, undefined, undefined, JSON.stringify(cob));
            };
            return client;
        });

        ApiClient.putConfigObject(options, "objectId", JSON.stringify({ objectType: "test" }))
            .then((cob: ConfigObjectWrapper) => {
                expect(cob).toBeTruthy();
                expect(cob.objectIdentifier).toEqual("unit-test-cob");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                done();
            })
            .catch((e: Error) => {
                console.log(e);
                fail("no error expected.");
                done();
            });
    });

    it("putConfigObject: failed call to api with valid bearer token, string client, error.", function(done: () => void): void {

        let clientSpy: jasmine.Spy = spyOn(restify, "createStringClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.put = (path: string, body: any,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                requestedPath = path;
                callback(new Error("unit-test-error"), undefined, undefined, undefined);
            };
            return client;
        });

        ApiClient.putConfigObject(options, "objectId", JSON.stringify({ objectType: "test" }))
            .then((app: ConfigObjectWrapper) => {
                fail("error expected.");
                done();
            })
            .catch((e: Error) => {
                expect(e).toBeTruthy();
                expect(e.message).toEqual("unit-test-error");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                done();
            });
    });

    it("putConfigObject: bearer token expired, acquire new token, string client.", function(done: () => void): void {

        // assign an expired jwt.
        // tslint:disable-next-line:max-line-length
        options.tokens.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBMTIzNCIsInVzZXJuYW1lIjoic29tZS11c2VyIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2xvY28uaW8vdjEvY2xvY28tbm9kZS1jbGllbnQvdGVzdGluZyIsImlhdCI6MTQ4NTQzNzczMywiZXhwIjoxNDg1NDM3NzkzfQ.zoDToEedftG3ao9cNaZYM8UMRTHZJxHfgfpKpOQgABQ";
        options.credentials = { key: "api-key", secret: "api-secret" };

        let jsonClientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.post = (path: string, body: any,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                let response: any = { "access_token": "test-access-token" };
                callback(undefined, undefined, undefined, response);
            };
            return client;
        });

        let stringClientSpy: jasmine.Spy =
            spyOn(restify, "createStringClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
                let client: restify.Client = {} as restify.Client;
                client.put = (path: string, body: any,
                    callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                    requestedPath = path;
                    let cob: ConfigObjectWrapper = new ConfigObjectWrapper();
                    cob.objectIdentifier = "unit-test-cob";
                    cob.configurationData = body;
                    callback(undefined, undefined, undefined, JSON.stringify(cob));
                };
                return client;
            });

        ApiClient.putConfigObject(options, "objectId", JSON.stringify({ objectType: "test" }))
            .then((cob: ConfigObjectWrapper) => {
                expect(cob).toBeTruthy();
                expect(cob.objectIdentifier).toEqual("unit-test-cob");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                expect(jsonClientSpy).toHaveBeenCalledTimes(1);
                expect(stringClientSpy).toHaveBeenCalledTimes(1);
                expect(options.tokens.accessToken).toEqual("test-access-token");
                done();
            })
            .catch((e: Error) => {
                console.log(e);
                fail("no error expected.");
                done();
            });
    });

    it("putConfigObject: bearer token expired, acquire new token, error acquiring token.", function(done: () => void): void {

        // assign an expired jwt.
        // tslint:disable-next-line:max-line-length
        options.tokens.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBMTIzNCIsInVzZXJuYW1lIjoic29tZS11c2VyIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2xvY28uaW8vdjEvY2xvY28tbm9kZS1jbGllbnQvdGVzdGluZyIsImlhdCI6MTQ4NTQzNzczMywiZXhwIjoxNDg1NDM3NzkzfQ.zoDToEedftG3ao9cNaZYM8UMRTHZJxHfgfpKpOQgABQ";
        options.credentials = { key: "api-key", secret: "api-secret" };

        let jsonClientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.post = (path: string, body: any,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                callback(new Error("bearer-token-error"), undefined, undefined, undefined);
            };
            return client;
        });

        let stringClientSpy: jasmine.Spy =
            spyOn(restify, "createStringClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
                let client: restify.Client = {} as restify.Client;
                client.put = (path: string, body: any,
                    callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                    requestedPath = path;
                    let cob: ConfigObjectWrapper = new ConfigObjectWrapper();
                    cob.objectIdentifier = "unit-test-cob";
                    cob.configurationData = body;
                    callback(undefined, undefined, undefined, JSON.stringify(cob));
                };
                return client;
            });

        ApiClient.putConfigObject(options, "objectId", JSON.stringify({ objectType: "test" }))
            .then((app: ConfigObjectWrapper) => {
                fail("error expected.");
                done();
            })
            .catch((e: Error) => {
                expect(e).toBeTruthy();
                expect(e.message).toEqual("bearer-token-error");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                expect(jsonClientSpy).toHaveBeenCalledTimes(1);
                expect(stringClientSpy).toHaveBeenCalledTimes(0);
                done();
            });
    });

    // tslint:disable-next-line:max-line-length
    it("putConfigObject: bearer token expired, acquire new token from client credentials, string client.", function(done: () => void): void {

        // assign an expired jwt.
        // tslint:disable-next-line:max-line-length
        options.tokens.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBMTIzNCIsInVzZXJuYW1lIjoic29tZS11c2VyIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2xvY28uaW8vdjEvY2xvY28tbm9kZS1jbGllbnQvdGVzdGluZyIsImlhdCI6MTQ4NTQzNzczMywiZXhwIjoxNDg1NDM3NzkzfQ.zoDToEedftG3ao9cNaZYM8UMRTHZJxHfgfpKpOQgABQ";
        options.tokens.refreshToken = "";
        options.credentials = { key: "key", secret: "secret" };

        let jsonClientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.post = (path: string, body: any,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                let response: any = { "access_token": "test-access-token" };
                callback(undefined, undefined, undefined, response);
            };
            return client;
        });

        let stringClientSpy: jasmine.Spy =
            spyOn(restify, "createStringClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
                let client: restify.Client = {} as restify.Client;
                client.put = (path: string, body: any,
                    callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                    requestedPath = path;
                    let cob: ConfigObjectWrapper = new ConfigObjectWrapper();
                    cob.objectIdentifier = "unit-test-cob";
                    cob.configurationData = body;
                    callback(undefined, undefined, undefined, JSON.stringify(cob));
                };
                return client;
            });

        ApiClient.putConfigObject(options, "objectId", JSON.stringify({ objectType: "test" }))
            .then((cob: ConfigObjectWrapper) => {
                expect(cob).toBeTruthy();
                expect(cob.objectIdentifier).toEqual("unit-test-cob");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                expect(jsonClientSpy).toHaveBeenCalledTimes(1);
                expect(stringClientSpy).toHaveBeenCalledTimes(1);
                expect(options.tokens.accessToken).toEqual("test-access-token");
                done();
            })
            .catch((e: Error) => {
                console.log(e);
                fail("no error expected.");
                done();
            });
    });

    // tslint:disable-next-line:max-line-length
    it("putConfigObject: bearer token expired, acquire new token from client credentials, error acquiring token.", function(done: () => void): void {

        // assign an expired jwt.
        // tslint:disable-next-line:max-line-length
        options.tokens.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBMTIzNCIsInVzZXJuYW1lIjoic29tZS11c2VyIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2xvY28uaW8vdjEvY2xvY28tbm9kZS1jbGllbnQvdGVzdGluZyIsImlhdCI6MTQ4NTQzNzczMywiZXhwIjoxNDg1NDM3NzkzfQ.zoDToEedftG3ao9cNaZYM8UMRTHZJxHfgfpKpOQgABQ";
        options.tokens.refreshToken = "";
        options.credentials = { key: "key", secret: "secret" };

        let jsonClientSpy: jasmine.Spy = spyOn(restify, "createJsonClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
            let client: restify.Client = {} as restify.Client;
            client.post = (path: string, body: any,
                callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                callback(new Error("bearer-token-error"), undefined, undefined, undefined);
            };
            return client;
        });

        let stringClientSpy: jasmine.Spy =
            spyOn(restify, "createStringClient").and.callFake((opts: restify.ClientOptions): restify.Client => {
                let client: restify.Client = {} as restify.Client;
                client.put = (path: string, body: any,
                    callback: (err: Error, req: restify.Request, res: restify.Response, obj: any) => void): void => {
                    requestedPath = path;
                    let cob: ConfigObjectWrapper = new ConfigObjectWrapper();
                    cob.objectIdentifier = "unit-test-cob";
                    cob.configurationData = body;
                    callback(undefined, undefined, undefined, JSON.stringify(cob));
                };
                return client;
            });

        ApiClient.putConfigObject(options, "objectId", JSON.stringify({ objectType: "test" }))
            .then((app: ConfigObjectWrapper) => {
                fail("error expected.");
                done();
            })
            .catch((e: Error) => {
                expect(e).toBeTruthy();
                expect(e.message).toEqual("bearer-token-error");
                expect(requestedPath).toEqual("/subscription/configuration/application/objectId/test");
                expect(jsonClientSpy).toHaveBeenCalledTimes(1);
                expect(stringClientSpy).toHaveBeenCalledTimes(0);
                done();
            });
    });
});
