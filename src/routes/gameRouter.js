import express from "express"
import * as gameService from "../services/gameService"

const router = express.Router()

// Listen to POST /games
router.post("/", function (req, res) {
  if (!req.body.name) {
    return res.status(400).send("Missing name parameter")
  }
  const newGame = gameService.createGame(req.body.name)
  res.status(201).json(newGame)
})

router.get("/", function (req, res) {
  const games = gameService.getAllGames()
  res.status(200).json(games)
})

router.get("/:id", function (req, res) {
  const game = gameService.getGamesForId(parseInt(req.params.id))
  if (game === undefined) {
    return res.status(404).send("Not found")
  }
  res.status(200).json(game)
})

export default router
