/**
 *   event-dispatcher.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { EventDispatcher } from "./event-dispatcher";

describe("EventDispatcher unit tests", function(): void {

    it("function should be added to the subscriptions array and dispatched.", function(): void {

        let called: boolean = false;
        let calledA: string = undefined;
        let calledB: string = undefined;

        let onEvent: EventDispatcher<string, string> = new EventDispatcher<string, string>();
        onEvent.subscribe((a: string, b: string): void => {
          called = true;
          calledA = a;
          calledB = b;
        });

        onEvent.dispatch("sender", "args");

        expect(called).toBeTruthy();
        expect(calledA).toEqual("sender");
        expect(calledB).toEqual("args");
    });

    it("undefined function should not be added to the subscriptions array.", function(): void {

        let called: boolean = false;
        let calledA: string = undefined;
        let calledB: string = undefined;

        let func: any = (a: string, b: string): void => {
          called = true;
          calledA = a;
          calledB = b;
        };

        // null the function
        // tslint:disable-next-line:no-null-keyword
        func = null;

        let onEvent: EventDispatcher<string, string> = new EventDispatcher<string, string>();
        onEvent.subscribe(func);

        onEvent.dispatch("sender", "args");

        expect(called).toBeFalsy();
        expect(calledA).toBeFalsy();
        expect(calledB).toBeFalsy();
    });

    it("unsubscribed function should not be called.", function(): void {

        let called: boolean = false;
        let calledA: string = undefined;
        let calledB: string = undefined;

        let func: any = (a: string, b: string): void => {
          called = true;
          calledA = a;
          calledB = b;
        };

        let onEvent: EventDispatcher<string, string> = new EventDispatcher<string, string>();
        onEvent.subscribe(func);
        onEvent.unsubscribe(func);

        onEvent.dispatch("sender", "args");

        expect(called).toBeFalsy();
        expect(calledA).toBeFalsy();
        expect(calledB).toBeFalsy();
    });

    it("never subscribed, unsubscribed function should not error.", function(): void {

        let called: boolean = false;
        let calledA: string = undefined;
        let calledB: string = undefined;

        let func: any = (a: string, b: string): void => {
          called = true;
          calledA = a;
          calledB = b;
        };

        let onEvent: EventDispatcher<string, string> = new EventDispatcher<string, string>();
        onEvent.unsubscribe(func);

        onEvent.dispatch("sender", "args");

        expect(called).toBeFalsy();
        expect(calledA).toBeFalsy();
        expect(calledB).toBeFalsy();
    });
});
