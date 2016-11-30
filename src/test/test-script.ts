/*
 * test-script.ts
 *
 * This is a test script to run the cloco client as an integrated module.
 */
import { ClocoClient } from "../cloco-client";
import { IOptions } from "../types/ioptions";
import * as bunyan from "bunyan";
import { Cache } from "../cache/cache";
import { AesEncryptor } from "../encryption/aes-encryptor";


class AsyncTest {

  private static timer: NodeJS.Timer;

  public static async runAsyncTest(): Promise<void> {
    let logger: bunyan.Logger = bunyan.createLogger({
      level: "trace",
      name: "cloco-node-client (test)",
    });

    let options: IOptions = {
      encryptor: new AesEncryptor("This_is_an_encryption_passphrase"),
      log: logger,
      ttl: 60,
    };

    // initialize the client and load in the configuration.
    let client: ClocoClient = new ClocoClient(options);
    await client.init();
    logger.info("cloco client initialized");

    // check the state of the current cache.
    logger.info(Cache.current);
    logger.info(client.get<any>("default"));

    // write to the cache.
    let updated: any = {foo: "bar", updated: new Date()};
    await client.put<any>("default", updated);
    await client.put<any>("a-third-cob", "some updated text " + new Date().toString());
    await client.put<any>("another-cob", "some encrypted text " + new Date().toString());

    // check the state of the current cache.
    logger.info(Cache.current);
    AsyncTest.timer = setTimeout(() => AsyncTest.keepAlive(), 1000);
  }

  /**
   * Keeps the process alive.
   */
  public static keepAlive(): void {
    console.log(`Keep alive: ${new Date()}`);
    AsyncTest.timer = setTimeout(() => AsyncTest.keepAlive(), 1000);
  }
}


AsyncTest.runAsyncTest()
.then(() => {
  console.log("Exiting test script....");
});
