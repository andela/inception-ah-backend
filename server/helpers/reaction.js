import {
  LIKE_REACTION,
  DISLIKE_REACTION,
  LIKE_COUNT,
  DISLIKE_COUNT
} from "@helpers/constants";

export const typeOfReaction = reaction => {
  switch (reaction) {
    case true:
      return {
        type: LIKE_REACTION,
        count: LIKE_COUNT
      };
    case false:
      return {
        type: DISLIKE_REACTION,
        count: DISLIKE_COUNT
      };
    default:
      return null;
  }
};
