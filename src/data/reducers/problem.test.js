import { reducer, defaultState, actionTypes } from "./problem";

describe("problem", () => {
  describe("reducer", () => {
    it("should return the default state", () => {
      expect(reducer(undefined, {})).toEqual(defaultState);
    });
    it("should handle EDIT_REPLY", () => {
      expect(
        reducer(undefined, {
          type: actionTypes.EDIT_REPLY,
          payload: {
            text: "Test",
          },
        })
      ).toEqual({
        ...defaultState,
        replyText: "Test",
      });
    });
  });
});
