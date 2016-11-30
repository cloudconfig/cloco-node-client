/**
 *   event-dispatcher.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Class for managing subscriptions and dispatching events.
 */
import { IEvent } from "./ievent";

export class EventDispatcher<TSender, TArgs> implements IEvent<TSender, TArgs> {

    private subscriptions: Array<(sender: TSender, args: TArgs) => void> = new Array<(sender: TSender, args: TArgs) => void>();

    public subscribe(fn: (sender: TSender, args: TArgs) => void): void {
        if (fn) {
            this.subscriptions.push(fn);
        }
    }

    public unsubscribe(fn: (sender: TSender, args: TArgs) => void): void {
        let i: number = this.subscriptions.indexOf(fn);
        if (i > -1) {
            this.subscriptions.splice(i, 1);
        }
    }

    public dispatch(sender: TSender, args: TArgs): void {
        for (let handler of this.subscriptions) {
            handler(sender, args);
        }
    }
}
