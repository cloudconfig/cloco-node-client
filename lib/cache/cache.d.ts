import { CacheItem } from "./cache-item";
/**
 *   class Cache
 *   Represents a cache for configuration objects.
 */
export declare class Cache {
    static current: Cache;
    items: CacheItem[];
    /**
     * Static constructor for the cache singleton.
     */
    static init(): void;
    /**
     * Adds an item to the cache.
     * @param {CacheItem} item A cache item.
     */
    add(item: CacheItem): void;
    /**
     * Adds an item by creating the cache item then adding to the cache.
     * @param {string} key   The key.
     * @param {any}    value The item to add.
     * @param {number} revision   The item's revision number.
     * @param {number} ttl   The TTL of the item in cache.
     */
    addItem(key: string, value: any, revision: number, ttl?: number): CacheItem;
    /**
     * Gets an item from the cache.
     * @param  {string} key The item key.
     * @return {CacheItem}  The cache item.
     */
    get(key: string): CacheItem;
    /**
     * Checks for the existence of the item in the cache.
     * @param  {string}  key The key of the item.
     * @return {boolean}     A value indicating whether the item exists in the cache.
     */
    exists(key: string): boolean;
    /**
     * Removes the cache item from the array.
     * @param {string} key The key of the cache item to remove.
     */
    remove(key: string): void;
}
