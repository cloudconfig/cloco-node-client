/**
 *   subscription.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 *   class Subscription
 *   Represents a CloCo subscription.
 */
export declare class Subscription {
    subscriptionName: string;
    adminContact: Contact;
    billingAddress: Address;
    billingContact: Contact;
    created: Date;
    customerId: string;
    lastUpdated: Date;
    lastUpdatedBy: string;
    organisation: Organisation;
    revisionNumber: number;
    subscriptionId: string;
    subscriptionPlan: string;
    subscriptionServiceLevel: SubscriptionServiceLevel;
    constructor();
}
/**
 *   class Contact
 *   Represents a person associated with a CloCo account.
 */
export declare class Contact {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mobile: string;
}
/**
 *   class Organisation
 *   Represents an organisation.
 */
export declare class Organisation {
    organisationName: string;
    legalName: string;
    webUrl: string;
    companyNumber: string;
    taxNumber: string;
}
/**
 *   class Address
 *   Represents an address.
 */
export declare class Address {
    buildingName: string;
    buildingNumber: string;
    buildingSubNumber: string;
    street: string;
    district: string;
    town: string;
    region: string;
    postalCode: string;
    country: string;
}
/**
 *   class SubscriptionServiceLevel
 *   Represents the CloCo subscription service level.
 */
export declare class SubscriptionServiceLevel {
    productName: string;
    planName: string;
    description: string;
    monthlyCharge: number;
    maximumApplications: number;
    maximumEnvironments: number;
    maximumObjects: number;
    maximumHistoryVersions: number;
    maximumUsers: number;
    maximumDailyApiRequests: number;
    maximumMessageSize: number;
    enableVersionHistory: boolean;
    enableSnapshots: boolean;
    enableWebhooks: boolean;
    enableUsageStats: boolean;
    enableScheduledDeployments: boolean;
}
