import {isEventInterested, toggleEventInterested} from '../eventInterest';

describe("Event Interested Feature", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should return false when the event is not being selected as interested", () => {
        const result = isEventInterested("event_1");

        expect(result).toBe(false);
    });

    it("should return true if an event is being toggled to interested", () => {
        toggleEventInterested("event_1");
        const result = isEventInterested("event_1");

        expect(result).toBe(true);
    });

    it("should return false when the event is toggled twice", () => {
        toggleEventInterested("event_1");
        toggleEventInterested("event_1");
        const result = isEventInterested("event_1");
        
        expect(result).toBe(false);
    })
});