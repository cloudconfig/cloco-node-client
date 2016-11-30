"use strict";
/**
 *   index.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   entry point into the cloco client.
 */
const cloco_client_1 = require("./cloco-client");
const aes_encryptor_1 = require("./encryption/aes-encryptor");
function createClient(options) {
    return new cloco_client_1.ClocoClient(options);
}
exports.createClient = createClient;
function createAesEncryptor(encryptionKey) {
    return new aes_encryptor_1.AesEncryptor(encryptionKey);
}
exports.createAesEncryptor = createAesEncryptor;
var cloco_client_2 = require("./cloco-client");
exports.ClocoClient = cloco_client_2.ClocoClient;
