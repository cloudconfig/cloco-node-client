/**
 *   api-client-mock.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   cloco client, used to retrieve configuration data.
 */
import * as restify from "restify";
import { Logger } from "../logging/logger";
import { AccessTokenResponse } from "../types/access-token-response";
import { IOptions } from "../types/ioptions";
import { JwtDecoder } from "../jwt-decoder";
import { ClocoApp, ConfigObjectWrapper } from "../types/clocoapp";
import { Settings } from "../settings";
import { TokenRequest } from "../types/token-request";

/**
 * Class to provide static mock functions for the ApiClient
 */
export class ApiClientMock {

  /**
   * Gets a promise of the app, or the error.
   * @param  {ClocoApp}          app The app to return.
   * @param  {Error}             err The error to throw, if required.
   * @return {Promise<ClocoApp>}     A promise of the app.
   */
  public static async getApplication(app: ClocoApp, err?: Error): Promise<ClocoApp> {
    if (err) {
      throw err;
    } else {
      return app;
    }
  }

  /**
   * Gets a promise of the cob, or the error.
   * @param  {ConfigObjectWrapper}          cob The cob to return.
   * @param  {Error}                        err The error to throw, if required.
   * @return {Promise<ConfigObjectWrapper>} A promise of the cob.
   */
  public static async getConfigObject(cob: ConfigObjectWrapper, err?: Error): Promise<ConfigObjectWrapper> {
    if (err) {
      console.log(err);
      throw err;
    } else {
      return cob;
    }
  }

  /**
   * Gets a promise for the updated cob after a PUT to the api.
   * @param  {ConfigObjectWrapper}          cob The cob to return.
   * @param  {Error}                        err An error to throw, if required.
   * @return {Promise<ConfigObjectWrapper>}     A promise of the cob.
   */
  public static async putConfigObject(cob: ConfigObjectWrapper, err?: Error): Promise<ConfigObjectWrapper> {
    if (err) {
      throw err;
    } else {
      return cob;
    }
  }
}
