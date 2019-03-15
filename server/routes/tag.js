import { Router } from "express";
import {
  getAllTags,
  searchTags,
  getTag,
  updateTag,
  deleteTag
} from "@controllers/tag";
import { validateInput, validateUuid } from "@middlewares";

const tagRouter = Router();

/**
 * @description - Route to get all Tags or all Tags instances that matches the query
 */
tagRouter.get("/", getAllTags, searchTags);

/**
 * Group all similar routes
 */
tagRouter
  .route("/:tagId")

  /**
   * Perform uuid validation check
   */
  .all(validateUuid)

  /**
   * @description - Route to get all Tags or all Tags instances that matches the query
   */
  .get(getTag)

  /**
   * @description - Route to update a Tag instance
   */
  .put(validateInput, updateTag)

  /**
   * @description - Route to delete a Tag instance
   */
  .delete(deleteTag);
export { tagRouter };
