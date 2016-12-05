/**
 *   settings.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Static access to local cloco settings.
 */
import * as shell from "shelljs";
import * as fs from "fs";
import { Logger } from "./logging/logger";
import { PassthroughEncryptor } from "./encryption/passthrough-encryptor";
import { SettingsError } from "./settings-error";
import { Tokens } from "./types/tokens";
import { IOptions } from "./types/ioptions";

export class Settings {

/**
 * Loads the default settings from file.
 */
public static setDefaults(options: IOptions): void {

  Logger.log.trace("Settings.setDefaults: start.");

  // default the encryptor to the passthrough encryptor if not set.
  options.encryptor = options.encryptor || new PassthroughEncryptor();

  // load the url from config else use the default cloco one.
  options.url = options.url || Settings.getDefaultUrl() || "https://api.cloco.io";

  // ensure that a subscription is set, either globally or on the options.
  options.subscription = options.subscription || Settings.getDefaultSubscription();
  if (!options.subscription) {
    throw new SettingsError("Could not load setting: subscription.", "options.subscription");
  }

  // ensure that an application is set, either globally or on the options.
  options.application = options.application || Settings.getDefaultApplication();
  if (!options.application) {
    throw new SettingsError("Could not load setting: application.", "options.application");
  }

  // ensure that an environment is set, either globally or on the options.
  options.environment = options.environment || Settings.getDefaultEnvironment();
  if (!options.environment) {
    throw new SettingsError("Could not load setting: environment.", "options.environment");
  }

  // set the interval for checking the cache expiry.
  options.cacheCheckInterval = options.cacheCheckInterval || 5000;

  // check the credentials and load the tokens if appropriate.
  if (!options.tokens) {
    options.tokens = new Tokens();
    options.tokens.accessToken = Settings.getBearerToken();
    options.tokens.refreshToken = Settings.getRefreshToken();
  }

  if (!options.credentials) {
    if (!options.tokens.accessToken) {
      throw new SettingsError("Could not load bearer token.", "options.tokens.accessToken");
    }

    if (!options.tokens.refreshToken) {
      throw new SettingsError("Could not load refresh token.", "options.tokens.refreshToken");
    }
  }

  Logger.log.trace("Settings.setDefaults: end.");
}

  /**
   * Reads the bearer token from the local config store.
   * @return {string} The bearer token.
   */
  public static getBearerToken(): string {
    return Settings.readFileContent("~/.cloco/config/cloco_token");
  }

/**
 * Stores the bearer token in the local config store.
 * @param {string} token The bearer token.
 */
  public static storeBearerToken(token: string): void {
    Settings.ensureLocalDirs();
    let s: any = shell as any; // incorrect typing.
    s.echo(token).to("~/.cloco/config/cloco_token");
  }

  /**
   * Gets the refresh token from the local config store.
   * @return {string} The refresh token.
   */
    public static getRefreshToken(): string {
      return Settings.readFileContent("~/.cloco/config/cloco_refresh_token");
    }

    /**
     * Gets the default subscription from the local config store.
     * @return {string} The subscription id.
     */
      public static getDefaultSubscription(): string {
        return Settings.readFileContent("~/.cloco/config/subscription");
      }

    /**
     * Gets the default application from the local config store.
     * @return {string} The application id.
     */
      public static getDefaultApplication(): string {
        return Settings.readFileContent("~/.cloco/config/application");
      }

    /**
     * Gets the default environment from the local config store.
     * @return {string} The environment id.
     */
      public static getDefaultEnvironment(): string {
        return Settings.readFileContent("~/.cloco/config/environment");
      }

    /**
     * Gets the default cloco API url from the local store (for on-prem installations).
     * @return {string} The default cloco API url.
     */
      public static getDefaultUrl(): string {
        return Settings.readFileContent("~/.cloco/config/url");
      }

    /**
     * Reads the content from a file.
     * @param  {string} path The path of the file.
     * @return {string}      The contents of the file.
     */
    private static readFileContent(path: string): string {
      Settings.ensureLocalDirs();
      if (shell.test("-f", path)) {
        let content: string = shell.cat(path);
        content = content.replace(/\n$/, "");
        return content;
      } else {
        return undefined;
      }
    }

    /**
     * Ensures that the local config directories exist.
     */
    private static ensureLocalDirs(): void {
        let path: string = "~/.cloco/config";
        shell.mkdir("-p", path);

        path = "~/.cloco/cache";
        shell.mkdir("-p", path);
    }
}
