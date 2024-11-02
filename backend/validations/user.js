const { z } = require("zod");

const userSignupSchema = z.object({
  username: z.string().min(3, "username must have atleast 3 characters"),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string().min(3, "password must be atleast 6 characters long"),
});

const userSigninSchema = z.object({
  username: z.string().min(3, "username must have atleast 3 characters"),
  password: z.string().min(3, "password must be atleast 6 characters long"),
});

const userEditSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  password: z.string().optional(),
});

module.exports = { userSignupSchema, userSigninSchema, userEditSchema };
