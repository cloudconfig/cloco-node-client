/**
 *   ievent.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Interface to describe an event.
 */


export interface IEvent<TSender, TArgs> {

    subscribe(fn: (sender: TSender, args: TArgs) => void): void;

    unsubscribe(fn: (sender: TSender, args: TArgs) => void): void;
}
