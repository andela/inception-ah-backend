import Joi from "joi";

export const reactionSchema = Joi.object().keys({
  reaction: Joi.boolean()
    .required()
    .label("Reaction")
});
