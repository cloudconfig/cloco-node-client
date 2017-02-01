"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
 *   api-client.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   cloco client, used to retrieve configuration data.
 */
const restify = require("restify");
const logger_1 = require("./logging/logger");
const jwt_decoder_1 = require("./jwt-decoder");
const settings_1 = require("./settings");
const token_request_1 = require("./types/token-request");
const api_error_1 = require("./types/api-error");
/**
 * Class to provide static accessors over the restify client promises.
 */
class ApiClient {
    /**
     * Retrieves the application from the api.
     * @param  {IOptions}          options The initialization options.
     * @return {Promise<ClocoApp>}         A promise of the application.
     */
    static getApplication(options) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug("ApiClient.getApplication: start");
            // check the bearer token before making the call
            logger_1.Logger.log.debug(`ApiClient.getApplication: Checking bearer token.`);
            yield ApiClient.checkBearerToken(options);
            // initialise the restify client.
            let client = restify.createJsonClient(ApiClient.getRestifyOptions(options));
            let path = `/${options.subscription}/applications/${options.application}`;
            logger_1.Logger.log.debug("ApiClient.getApplication: Calling API", { url: options.url }, { path: path });
            return new Promise(function (resolve, reject) {
                client.get(path, function (err, req, res, obj) {
                    if (err) {
                        logger_1.Logger.log.error(err, "ApiClient.getApplication: Error getting application.");
                        let apiError = new api_error_1.ApiError(err.message, options.subscription, options.application);
                        reject(apiError);
                    }
                    else {
                        logger_1.Logger.log.debug("ApiClient.getApplication: Application received.", { data: obj });
                        resolve(obj);
                    }
                });
            });
        });
    }
    /**
     * Retrieves the application from the api.
     * @param  {IOptions}           options           The initialization options.
     * @param  {string}             objectId          The config object id.
     * @return {Promise<ConfigObjectWrapper>}         A promise of the config object.
     */
    static getConfigObject(options, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug("ApiClient.getConfigObject: start");
            // check the bearer token before making the call
            logger_1.Logger.log.debug(`ApiClient.getConfigObject: Checking bearer token.`);
            yield ApiClient.checkBearerToken(options);
            // initialise the restify client.
            let client = restify.createJsonClient(ApiClient.getRestifyOptions(options));
            let path = `/${options.subscription}/configuration/${options.application}/${objectId}/${options.environment}`;
            logger_1.Logger.log.debug("ApiClient.getConfigObject: Calling API", { url: options.url }, { path: path });
            return new Promise(function (resolve, reject) {
                client.get(path, function (err, req, res, obj) {
                    if (err) {
                        logger_1.Logger.log.error(err, `ApiClient.getConfigObject: Error getting configuration object '$objectId'.`);
                        let apiError = new api_error_1.ApiError(err.message, options.subscription, options.application, objectId, options.environment);
                        reject(apiError);
                    }
                    else {
                        logger_1.Logger.log.debug("ApiClient.getConfigObject: Configuration object wrapper received.", { data: obj });
                        resolve(obj);
                    }
                });
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
    static putConfigObject(options, objectId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug("ApiClient.putConfigObject: start");
            // check the bearer token before making the call
            logger_1.Logger.log.debug(`ApiClient.putConfigObject: Checking bearer token.`);
            yield ApiClient.checkBearerToken(options);
            // initialise the restify client.
            let client;
            let parseResponse = false;
            if (typeof body === "string") {
                logger_1.Logger.log.debug("ApiClient.putConfigObject: creating string client.");
                client = restify.createStringClient(ApiClient.getRestifyOptions(options));
                parseResponse = true;
            }
            else {
                logger_1.Logger.log.debug("ApiClient.putConfigObject: creating JSON client.");
                client = restify.createJsonClient(ApiClient.getRestifyOptions(options));
            }
            let path = `/${options.subscription}/configuration/${options.application}/${objectId}/${options.environment}`;
            logger_1.Logger.log.debug("ApiClient.putConfigObject: Calling API", { url: options.url }, { path: path });
            return new Promise(function (resolve, reject) {
                client.put(path, body, function (err, req, res, obj) {
                    if (err) {
                        logger_1.Logger.log.error(err, "ApiClient.putConfigObject: Error writing data for configuration object '$objectId'.");
                        let apiError = new api_error_1.ApiError(err.message, options.subscription, options.application, objectId, options.environment);
                        reject(apiError);
                    }
                    else {
                        if (parseResponse) {
                            obj = JSON.parse(obj);
                        }
                        logger_1.Logger.log.debug("ApiClient.putConfigObject: Success response received.", { data: obj });
                        resolve(obj);
                    }
                });
            });
        });
    }
    /**
     * Checks the bearer token for expiry and, if expired, refreshes.
     * @return {Promise<void>} A promise of the work completing.
     */
    static checkBearerToken(options) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug(`ApiClient.checkBearerToken: start.`);
            try {
                if (jwt_decoder_1.JwtDecoder.bearerTokenExpired(options.tokens.accessToken)) {
                    logger_1.Logger.log.debug(`ApiClient.checkBearerToken: bearer token has expired and will be refreshed.`);
                    let response;
                    if (options.credentials) {
                        response = yield ApiClient.getAccessTokenFromClientCredentials(options);
                    }
                    else {
                        response = yield ApiClient.getAccessTokenFromRefreshToken(options);
                    }
                    options.tokens.accessToken = response.access_token;
                    settings_1.Settings.storeBearerToken(response.access_token);
                }
            }
            catch (e) {
                logger_1.Logger.log.error(e, "ApiClient.checkBearerToken: error encountered.");
                throw e;
            }
            logger_1.Logger.log.debug(`ApiClient.checkBearerToken: complete.`);
        });
    }
    /**
     * Refreshes the bearer token.
     * @param  {IOptions}          options The initialization options.
     * @return {Promise<AccessTokenResponse>}         A promise of the access token.
     */
    static getAccessTokenFromRefreshToken(options) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug("ApiClient.getAccessTokenFromRefreshToken: start");
            // initialise the restify client.
            let client = restify.createJsonClient(ApiClient.getRestifyOptions(options));
            let path = `/oauth/token`;
            let body = new token_request_1.TokenRequest();
            body.grant_type = "refresh_token";
            body.refresh_token = options.tokens.refreshToken;
            logger_1.Logger.log.debug("ApiClient.getAccessTokenFromRefreshToken: Calling API", { url: options.url }, { path: path });
            return new Promise(function (resolve, reject) {
                client.post(path, body, function (err, req, res, obj) {
                    if (err) {
                        logger_1.Logger.log.error(err, "ApiClient.getAccessTokenFromRefreshToken: Error getting access token.");
                        reject(err);
                    }
                    else {
                        logger_1.Logger.log.debug("ApiClient.getAccessTokenFromRefreshToken: Access token response received.");
                        resolve(obj);
                    }
                });
            });
        });
    }
    /**
     * Refreshes the bearer token.
     * @param  {IOptions}          options The initialization options.
     * @return {Promise<AccessTokenResponse>}         A promise of the access token.
     */
    static getAccessTokenFromClientCredentials(options) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug("ApiClient.getAccessTokenFromClientCredentials: start");
            // initialise the restify client.
            let client = restify.createJsonClient(ApiClient.getRestifyOptions(options, "basic"));
            let path = `/oauth/token`;
            let body = new token_request_1.TokenRequest();
            body.grant_type = "client_credentials";
            logger_1.Logger.log.debug("ApiClient.getAccessTokenFromClientCredentials: Calling API", { url: options.url }, { path: path });
            return new Promise(function (resolve, reject) {
                client.post(path, body, function (err, req, res, obj) {
                    if (err) {
                        logger_1.Logger.log.error(err, "ApiClient.getAccessTokenFromClientCredentials: Error getting access token.");
                        reject(err);
                    }
                    else {
                        logger_1.Logger.log.debug("ApiClient.getAccessTokenFromClientCredentials: Access token response received.");
                        resolve(obj);
                    }
                });
            });
        });
    }
    /**
     * Gets the restify options based on the settings.
     * @param  {IOptions}              options The options.
     * @return {restify.ClientOptions}         The restify client options.
     */
    static getRestifyOptions(options, credentialType) {
        logger_1.Logger.log.debug("ApiClient.getRestifyOptions: start");
        let restifyOptions = {
            url: options.url,
            version: "*",
        };
        let headers = {};
        if (credentialType === "basic") {
            logger_1.Logger.log.debug("ApiClient.getRestifyOptions: generating auth header with client credentials.");
            let encoded = new Buffer(`${options.credentials.key}:${options.credentials.secret}`).toString("base64");
            headers.authorization = `Basic ${encoded}`;
        }
        else {
            logger_1.Logger.log.debug("ApiClient.getRestifyOptions: generating auth header with bearer token.");
            headers.authorization = `Bearer ${options.tokens.accessToken}`;
        }
        restifyOptions.headers = headers;
        logger_1.Logger.log.debug("ApiClient.getRestifyOptions: end");
        return restifyOptions;
    }
}
exports.ApiClient = ApiClient;
