/**
 *   event-dispatcher.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Class for managing subscriptions and dispatching events.
 */
import { IEvent } from "./ievent";
export declare class EventDispatcher<TSender, TArgs> implements IEvent<TSender, TArgs> {
    private subscriptions;
    subscribe(fn: (sender: TSender, args: TArgs) => void): void;
    unsubscribe(fn: (sender: TSender, args: TArgs) => void): void;
    dispatch(sender: TSender, args: TArgs): void;
}
