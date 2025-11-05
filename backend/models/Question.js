const { z } = require("zod");

const questionSchema = z.object({
    section: z.string(),
    domain: z.string().optional(),
    skill: z.string().optional(),
    difficulty: z.string().optional(),
    type: z.string(),
    passage: z.string(),
    imagePage: z.string().optional(), // image url
    questionText: z.string(),
    options: z.array(
        z.object({
            label: z.string(),
            text: z.string(),
            explanation: z.string().optional(),
        })
    ).optional(),
    correctAnswer: z.string(),
    aiInsights: z.array(
      z.object({
        embedding: z.array(z.number()),
        response: z.string(),
        sourcePrompt: z.string().optional(), // helps trace why this insight was created
        similarityThreshold: z.number().optional(), // track similarity value when reused
        createdAt: z.string(), // ISO timestamp
        lastUpdated: z.string().optional(),
      })
    ).optional(),
})

module.exports = { questionSchema }