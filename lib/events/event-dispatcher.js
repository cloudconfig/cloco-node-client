"use strict";
class EventDispatcher {
    constructor() {
        this.subscriptions = new Array();
    }
    subscribe(fn) {
        if (fn) {
            this.subscriptions.push(fn);
        }
    }
    unsubscribe(fn) {
        let i = this.subscriptions.indexOf(fn);
        if (i > -1) {
            this.subscriptions.splice(i, 1);
        }
    }
    dispatch(sender, args) {
        for (let handler of this.subscriptions) {
            handler(sender, args);
        }
    }
}
exports.EventDispatcher = EventDispatcher;
