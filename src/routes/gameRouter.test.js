import request from "supertest"
import app from "../app"
import lodash from "lodash"
import fs from "fs"

jest.mock("lodash")
lodash.shuffle.mockImplementation((x) => x)
// Prevent database service to write tests game to filesystem
jest.mock("fs")
afterEach(() => {
  jest.clearAllMocks()
})

// TODO: Prevent shuffle for tests

describe("Game router", () => {
  test("should create a game", async () => {
    const response = await request(app).post("/games").send({ name: "test" })
    expect(response.statusCode).toBe(201)
    console.log(response.body._players[1].hand)
    expect(response.body.name).toBe("test")
    expect(response.body).toEqual({
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
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
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
  })
  test("should not creat game if no name", async () => {
    const response = await request(app).post("/games").send({ name: "" })
    expect(response.statusCode).toBe(400)
  })
  test("should get all games", async () => {
    let response = await request(app).get("/games")
    expect(response.body.length).toEqual(0)
    fs.readFileSync.mockImplementation(() => `[{"id": 1}, {"id": 1}]`)
    response = await request(app).get("/games")
    expect(response.body.length).toEqual(2)
  })
  test("should get game by id and get 200", async () => {
    fs.readFileSync.mockImplementation(
      () =>
        `[{"id":1,"name":"dolore est","market":["camel","camel","camel","leather","cloth"],"_deck":["leather","spice","silver","diamonds","spice","silver","cloth","leather","spice","cloth","leather","silver","spice","leather","gold","camel","camel","gold","spice","diamonds","leather","camel","gold","gold","diamonds","spice","leather","camel","cloth","silver","spice","leather","camel","gold","gold","diamonds","silver","spice","cloth","diamonds"],"_players":[{"hand":["cloth","diamonds","cloth","silver","cloth"],"camelsCount":0,"score":0},{"hand":["leather","leather"],"camelsCount":3,"score":0}],"currentPlayerIndex":0,"tokens":{"diamonds":[7,7,5,5,5],"gold":[6,6,5,5,5],"silver":[5,5,5,5,5],"cloth":[5,3,3,2,2,1,1],"spice":[5,3,3,2,2,1,1],"leather":[4,3,2,1,1,1,1,1,1]},"_bonusTokens":{"3":[2,1,2,3,3,1,2],"4":[6,5,4,4,6,5],"5":[10,10,8,8,9]},"isDone":false}]`
    )
    const response = await request(app).get("/games/1")
    expect(response.statusCode).toEqual(200)
    expect(response.body === undefined).toEqual(false)
  })
  test("should get game by id and get 404", async () => {
    fs.readFileSync.mockImplementation(
      () =>
        `[{"id":1,"name":"dolore est","market":["camel","camel","camel","leather","cloth"],"_deck":["leather","spice","silver","diamonds","spice","silver","cloth","leather","spice","cloth","leather","silver","spice","leather","gold","camel","camel","gold","spice","diamonds","leather","camel","gold","gold","diamonds","spice","leather","camel","cloth","silver","spice","leather","camel","gold","gold","diamonds","silver","spice","cloth","diamonds"],"_players":[{"hand":["cloth","diamonds","cloth","silver","cloth"],"camelsCount":0,"score":0},{"hand":["leather","leather"],"camelsCount":3,"score":0}],"currentPlayerIndex":0,"tokens":{"diamonds":[7,7,5,5,5],"gold":[6,6,5,5,5],"silver":[5,5,5,5,5],"cloth":[5,3,3,2,2,1,1],"spice":[5,3,3,2,2,1,1],"leather":[4,3,2,1,1,1,1,1,1]},"_bonusTokens":{"3":[2,1,2,3,3,1,2],"4":[6,5,4,4,6,5],"5":[10,10,8,8,9]},"isDone":false}]`
    )
    const response = await request(app).get("/games/7")
    expect(response.statusCode).toEqual(404)
  })

  test("Création de la route PUT /games/[id]/take-good", async () => {
    const game = await request(app).post("/games").send({ name: "test" })
    const response = await request(app).put("/games/"+game.body.id+"/take-good").set('playerIndex', '1').send({ takeGoodPayload: { good: "diamonds"}})
    expect(response.statusCode).toBe(200)
  })

})
