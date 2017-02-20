/**
 *   settings.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Static access to local cloco settings.
 */
import * as fs from "fs";
import * as ini from "ini";
import { FileSystem } from "./file-system";
import { Logger } from "./logging/logger";
import { PassthroughEncryptor } from "./encryption/passthrough-encryptor";
import { SettingsError } from "./settings-error";
import { Credentials } from "./types/credentials";
import { IOptions } from "./types/ioptions";
import { Tokens } from "./types/tokens";

export class Settings {

    /**
     * Loads the default settings from file.
     */
    public static setDefaults(options: IOptions): void {

        Logger.log.debug("Settings.setDefaults: start.");

        // default the encryptor to the passthrough encryptor if not set.
        options.useEncryption = options.encryptor ? true : false;
        options.encryptor = options.encryptor || new PassthroughEncryptor();

        // check for local settings
        if (fs.existsSync(Settings.getConfigFilePath())) {

            let config: any = ini.parse(fs.readFileSync(Settings.getConfigFilePath(), "utf-8"));

            // load the url from config else use the default cloco one.
            options.url = options.url || config.settings.url;
            options.subscription = options.subscription || config.preferences.subscription;
            options.application = options.application || config.preferences.application;
            options.environment = options.environment || config.preferences.environment;

            if (!options.credentials) {
                options.credentials = new Credentials();
                options.credentials.key = config.credentials.cloco_client_key;
                options.credentials.secret = config.credentials.cloco_client_secret;
            }

            if (!options.tokens) {
                options.tokens = new Tokens();
            }
        }

        // if url not set then use the default cloco url.
        options.url = options.url || "https://api.cloco.io";

        // set the interval for checking the cache expiry.
        options.cacheCheckInterval = options.cacheCheckInterval || 60000;

        // ensure that a subscription is set.
        if (!options.subscription) {
            throw new SettingsError("Could not load setting: subscription.", "options.subscription");
        }

        // ensure that an application is set.
        if (!options.application) {
            throw new SettingsError("Could not load setting: application.", "options.application");
        }

        // ensure that an environment is set.
        if (!options.environment) {
            throw new SettingsError("Could not load setting: environment.", "options.environment");
        }

        if (!options.credentials || !options.credentials.key || !options.credentials.secret) {
            throw new SettingsError("No credentials available", "options.credentials");
        }

        Logger.log.debug("Settings.setDefaults: end.");
    }

    /**
     * Returns the path to the local ini file created by cloco-cli
     * @return {string} [description]
     */
    private static getConfigFilePath(): string {
        return `${FileSystem.getUserHome()}/.cloco/configuration`;
    }
}
