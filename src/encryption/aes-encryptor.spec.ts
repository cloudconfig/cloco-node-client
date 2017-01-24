/**
 *   aes-encryptor.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { AesEncryptor } from "./aes-encryptor";
import { EncryptionError } from "./encryption-error";
import { Logger } from "../logging/logger";

describe("AesEncryptor unit tests", function(): void {



    // initialize the connection.
    beforeEach(function(): void {
        Logger.init({});
    });

    it("object should encrypt successfully.", function(): void {

        let input: any = {
          foo: "bar",
        };

        let key: string = "an-encryption-string";
        let encryptor: AesEncryptor = new AesEncryptor(key);

        let encrypted: string = encryptor.encrypt(JSON.stringify(input));

        let expected: string = "Lt3A+JtoGTOeONv7J1VHzQ==";

        expect(encrypted).toEqual(expected);
    });

    it("object should decrypt successfully.", function(): void {

        let encrypted: string = "lzf/qL5Vqdt5SJNMhsevsQ==";

        let key: string = "an-encryption-string";
        let encryptor: AesEncryptor = new AesEncryptor(key);

        let decrypted: any = encryptor.decrypt(encrypted);
        decrypted = JSON.parse(decrypted);

        expect(decrypted.foo).toEqual("bar");
    });

    it("object encrypted with different key should fail.", function(): void {

        let key: string = "an-encryption-string";
        let key2: string = "an-alternative-encryption-string";
        let encryptor: AesEncryptor = new AesEncryptor(key2);

        let encrypted: string = "lzf/qL5Vqdt5SJNMhsevsQ==";

        try {
            let decrypted: any = encryptor.decrypt(encrypted);
            decrypted = JSON.parse(decrypted);
            fail("Expect JSON.parse to fail.");
        } catch (e) {
          expect(e instanceof EncryptionError).toBeTruthy();
        }
    });

    it("should decrypt json data encrypted from command line openssl", function(): void {
      // tslint:disable-next-line:max-line-length
      let encrypted: string = "829ysS1Qukke6bmLN/P8I//fREfixZW0P4bfjaj6tN3EbQ7HqsT6+O3P5DbFa5FW+86HvGBcqHa4pmzsLRBZVf1vHezDwzZ5f/XpsdMv4loTrkSe6HxGNgjxcyLN+s4CCRpl+cKmCNr98HTv6E/KN/Vi8PlBYzLUHe+8UHO5IRCQjf3qcneOq1O8uMCauRh07UvUgflg113LK8wEYSi0cVMTI2QmlZpidLFFUftlDo/RbB//btt7hpWMhm3pZ8BIcmF4OCPFYUir6vQ9a8eGUC+0Uu7w02LRzM/qfmuedzCuc7DrZua4k9zI1F5Lv3ULBcwFMkbrmsZKl3dXGZ3TtiQq74ukwUGRWmPOi/2q0JbXJoX0F0MOe7mmcgryv372QmXQx/v5YwU9QNzsm9nVu2uILMMuFDjCGeYjOGww1AfAEMZIoTiilZSXQYyRNAAb0EbfvcVz7Vspel3IDl1CmnEWjXCzKkgIXNVx4bG7BXEiXCj3WU/nOiAlpmnYWhz/ZO3zHkr2Pph6RGNRtfyzfZL2CDele7cd4k3YBIWFjvHqDSmSmucRLKPXN3rcYh8neUePEp4EU1h5/zmiAxUzDuN2x6Kp8FZad50Pjzo+U7surtimB86U5giLhT+BNWfghTeG94rENONnAso7BBPE8bKdrySf1Gbmllm+Ff7lfVuWoBsVnxMzPcxu1ODpvYZiZ7eipZ7TRhFkaJKNDFcEzusXj6HGEAFBnxbm2yl/p0VPzL5FgtuAHjtrO8jG4KsfmEW3mrf4qifzR11U03BbzmPhIOHhvjD1unHKZo6NxUpT2q5g1GVSpAjDmDepWUgOR6Vuo0vXRLCA9h6GDjb9Cz/8LJOOs6m2AA4dddcgorEwkHAtvILfW9kmqxeq19Q2Puph/tlwu2n8F8lq67uDeiU+KQXw9uOQ1yKR+pxBViwoMXpl4bMqy0GbSrObXKcHNvofGcAuL4bbuCvv09X4ncVc6MDpZFYeRHYVnMfiIiIRduzfncceeoUfxWHF+FPwsexIyfAYm/OrqvgwrQJwYvykjnBQRKjLPwVUcv4a78ElqKSrTJWmsV0/pBAdBTrfTa585mNKeK2H3kEh0O0k3cYOB3xbCXQJkr60g+pYvjg5h69srjpS9OGDMNrcx+zumqB+3f4vJ506AZKOaZ+Wtm4eb3WBmd1he3f+pWt4d5+sdRV4FPFrf9nnpT9SleBAYy1xunBbmJAIJD1F2J01lgCfbOokB8VpO7vpcXjaDu25mf+peHWu6CNTKJIo9by0N6NJFPJMFoc92wNj3pNlQA==";
      let key: string = "cloco-test-123";
      let encryptor: AesEncryptor = new AesEncryptor(key);

      let decrypted: any = encryptor.decrypt(encrypted);
      decrypted = JSON.parse(decrypted);
    });
});
