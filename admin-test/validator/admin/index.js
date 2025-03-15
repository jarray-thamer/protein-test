const Joi = require("joi");

exports.adminLoginSchema = Joi.object({
  username: Joi.string().min(5).max(12).required().messages({
    "string.empty": "Username is required!",
    "string.min": "Username must be at least 5 characters long!",
    "string.max": "Username must not exceed 12 characters!",
    "any.required": "Username is required!",
  }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.empty": "Password is required!",
    "string.min": "Password must be at least 8 characters long!",
    "string.max": "Password must not exceed 20 characters!",
    "any.required": "Password is required!",
  }),
});

exports.clientLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Please provide a valid email address!",
    "any.required": "Email is required!",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required!",
    "string.min": "Password must be at least 6 characters long!",
    "any.required": "Password is required!",
  }),
});

exports.clientRegisterSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.empty": "Name is required!",
    "string.min": "Name must be at least 2 characters long!",
    "any.required": "Name is required!",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Please provide a valid email address!",
    "any.required": "Email is required!",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required!",
    "string.min": "Password must be at least 6 characters long!",
    "any.required": "Password is required!",
  }),
  phone1: Joi.string().allow("").optional(),
  phone2: Joi.string().allow("").optional(),
  ville: Joi.string().allow("").optional(),
  address: Joi.string().allow("").optional(),
});
