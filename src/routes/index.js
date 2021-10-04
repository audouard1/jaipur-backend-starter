import express from "express"

import healthRouter from "./healthRouter"
import gameRouter from "./gameRouter"

const router = express.Router()

router.use("/health", healthRouter)
router.use("/games", gameRouter)

export default router
