/**
 *   clocoapp.spec.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { ClocoApp, ClocoAppCoreDetails, ConfigObject, Environment } from "./clocoapp";

describe("ClocoApp unit tests", function(): void {

    it("ClocoApp constructor should populate child objects.", function(): void {

        let app: ClocoApp = new ClocoApp();

        expect(app).toBeTruthy();
        expect(app.configObjects).toBeTruthy();
        expect(app.configObjects.length).toEqual(0);
        expect(app.coreDetails).toBeTruthy();
        expect(app.coreDetails instanceof ClocoAppCoreDetails).toBeTruthy();
        expect(app.displayIndex).toEqual(0);
        expect(app.environments).toBeTruthy();
        expect(app.environments.length).toEqual(0);
        expect(app.revisionNumber).toEqual(0);
    });
});
