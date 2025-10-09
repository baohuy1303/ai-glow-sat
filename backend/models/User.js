const { z } = require("zod");

const userSchema = z.object({
    email: z.string(),
    password: z.string(),
    emailVerified: z.boolean().default(false),
    role: z.enum(['admin', 'user']).default('user'),
})

module.exports = { userSchema }
