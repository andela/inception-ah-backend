import { Router } from "express";
import {
  createTag,
  getAllTags,
  searchTags,
  getTag,
  updateTag,
  deleteTag
} from "@controllers/tag";

const tagRouter = Router();

/**
 * @description - Route to get all Tags or all Tags instances that matches the query
 */
tagRouter.get("/tags/:tagId", getTag);

/**
 * @description - Route to get all Tags or all Tags instances that matches the query
 */
tagRouter.get("/tags", getAllTags, searchTags);

/**
 * @description - Route to update a Tag instance
 */
tagRouter.put("/tags/:tagId", updateTag);

/**
 * @description - Route to delete a Tag instance
 */
tagRouter.delete("/tags/:tagId", deleteTag);
export { tagRouter };
