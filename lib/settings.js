"use strict";
/**
 *   settings.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Static access to local cloco settings.
 */
const fs = require("fs");
const ini = require("ini");
const file_system_1 = require("./file-system");
const logger_1 = require("./logging/logger");
const passthrough_encryptor_1 = require("./encryption/passthrough-encryptor");
const settings_error_1 = require("./settings-error");
const credentials_1 = require("./types/credentials");
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
        // check for local settings
        if (fs.existsSync(Settings.getConfigFilePath())) {
            let config = ini.parse(fs.readFileSync(Settings.getConfigFilePath(), "utf-8"));
            // load the url from config else use the default cloco one.
            options.url = options.url || config.settings.url;
            options.subscription = options.subscription || config.preferences.subscription;
            options.application = options.application || config.preferences.application;
            options.environment = options.environment || config.preferences.environment;
            if (!options.credentials) {
                options.credentials = new credentials_1.Credentials();
                options.credentials.key = config.credentials.cloco_client_key;
                options.credentials.secret = config.credentials.cloco_client_secret;
            }
            if (!options.tokens) {
                options.tokens = new tokens_1.Tokens();
            }
        }
        // if url not set then use the default cloco url.
        options.url = options.url || "https://api.cloco.io";
        // set the interval for checking the cache expiry.
        options.cacheCheckInterval = options.cacheCheckInterval || 60000;
        // ensure that a subscription is set.
        if (!options.subscription) {
            throw new settings_error_1.SettingsError("Could not load setting: subscription.", "options.subscription");
        }
        // ensure that an application is set.
        if (!options.application) {
            throw new settings_error_1.SettingsError("Could not load setting: application.", "options.application");
        }
        // ensure that an environment is set.
        if (!options.environment) {
            throw new settings_error_1.SettingsError("Could not load setting: environment.", "options.environment");
        }
        if (!options.credentials || !options.credentials.key || !options.credentials.secret) {
            throw new settings_error_1.SettingsError("No credentials available", "options.credentials");
        }
        logger_1.Logger.log.debug("Settings.setDefaults: end.");
    }
    /**
     * Returns the path to the local ini file created by cloco-cli
     * @return {string} [description]
     */
    static getConfigFilePath() {
        return `${file_system_1.FileSystem.getUserHome()}/.cloco/configuration`;
    }
}
exports.Settings = Settings;
