import * as gameService from "./gameService"
import fs from "fs"

jest.mock("fs")
afterEach(() => {
  jest.clearAllMocks()
})

describe("Game service", () => {
  test("should init a deck", () => {
    const deck = gameService.initDeck()
    expect(deck.filter((e) => e === "diamonds").length).toEqual(6)
    expect(deck.filter((e) => e === "gold").length).toEqual(6)
    expect(deck.filter((e) => e === "silver").length).toEqual(6)
    expect(deck.filter((e) => e === "cloth").length).toEqual(8)
    expect(deck.filter((e) => e === "spice").length).toEqual(8)
    expect(deck.filter((e) => e === "leather").length).toEqual(10)
    expect(deck.filter((e) => e === "camel").length).toEqual(11 - 3)
    expect(deck.length).toEqual(52)
  })

  test("should draw cards", () => {
    const deck = gameService.initDeck()
    const topDeck = []
    const nbCard = 5
    const currentLenth = deck.length
    for (let i = 0; i < nbCard; i++) {
      topDeck.push(deck[i])
    }
    const toTest = gameService.drawCards(deck, nbCard)
    for (let i = 0; i < nbCard; i++) {
      expect(toTest[i]).toEqual(topDeck[i])
    }
    expect(deck.length).toEqual(currentLenth - nbCard)
  })

  test("should put camels from hand to herd 1/0", () => {
    const game = {
      _players: [
        { hand: ["camel", "diamonds"], camelsCount: 0 },
        { hand: ["gold", "cloth"], camelsCount: 0 },
      ],
    }
    gameService.putCamelsFromHandToHerd(game)
    expect(game._players[0].hand.length).toBe(1)
    expect(game._players[0].hand).toStrictEqual(["diamonds"])
    expect(game._players[0].camelsCount).toBe(1)

    expect(game._players[1].hand.length).toBe(2)
    expect(game._players[1].hand).toStrictEqual(["gold", "cloth"])
    expect(game._players[1].camelsCount).toBe(0)
  })
  test("should put camels from hand to herd 1/1", () => {
    const game = {
      _players: [
        { hand: ["camel", "diamonds"], camelsCount: 0 },
        { hand: ["camel", "cloth"], camelsCount: 0 },
      ],
    }
    gameService.putCamelsFromHandToHerd(game)
    expect(game._players[0].hand.length).toBe(1)
    expect(game._players[0].hand).toStrictEqual(["diamonds"])
    expect(game._players[0].camelsCount).toBe(1)

    expect(game._players[1].hand.length).toBe(1)
    expect(game._players[1].hand).toStrictEqual(["cloth"])
    expect(game._players[1].camelsCount).toBe(1)
  })
  test("should put camels from hand to herd 0/0", () => {
    const game = {
      _players: [
        { hand: ["cloth", "diamonds"], camelsCount: 0 },
        { hand: ["cloth", "cloth"], camelsCount: 0 },
      ],
    }
    gameService.putCamelsFromHandToHerd(game)
    expect(game._players[0].hand.length).toBe(2)
    expect(game._players[0].hand).toStrictEqual(["cloth", "diamonds"])
    expect(game._players[0].camelsCount).toBe(0)

    expect(game._players[1].hand.length).toBe(2)
    expect(game._players[1].hand).toStrictEqual(["cloth", "cloth"])
    expect(game._players[1].camelsCount).toBe(0)
  })
  test("should put camels from hand to herd 0/1", () => {
    const game = {
      _players: [
        { hand: ["diamonds", "diamonds"], camelsCount: 0 },
        { hand: ["camel", "cloth"], camelsCount: 0 },
      ],
    }
    gameService.putCamelsFromHandToHerd(game)
    expect(game._players[0].hand.length).toBe(2)
    expect(game._players[0].hand).toStrictEqual(["diamonds", "diamonds"])
    expect(game._players[0].camelsCount).toBe(0)

    expect(game._players[1].hand.length).toBe(1)
    expect(game._players[1].hand).toStrictEqual(["cloth"])
    expect(game._players[1].camelsCount).toBe(1)
  })

  /*
  test("En tant que joueur, je peux prendre 1 seule marchandise", () => {
    fs.readFileSync.mockImplementation(() => `[
      {
        id: 1,
        name: "test",
        market: ["camel", "camel", "camel", "diamonds", "diamonds"],
        _deck: [
          "silver",
          "silver",
          "silver",
          "silver",
          "silver",
          "silver",
          "cloth",
          "cloth",
          "cloth",
          "cloth",
          "cloth",
          "cloth",
          "cloth",
          "cloth",
          "spice",
          "spice",
          "spice",
          "spice",
          "spice",
          "spice",
          "spice",
          "spice",
          "leather",
          "leather",
          "leather", "leather", "leather", "leather", "leather", "leather", "leather", "leather",
          "camel", "camel", "camel", "camel", "camel", "camel", "camel", "camel",
        ],
        _players: [
          {
            hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
            camelsCount: 0,
            score: 0,
          },
          {
            hand: ["gold", "gold", "gold", "gold", "gold"],
            camelsCount: 0,
            score: 0,
          },
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
          3: [2, 1, 2, 3, 1, 2, 3],
          4: [4, 6, 6, 4, 5, 5],
          5: [8, 10, 9, 8, 10],
        },
        isDone: false,
      })
    }
    ]`)

    const game = gameService.takeGood(1, 0, "diamonds")
    console.log(game)
    expect(game.market.length).toBe(4)
  }) */
})
