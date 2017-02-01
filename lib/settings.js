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
 *   settings.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Static access to local cloco settings.
 */
const fs = require("fs");
const file_system_1 = require("./file-system");
const logger_1 = require("./logging/logger");
const passthrough_encryptor_1 = require("./encryption/passthrough-encryptor");
const settings_error_1 = require("./settings-error");
const tokens_1 = require("./types/tokens");
class Settings {
    /**
     * Loads the default settings from file.
     */
    static setDefaults(options) {
        logger_1.Logger.log.debug("Settings.setDefaults: start.");
        // default the encryptor to the passthrough encryptor if not set.
        options.useEncryption = options.encryptor ? true : false;
        options.encryptor = options.encryptor || new passthrough_encryptor_1.PassthroughEncryptor();
        // load the url from config else use the default cloco one.
        options.url = options.url || Settings.getDefaultUrl() || "https://api.cloco.io";
        // ensure that a subscription is set, either globally or on the options.
        options.subscription = options.subscription || Settings.getDefaultSubscription();
        if (!options.subscription) {
            throw new settings_error_1.SettingsError("Could not load setting: subscription.", "options.subscription");
        }
        // ensure that an application is set, either globally or on the options.
        options.application = options.application || Settings.getDefaultApplication();
        if (!options.application) {
            throw new settings_error_1.SettingsError("Could not load setting: application.", "options.application");
        }
        // ensure that an environment is set, either globally or on the options.
        options.environment = options.environment || Settings.getDefaultEnvironment();
        if (!options.environment) {
            throw new settings_error_1.SettingsError("Could not load setting: environment.", "options.environment");
        }
        // set the interval for checking the cache expiry.
        options.cacheCheckInterval = options.cacheCheckInterval || 60000;
        // check the credentials and load the tokens if appropriate.
        if (!options.tokens) {
            options.tokens = new tokens_1.Tokens();
            options.tokens.accessToken = Settings.getBearerToken();
            options.tokens.refreshToken = Settings.getRefreshToken();
        }
        if (!options.credentials) {
            if (!options.tokens.accessToken) {
                throw new settings_error_1.SettingsError("Could not load bearer token.", "options.tokens.accessToken");
            }
            if (!options.tokens.refreshToken) {
                throw new settings_error_1.SettingsError("Could not load refresh token.", "options.tokens.refreshToken");
            }
        }
        logger_1.Logger.log.debug("Settings.setDefaults: end.");
    }
    /**
     * Reads the bearer token from the local config store.
     * @return {string} The bearer token.
     */
    static getBearerToken() {
        return Settings.readFileContent(`${process.env.HOME}/.cloco/config/cloco_token`);
    }
    /**
     * Stores the bearer token in the local config store.
     * @param {string} token The bearer token.
     */
    static storeBearerToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield file_system_1.FileSystem.writeFile(`${process.env.HOME}/.cloco/config/cloco_token`, token);
        });
    }
    /**
     * Gets the refresh token from the local config store.
     * @return {string} The refresh token.
     */
    static getRefreshToken() {
        return Settings.readFileContent(`${process.env.HOME}/.cloco/config/cloco_refresh_token`);
    }
    /**
     * Gets the default subscription from the local config store.
     * @return {string} The subscription id.
     */
    static getDefaultSubscription() {
        return Settings.readFileContent(`${process.env.HOME}/.cloco/config/subscription`);
    }
    /**
     * Gets the default application from the local config store.
     * @return {string} The application id.
     */
    static getDefaultApplication() {
        return Settings.readFileContent(`${process.env.HOME}/.cloco/config/application`);
    }
    /**
     * Gets the default environment from the local config store.
     * @return {string} The environment id.
     */
    static getDefaultEnvironment() {
        return Settings.readFileContent(`${process.env.HOME}/.cloco/config/environment`);
    }
    /**
     * Gets the default cloco API url from the local store (for on-prem installations).
     * @return {string} The default cloco API url.
     */
    static getDefaultUrl() {
        return Settings.readFileContent(`${process.env.HOME}/.cloco/config/url`);
    }
    /**
     * Reads the content from a file.
     * @param  {string} path The path of the file.
     * @return {string}      The contents of the file.
     */
    static readFileContent(path) {
        Settings.ensureLocalDirs();
        if (fs.existsSync(path)) {
            let content = fs.readFileSync(path, "utf8");
            content = content.replace(/\n$/, "");
            return content;
        }
        else {
            return undefined;
        }
    }
    /**
     * Ensures that the local config directories exist.
     */
    static ensureLocalDirs() {
        let path = `${process.env.HOME}/.cloco/config`;
        if (!fs.existsSync(path)) {
            fs.mkdir(path);
        }
        path = `${process.env.HOME}/.cloco/cache`;
        if (!fs.existsSync(path)) {
            fs.mkdir(path);
        }
    }
}
exports.Settings = Settings;
