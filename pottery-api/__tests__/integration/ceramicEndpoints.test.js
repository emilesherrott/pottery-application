process.env.TEST_ENV = true

const request = require("supertest")
const jwt = require("jsonwebtoken")

const { app } = require("../../app")
const { resetTestDB } = require("./config/config")

const { Ceramic } = require("../../models/Ceramic")

describe("Ceramic API Endpoints", () => {
  let api

  beforeEach(async () => {
    await resetTestDB()
  })

  beforeAll(() => {
    api = app.listen(4000, () => {
      console.log("Test server running on port 4000")
    })
  })

  afterAll((done) => {
    delete process.env.TEST_ENV
    console.log("Gracefully closing server")
    api.close(done)
  })

  describe("GET /ceramics", () => {
    it("responds to GET /ceramics with a body of items", async () => {
      const response = await request(api).get("/ceramics")

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toBeInstanceOf(Object)
      expect(response.body.length).toBeGreaterThan(1)
    })
  })

  describe("GET /ceramics/inventory", () => {
    const mockToken = jwt.sign({ pottersId: 1, username: "testuser" }, process.env.SECRET_TOKEN || "test_secret", { expiresIn: 3600 })

    beforeEach(() => {
      app.use((req, res, next) => {
        req.pottersId = 1
        next()
      })
    })

    it("responds to GET /ceramics with a body of items", async () => {
      const response = await request(api).get("/ceramics/inventory").set("authorisation", mockToken)

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toBeInstanceOf(Object)
      expect(response.body.length).toBeGreaterThan(1)
    })
  })

  describe("POST /ceramics/create", () => {
    const mockToken = jwt.sign({ pottersId: 1, username: "testuser" }, process.env.SECRET_TOKEN || "test_secret", { expiresIn: 3600 })

    beforeEach(() => {
      app.use((req, res, next) => {
        req.pottersId = 1
        next()
      })
    })

    const newCeramic = {
      pieceName: "Tall Vase",
      clay: "Porcelain",
      style: "Vase",
      price: 45,
      size: "30",
    }

    it("responds to POST /ceramics/create with a body of items", async () => {
      const response = await request(api).post("/ceramics/create").set("authorisation", mockToken).send(newCeramic)

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("result");
    expect(response.body.result).toHaveProperty("id");
    expect(response.body.result.piece).toBe(newCeramic.pieceName);
    expect(response.body.result.clay_used).toBe(newCeramic.clay);
    expect(response.body.result.style).toBe(newCeramic.style);
    expect(response.body.result.price).toBe(newCeramic.price);
    expect(response.body.result.size).toBe(newCeramic.size);
    })
  })
})
