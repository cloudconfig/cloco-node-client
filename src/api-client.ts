/**
 *   api-client.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   cloco client, used to retrieve configuration data.
 */
import * as restify from "restify";
import { Logger } from "./logging/logger";
import { AccessTokenResponse } from "./types/access-token-response";
import { IOptions } from "./types/ioptions";
import { JwtDecoder } from "./jwt-decoder";
import { ClocoApp, ConfigObjectWrapper } from "./types/clocoapp";
import { Settings } from "./settings";
import { TokenRequest } from "./types/token-request";
import { ApiError } from "./types/api-error";

/**
 * Class to provide static accessors over the restify client promises.
 */
export class ApiClient {

  /**
   * Retrieves the application from the api.
   * @param  {IOptions}          options The initialization options.
   * @return {Promise<ClocoApp>}         A promise of the application.
   */
  public static async getApplication(options: IOptions): Promise<ClocoApp> {

    Logger.log.debug("ApiClient.getApplication: start");

    // check the bearer token before making the call
    await ApiClient.checkBearerToken(options);

    // initialise the restify client.
    let client: restify.Client = restify.createJsonClient(ApiClient.getRestifyOptions(options));
    let path: string = `/${options.subscription}/applications/${options.application}`;
    Logger.log.debug("ApiClient.getApplication: Calling API", {url: options.url}, {path: path});

    return new Promise<ClocoApp>(
        function(
            resolve: (value: ClocoApp) => void,
            reject: (reason: Error) => void): void {

            client.get(
                path,
                function(err: Error, req: restify.Request, res: restify.Response, obj: ClocoApp): void {
                    if (err) {
                        Logger.log.error(err, "ApiClient.getApplication: Error getting application.");
                        let apiError: ApiError = new ApiError(err.message, options.subscription, options.application);
                        reject(apiError);
                    } else {
                        Logger.log.debug("ApiClient.getApplication: Application received.", {data: obj});
                        resolve(obj);
                    }
                });
        });
  }

  /**
   * Retrieves the application from the api.
   * @param  {IOptions}           options           The initialization options.
   * @param  {string}             objectId          The config object id.
   * @return {Promise<ConfigObjectWrapper>}         A promise of the config object.
   */
  public static async getConfigObject(options: IOptions, objectId: string): Promise<ConfigObjectWrapper> {

    Logger.log.debug("ApiClient.getConfigObject: start");

    // check the bearer token before making the call
    await ApiClient.checkBearerToken(options);

    // initialise the restify client.
    let client: restify.Client = restify.createJsonClient(ApiClient.getRestifyOptions(options));
    let path: string = `/${options.subscription}/configuration/${options.application}/${objectId}/${options.environment}`;
    Logger.log.debug("ApiClient.getConfigObject: Calling API", {url: options.url}, {path: path});

    return new Promise<ConfigObjectWrapper>(
        function(
            resolve: (value: ConfigObjectWrapper) => void,
            reject: (reason: Error) => void): void {

            client.get(
                path,
                function(err: Error, req: restify.Request, res: restify.Response, obj: ConfigObjectWrapper): void {
                    if (err) {
                        Logger.log.error(err, `ApiClient.getConfigObject: Error getting configuration object '$objectId'.`);
                        let apiError: ApiError = new ApiError(
                          err.message, options.subscription, options.application, objectId, options.environment);
                        reject(apiError);
                    } else {
                        Logger.log.debug("ApiClient.getConfigObject: Configuration object wrapper received.", { data: obj });
                        resolve(obj);
                    }
                });
        });
  }

  /**
   * Writes the config object to the server.
   * @param  {IOptions}      options  The options.
   * @param  {string}        objectId The object Id.
   * @param  {any}           body     The item to write.
   * @return {Promise<ConfigObjectWrapper>}          A promise of the work completing.
   */
  public static async putConfigObject(options: IOptions, objectId: string, body: any): Promise<ConfigObjectWrapper> {

    Logger.log.debug("ApiClient.putConfigObject: start");

    // check the bearer token before making the call
    await ApiClient.checkBearerToken(options);

    // initialise the restify client.
    let client: restify.Client;
    let parseResponse: boolean = false;

    if (typeof body === "string") {
      Logger.log.debug("ApiClient.putConfigObject: creating string client.");
      client = restify.createStringClient(ApiClient.getRestifyOptions(options));
      parseResponse = true;
    } else {
      Logger.log.debug("ApiClient.putConfigObject: creating JSON client.");
      client = restify.createJsonClient(ApiClient.getRestifyOptions(options));
    }

    let path: string = `/${options.subscription}/configuration/${options.application}/${objectId}/${options.environment}`;
    Logger.log.debug("ApiClient.putConfigObject: Calling API", {url: options.url}, {path: path});

    return new Promise<ConfigObjectWrapper>(
        function(
            resolve: (value: ConfigObjectWrapper) => void,
            reject: (reason: Error) => void): void {

            client.put(
                path,
                body,
                function(err: Error, req: restify.Request, res: restify.Response, obj: any): void {
                    if (err) {
                        Logger.log.error(err, "ApiClient.putConfigObject: Error writing data for configuration object '$objectId'.");
                        let apiError: ApiError = new ApiError(
                          err.message, options.subscription, options.application, objectId, options.environment);
                        reject(apiError);
                    } else {
                        if (parseResponse) {
                          obj = JSON.parse(obj);
                        }
                        Logger.log.debug("ApiClient.putConfigObject: Success response received.", { data: obj });
                        resolve(obj);
                    }
                });
        });
  }

