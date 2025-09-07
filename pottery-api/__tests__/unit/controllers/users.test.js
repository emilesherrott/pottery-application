const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const usersController = require("../../../controllers/users")
const { User } = require("../../../models/User")

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}))

const mockRes = { status: mockStatus }

describe("Users controller", () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe("register", () => {
    it("should return an instance of a potter", async () => {
      const mockReq = {
        body: {
          studioPostcode: "N17",
          username: "emilesherrott",
          firstname: "emile",
          lastname: "sherrott",
          password: "ilovepottery",
        },
      }

      const mockUserResult = {
        potters_id: 1,
        studio_postcode: "N17",
        username: "emilesherrott",
        firstname: "emile",
        lastname: "sherrott",
        password: "ilovepottery",
      }

      jest.spyOn(User, "create").mockResolvedValue(mockUserResult)
      await usersController.register(mockReq, mockRes)

      expect(User.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockSend).toHaveBeenCalledWith(mockUserResult)
    })

    it("should return an error upon failure", async () => {
      jest.spyOn(User, "create").mockRejectedValue(new Error("Missing data"))

      const mockReq = {
        body: {
          studioPostcode: "N17",
          firstname: "emile",
          lastname: "sherrott",
          password: "ilovepottery",
        },
      }

      await usersController.register(mockReq, mockRes)

      expect(User.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith({ error: "Missing data" })
    })
  })

  describe("potterLogin", () => {
    it("should return a token with successful login", async () => {
      const mockReq = {
        body: {
          username: "emilesherrott",
          password: "ilovepottery",
        },
      }

      const mockUserResult = {
        potters_id: 1,
        studio_postcode: "N17",
        username: "emilesherrott",
        firstname: "emile",
        lastname: "sherrott",
        password: "$2b$10$CwTycUXWue0Thq9StjUM0uJ8fs4LZQS6F2c4zY.W5uzmR5O5E7h7W",
      }

      const mockMatch = true
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwb3R0ZXJzSWQiOjEsInVzZXJuYW1lIjoiZW1pbGVzaGVycm90dCIsImlhdCI6MTY5MzQ5MDAwMCwiZXhwIjoxNjkzNDkzNjAwfQ.s3cr3tM0ckS1gn4tur3"

      jest.spyOn(User, "getOnePotterByUsername").mockResolvedValue(mockUserResult)
      jest.spyOn(bcrypt, "compare").mockResolvedValue(mockMatch)
      jest.spyOn(jwt, "sign").mockImplementation((payload, secret, options, callback) => {
        callback(null, mockToken)
      })

      await usersController.potterLogin(mockReq, mockRes)

      expect(User.getOnePotterByUsername).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        token: mockToken,
      })
    })

    it("should return an error if no wrong password given", async () => {
      const mockReq = {
        body: {
          username: "emilesherrott",
          password: "ilovebaking",
        },
      }

      jest.spyOn(User, "getOnePotterByUsername").mockRejectedValue(new Error("Unable to locate user"))

      await usersController.potterLogin(mockReq, mockRes)

      expect(User.getOnePotterByUsername).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(401)
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to locate user" })
    })
  })

  describe("ownerLogin", () => {
    it("should return a token with successful login", async () => {
      const mockReq = {
        body: {
          username: "emilesherrott",
          password: "ilovepottery",
        },
      }

      const mockUserResult = {
        owners_id: 1,
        postcode: "N17",
        username: "emilesherrott",
        firstname: "emile",
        lastname: "sherrott",
        password: "$2b$10$CwTycUXWue0Thq9StjUM0uJ8fs4LZQS6F2c4zY.W5uzmR5O5E7h7W",
      }

      const mockMatch = true
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwb3R0ZXJzSWQiOjEsInVzZXJuYW1lIjoiZW1pbGVzaGVycm90dCIsImlhdCI6MTY5MzQ5MDAwMCwiZXhwIjoxNjkzNDkzNjAwfQ.s3cr3tM0ckS1gn4tur3"

      jest.spyOn(User, "getOneOwnerByUsername").mockResolvedValue(mockUserResult)
      jest.spyOn(bcrypt, "compare").mockResolvedValue(mockMatch)
      jest.spyOn(jwt, "sign").mockImplementation((payload, secret, options, callback) => {
        callback(null, mockToken)
      })

      await usersController.ownerLogin(mockReq, mockRes)

      expect(User.getOneOwnerByUsername).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        token: mockToken,
      })
    })

    it("should return an error if no wrong password given", async () => {
      const mockReq = {
        body: {
          username: "emilesherrott",
          password: "ilovebaking",
        },
      }

      jest.spyOn(User, "getOnePotterByUsername").mockRejectedValue(new Error("Unable to locate user"))

      await usersController.potterLogin(mockReq, mockRes)

      expect(User.getOnePotterByUsername).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(401)
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to locate user" })
    })
  })
})
