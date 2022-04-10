import { atom, selector } from "recoil";

export const currentEventState = atom({
    key: "CurrentEvent",
    default: null,
});

export const teamListState = selector({
    key: "TeamList",
    get: async ({ get }) => {
        const currentEvent = get(currentEventState);
        if (currentEvent !== null) {
            const response = await fetch(
                `/api/tba/event/${currentEvent.key}/teams`
            ).then((res) => res.json());
            response.sort((a, b) => {
                return a.team_number > b.team_number ? 1 : -1;
            });
            return response;
        }
        return [];
    },
});