  /**
   * Checks the bearer token for expiry and, if expired, refreshes.
   * @return {Promise<void>} A promise of the work completing.
   */
  private static async checkBearerToken(options: IOptions): Promise<void> {

    Logger.log.debug(`ApiClient.checkBearerToken: start.`);

    try {
      if (JwtDecoder.bearerTokenExpired(options.tokens.accessToken)) {

        Logger.log.debug(`ApiClient.checkBearerToken: bearer token has expired and will be refreshed.`);

        let response: AccessTokenResponse;
        if (options.credentials) {
          response = await ApiClient.getAccessTokenFromClientCredentials(options);
        } else {
          response = await ApiClient.getAccessTokenFromRefreshToken(options);
        }
        options.tokens.accessToken = response.access_token;
        Settings.storeBearerToken(response.access_token);
      }
    } catch (e) {
      Logger.log.error(e, "ApiClient.checkBearerToken: error encountered.");
      throw e;
    }

    Logger.log.debug(`ApiClient.checkBearerToken: complete.`);
  }

  /**
   * Refreshes the bearer token.
   * @param  {IOptions}          options The initialization options.
   * @return {Promise<AccessTokenResponse>}         A promise of the access token.
   */
  private static async getAccessTokenFromRefreshToken(options: IOptions): Promise<AccessTokenResponse> {

    Logger.log.debug("ApiClient.getAccessTokenFromRefreshToken: start");

    // initialise the restify client.
    let client: restify.Client = restify.createJsonClient(ApiClient.getRestifyOptions(options));
    let path: string = `/oauth/token`;
    let body: TokenRequest = new TokenRequest();
    body.grant_type = "refresh_token";
    body.refresh_token = options.tokens.refreshToken;
    Logger.log.debug("ApiClient.getAccessTokenFromRefreshToken: Calling API", {url: options.url}, {path: path});

    return new Promise<AccessTokenResponse>(
        function(
            resolve: (value: AccessTokenResponse) => void,
            reject: (reason: Error) => void): void {

            client.post(
                path,
                body,
                function(err: Error, req: restify.Request, res: restify.Response, obj: AccessTokenResponse): void {
                    if (err) {
                        Logger.log.error(err, "ApiClient.getAccessTokenFromRefreshToken: Error getting access token.");
                        reject(err);
                    } else {
                        Logger.log.debug("ApiClient.getAccessTokenFromRefreshToken: Access token response received.");
                        resolve(obj);
                    }
                });
        });
  }

  /**
   * Refreshes the bearer token.
   * @param  {IOptions}          options The initialization options.
   * @return {Promise<AccessTokenResponse>}         A promise of the access token.
   */
  private static async getAccessTokenFromClientCredentials(options: IOptions): Promise<AccessTokenResponse> {

    Logger.log.debug("ApiClient.getAccessTokenFromClientCredentials: start");

    // initialise the restify client.
    let client: restify.Client = restify.createJsonClient(ApiClient.getRestifyOptions(options, "basic"));
    let path: string = `/oauth/token`;
    let body: TokenRequest = new TokenRequest();
    body.grant_type = "client_credentials";
    Logger.log.debug("ApiClient.getAccessTokenFromClientCredentials: Calling API", {url: options.url}, {path: path});

    return new Promise<AccessTokenResponse>(
        function(
            resolve: (value: AccessTokenResponse) => void,
            reject: (reason: Error) => void): void {

            client.post(
                path,
                body,
                function(err: Error, req: restify.Request, res: restify.Response, obj: AccessTokenResponse): void {
                    if (err) {
                        Logger.log.error(err, "ApiClient.getAccessTokenFromClientCredentials: Error getting access token.");
                        reject(err);
                    } else {
                        Logger.log.debug("ApiClient.getAccessTokenFromClientCredentials: Access token response received.");
                        resolve(obj);
                    }
                });
        });
  }

  /**
   * Gets the restify options based on the settings.
   * @param  {IOptions}              options The options.
   * @return {restify.ClientOptions}         The restify client options.
   */
  private static getRestifyOptions(options: IOptions, credentialType?: string): restify.ClientOptions {

    Logger.log.debug("ApiClient.getRestifyOptions: start");

    let restifyOptions: restify.ClientOptions = {
        url: options.url,
        version: "*",
    };

    let headers: any = {};

    if (credentialType === "basic") {
      Logger.log.debug("ApiClient.getRestifyOptions: generating auth header with client credentials.");
      let encoded: string = new Buffer(`${options.credentials.key}:${options.credentials.secret}`).toString("base64");
      headers.authorization = `Basic ${encoded}`;
    } else {
        Logger.log.debug("ApiClient.getRestifyOptions: generating auth header with bearer token.");
        headers.authorization = `Bearer ${options.tokens.accessToken}`;
    }

    restifyOptions.headers = headers;

    Logger.log.debug("ApiClient.getRestifyOptions: end");

    return restifyOptions;
  }
}
