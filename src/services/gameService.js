import * as databaseService from "./databaseService"
import { shuffle } from "lodash"

// Return a shuffled starting deck except 3 camels
export function initDeck() {
  const deck = []
  for (let i = 0; i < 6; i++) deck.push("diamonds")
  for (let i = 0; i < 6; i++) deck.push("gold")
  for (let i = 0; i < 6; i++) deck.push("silver")
  for (let i = 0; i < 8; i++) deck.push("cloth")
  for (let i = 0; i < 8; i++) deck.push("spice")
  for (let i = 0; i < 10; i++) deck.push("leather")
  for (let i = 0; i < 11 - 3; i++) deck.push("camel")
  return shuffle(deck)
}

// Draw {count} cards of a deck
export function drawCards(deck, count = 1) {
  const drawedCards = []
  for (let i = 0; i < count; i++) {
    drawedCards.push(deck.shift())
  }
  return drawedCards
}

// Transfer camels from players hand (_players[i].hand) to their herd (_players[i].camelsCount)
export function putCamelsFromHandToHerd(game) {
  game._players.forEach((player) => {
    let camelIndex = player.hand.findIndex((card) => card === "camel")
    while (camelIndex !== -1) {
      player.hand.splice(camelIndex, 1)
      player.camelsCount++
      camelIndex = player.hand.findIndex((card) => card === "camel")
    }
  })
}

// Create a game object
export function createGame(name) {
  const deck = initDeck()
  const market = ["camel", "camel", "camel", ...drawCards(deck, 2)]
  const game = {
    id: databaseService.getGames().length + 1,
    name,
    market,
    _deck: deck,
    _players: [
      { hand: drawCards(deck, 5), camelsCount: 0, score: 0 },
      { hand: drawCards(deck, 5), camelsCount: 0, score: 0 },
    ],
    currentPlayerIndex: 0,
    tokens: {
      diamonds: [7, 7, 5, 5, 5],
      gold: [6, 6, 5, 5, 5],
      silver: [5, 5, 5, 5, 5],
      cloth: [5, 3, 3, 2, 2, 1, 1],
      spice: [5, 3, 3, 2, 2, 1, 1],
      leather: [4, 3, 2, 1, 1, 1, 1, 1, 1],
    },
    _bonusTokens: {
      3: shuffle([2, 1, 2, 3, 1, 2, 3]),
      4: shuffle([4, 6, 6, 4, 5, 5]),
      5: shuffle([8, 10, 9, 8, 10]),
    },
    isDone: false,
  }
  putCamelsFromHandToHerd(game)
  databaseService.saveGame(game)
  return game
}

export function getAllGames() {
  const games = databaseService.getGames()
  const res = []
  games.forEach((g) => {
    res.push(
      Object.fromEntries(
        Object.entries(g).filter(([key, _]) => !key.startsWith("_"))
      )
    )
  })
  return games
}

export function getGamesForId(id) {
  const games = databaseService.getGames()
  const res = []
  games.forEach((g) => {
    res.push(
      Object.fromEntries(
        Object.entries(g).filter(([key, _]) => !key.startsWith("_"))
      )
    )
  })
  return games.filter((g) => g.id === id)[0]
}

export function deleteGameForId(id) {
  let game = getGamesForId(id)
  if (game !== undefined) {
    databaseService.deleteGame(id)
    game = Object.fromEntries(
      Object.entries(game).filter(([key, _]) => !key.startsWith("_"))
    )
  }

  return game
}
export function takeGood(id, playerIndex, good) {
  const game = databaseService.findGame(id)
  if (playerIndex === game.currentPlayerIndex) {
    if (game._players[playerIndex].hand.length < 7) {
      if (game.market.filter((g) => g === good)[0] === good) {
        // On retire l'item du marché
        game.market.splice(
          game.market.findIndex((card) => card === good),
          1
        )
        console.log(game.market)

        // On ajoute l'item dans la main du joueur
        game._players[playerIndex].hand.push(good)
      }
    }
  }

  return game
}
