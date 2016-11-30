/**
 *   subscription.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
"use strict";
/**
 *   class Subscription
 *   Represents a CloCo subscription.
 */
class Subscription {
    constructor() {
        this.subscriptionServiceLevel = new SubscriptionServiceLevel();
        this.organisation = new Organisation();
        this.billingContact = new Contact();
        this.billingAddress = new Address();
        this.adminContact = new Contact();
    }
}
exports.Subscription = Subscription;
/**
 *   class Contact
 *   Represents a person associated with a CloCo account.
 */
class Contact {
}
exports.Contact = Contact;
/**
 *   class Organisation
 *   Represents an organisation.
 */
class Organisation {
}
exports.Organisation = Organisation;
/**
 *   class Address
 *   Represents an address.
 */
class Address {
}
exports.Address = Address;
/**
 *   class SubscriptionServiceLevel
 *   Represents the CloCo subscription service level.
 */
class SubscriptionServiceLevel {
}
exports.SubscriptionServiceLevel = SubscriptionServiceLevel;
