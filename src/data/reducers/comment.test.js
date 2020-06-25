import { fakeComment, LOAD_COMMENT, reducer, defaultState } from "./comment";
import firebase from "firebase";
import { mockFirebase } from "firestore-jest-mock";

import * as user from "./user";

user.watchUser = jest.fn();

describe("comment", () => {
  describe("fakeComment", () => {
    mockFirebase({
      database: {
        users: {
          "81923j4kjakdfafd": {
            displayName: "Test User",
            photoURL: "",
          },
        },
      },
    });
    const dispatch = jest.fn();
    const data = {
      key: "8jkj134hjj1234",
      createdBy: "81923j4kjakdfafd",
      text: "Test problem",
      time: firebase.firestore.Timestamp.fromMillis(Date.now()),
      base: true,
    };
    var f = fakeComment(data)(dispatch);
    it("should watch the user", () => {
      expect(user.watchUser).toHaveBeenCalledWith(data.createdBy);
    });
    it("should dispatch a new comment", () => {
      expect(dispatch).toHaveBeenLastCalledWith({
        type: LOAD_COMMENT,
        payload: data,
      });
    });
  });

  describe("reducer", () => {
    it("should return the default state", () => {
      expect(reducer(undefined, {})).toEqual(defaultState);
    });
    it("should handle LOAD_COMMENT", () => {
      const expected = {
        test: {
          createdBy: "jkajsdf8jkje4234",
          deleted: false,
          problemID: "asdfhfg34vasdf12",
          text: "Test message",
          time: firebase.firestore.Timestamp.fromMillis(Date.now()),
          base: false,
          type: "text",
        },
      };
      const commentData = {
        key: "test",
        ...expected.test,
      };
      expect(
        reducer(undefined, {
          type: LOAD_COMMENT,
          payload: commentData,
        })
      ).toEqual(expected);
    });
  });
});
