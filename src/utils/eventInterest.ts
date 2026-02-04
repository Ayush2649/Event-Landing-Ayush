const INTERESTED_EVENTS_KEY = "interested_events";

const getIntegerestedEvents = (): string[] => {
    const storedEvents = localStorage.getItem(INTERESTED_EVENTS_KEY);

    if(!storedEvents) {
        return [];
    }
    
    return JSON.parse(storedEvents);
}

export const toggleEventInterested = (eventId : string) => {
    let events: string[] = getIntegerestedEvents();

    if(events.includes(eventId)){
        events = events.filter((id) => id !== eventId);
    } else {
        events.push(eventId);
    }

    localStorage.setItem(INTERESTED_EVENTS_KEY, JSON.stringify(events));
}

export const isEventInterested = (eventId : string) => {
    const events = getIntegerestedEvents();
    return events.includes(eventId);
}