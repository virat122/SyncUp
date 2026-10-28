const Joi = require('joi');

const createUserSchema = Joi.object({
    // name: Joi.string()
    //     .trim()
    //     .min(2)
    //     .max(100)
    //     .optional(),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .max(254)
        .optional()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.max': 'Email must not exceed 254 characters'
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^\+?[1-9]\d{7,14}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),

    // password: Joi.string()
    //     .min(12)
    //     .max(128)
    //     .optional()
    //     .messages({
    //         'string.min': 'Password must be at least 12 characters long',
    //         'string.max': 'Password must not exceed 128 characters'
    //     })
})
    .or('email', 'phone')
    .messages({
        'object.missing': 'Either email or phone number is required'
    })
    .required();



const userIdParamsSchema = Joi.object({
    userId: Joi.string()
        .uuid()
        .required()
}).required();

const listUsersQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20),

    search: Joi.string()
        .trim()
        .max(100)
        .optional()
});

module.exports = {
    createUserSchema,
    userIdParamsSchema,
    listUsersQuerySchema
};