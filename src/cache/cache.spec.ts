/**
 *   cache-client.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   unit tests for the cache.
 */
import { Cache } from "./cache";
import { CacheItem } from "./cache-item";
import { Logger } from "../logging/logger";

describe("Cache unit tests", function(): void {

    // initialize.
    beforeEach(function(): void {
        Logger.init({});
    });

    it("add: cache item should be added successfully.", function(): void {

        let item: CacheItem = new CacheItem();
        item.key = "test";
        item.value = "value";

        let cache: Cache = new Cache();
        cache.add(item);

        expect(cache.items.length).toEqual(1);
        expect(cache.items[0].value).toEqual("value");
        expect(cache.items[0].expires).toBeFalsy();
    });

    it("add: cache with no items array should be add successfully.", function(): void {

        let item: CacheItem = new CacheItem();
        item.key = "test";
        item.value = "value";

        let cache: Cache = new Cache();
        cache.items = undefined;
        cache.add(item);

        expect(cache.items.length).toEqual(1);
        expect(cache.items[0].value).toEqual("value");
        expect(cache.items[0].expires).toBeFalsy();
    });

    it("add: cache item with zero TTL should be added successfully and have expiry.", function(): void {

        let item: CacheItem = new CacheItem();
        item.key = "test";
        item.value = "value";
        item.ttl = 0;

        let cache: Cache = new Cache();
        cache.add(item);

        expect(cache.items.length).toEqual(1);
        expect(cache.items[0].value).toEqual("value");
        expect(cache.items[0].expires).toBeTruthy();
    });

    it("add: cache item with +ve TTL should be added successfully and have expiry.", function(): void {

        let item: CacheItem = new CacheItem();
        item.key = "test";
        item.value = "value";
        item.ttl = 60;

        let cache: Cache = new Cache();
        cache.add(item);

        expect(cache.items.length).toEqual(1);
        expect(cache.items[0].value).toEqual("value");
        expect(cache.items[0].expires).toBeTruthy();
    });

    it("add: cache item should be updated successfully.", function(): void {

        let item: CacheItem = new CacheItem();
        item.key = "test";
        item.value = "value";

        let cache: Cache = new Cache();
        cache.items = [{key: "test", value: "old"} as CacheItem];
        cache.add(item);

        expect(cache.items.length).toEqual(1);
        expect(cache.items[0].value).toEqual("value");
    });

    it("remove: cache item should be removed successfully.", function(): void {

        let cache: Cache = new Cache();
        cache.items = [{key: "test", value: "old"} as CacheItem];
        cache.remove("test");

        expect(cache.items.length).toEqual(0);
    });

    it("remove: cache item not existing should remove without error.", function(): void {

        let cache: Cache = new Cache();
        cache.items = [{key: "test", value: "old"} as CacheItem];
        cache.remove("foo");

        expect(cache.items.length).toEqual(1);
    });

    it("remove: cache with no items array should remove without error.", function(): void {

        let cache: Cache = new Cache();
        cache.items = undefined;
        cache.remove("foo");

        expect(cache.items).toBeFalsy();
    });

    it("isExpired: cache item should not be expired if no expires set", function(): void {

      let item: CacheItem = new CacheItem();
      item.key = "test";
      item.value = "value";
      expect(item.isExpired()).toBeFalsy();

    });

    it("isExpired: cache item should not be expired if future expires set", function(): void {

      let item: CacheItem = new CacheItem();
      item.key = "test";
      item.value = "value";
      item.expires = new Date();
      item.expires.setTime(item.expires.getTime() + 5);
      expect(item.isExpired()).toBeFalsy();
    });

    it("isExpired: cache item should be expired if past expires set", function(): void {

      let item: CacheItem = new CacheItem();
      item.key = "test";
      item.value = "value";
      item.expires = new Date();
      item.expires.setTime(item.expires.getTime() - 5);
      expect(item.isExpired()).toBeTruthy();
    });

    it("isExpired: cache item should be expired immediate expires set", function(): void {

      let item: CacheItem = new CacheItem();
      item.key = "test";
      item.value = "value";
      item.expires = new Date();
      expect(item.isExpired()).toBeFalsy();
    });

    it("exists: existing cache item should return true", function(): void {

      let item: CacheItem = new CacheItem();
      item.key = "test";
      item.value = "value";
      item.expires = new Date();

      let cache: Cache = new Cache();
      cache.items = [item];

      expect(cache.exists("test")).toBeTruthy();
    });

    it("exists: non-existing cache item should return false", function(): void {

      let item: CacheItem = new CacheItem();
      item.key = "test";
      item.value = "value";
      item.expires = new Date();

      let cache: Cache = new Cache();
      cache.items = [item];

      expect(cache.exists("unknown")).toBeFalsy();
    });

    it("exists: empty cache should return false", function(): void {

      let cache: Cache = new Cache();
      cache.items = [];

      expect(cache.exists("unknown")).toBeFalsy();
    });

    it("exists: undefined cache should return false", function(): void {

      let cache: Cache = new Cache();
      cache.items = [];

      expect(cache.exists("unknown")).toBeFalsy();
    });

    it("get: existing cache item should be returned", function(): void {

      let item: CacheItem = new CacheItem();
      item.key = "test";
      item.value = "value";
      item.expires = new Date();

      let cache: Cache = new Cache();
      cache.items = [item];

      let value: any = cache.get("test");

      expect(value).toBeTruthy();
      expect(value.value).toEqual("value");
    });

    it("get: non-existing cache item should return undefined", function(): void {

      let item: CacheItem = new CacheItem();
      item.key = "test";
      item.value = "value";
      item.expires = new Date();

      let cache: Cache = new Cache();
      cache.items = [item];

      expect(cache.get("unknown")).toBeFalsy();
    });
});
