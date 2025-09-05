const { User } = require("../../../models/User")
const db = require("../../../database/connect")

describe("User", () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe("getOnePotterById", () => {
    it("resolves with one instance of user", async () => {
      const mockUser = {
        potters_id: 1,
        studio_postcode: "N17",
        postcode: "N17",
        username: "emilesherrott",
        firstname: "Emile",
        lastname: "Sherrott",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockUser] })
      const result = await User.getOnePotterById(1)

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("potters_id", 1)
      expect(result.username).toBe("emilesherrott")
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM potters WHERE potters_id = $1;", [1])
    })

    it("should throw an Error when user is not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(User.getOnePotterById(999)).rejects.toThrow("Unable to locate user")
    })
  })

  describe("getOnePotterByUsername", () => {
    it("resolves with one instance of user", async () => {
      const mockUser = {
        potters_id: 1,
        studio_postcode: "N17",
        postcode: "N17",
        username: "emilesherrott",
        firstname: "Emile",
        lastname: "Sherrott",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockUser] })
      const result = await User.getOnePotterByUsername("emilesherrott")

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("potters_id", 1)
      expect(result.username).toBe("emilesherrott")
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM potters WHERE username = $1;", ["emilesherrott"])
    })

    it("should throw an Error when user is not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(User.getOnePotterById(999)).rejects.toThrow("Unable to locate user")
    })
  })

  describe("getOneOwnerById", () => {
    it("resovles with one instance of user", async () => {
      const mockUser = {
        owners_id: 1,
        studio_postcode: "N17",
        postcode: "N17",
        username: "emilesherrott",
        firstname: "Emile",
        lastname: "Sherrott",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockUser] })
      const result = await User.getOneOwnerById(1)

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("owners_id", 1)
      expect(result.username).toBe("emilesherrott")
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM owners WHERE owners_id = $1;", [1])
    })

    it("should throw an Error when user is not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(User.getOnePotterById(999)).rejects.toThrow("Unable to locate user")
    })
  })

  describe("getOneOwnerByUsername", () => {
    it("resovles with one instance of user", async () => {
      const mockUser = {
        owners_id: 1,
        studio_postcode: "N17",
        postcode: "N17",
        username: "emilesherrott",
        firstname: "Emile",
        lastname: "Sherrott",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockUser] })
      const result = await User.getOneOwnerByUsername("emilesherrott")

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("owners_id", 1)
      expect(result.username).toBe("emilesherrott")
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM owners WHERE username = $1;", ["emilesherrott"])
    })

    it("should throw an Error when user is not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(User.getOnePotterById(999)).rejects.toThrow("Unable to locate user")
    })
  })

  describe("create", () => {
    it("creates a potter with correct data", async () => {
      const mockUserData = {
        studioPostcode: "N17",
        username: "emilesherrott",
        firstname: "Emile",
        lastname: "Sherrott",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx"
      }

      const mockDbResponse = {
        potters_id: 1,
      }

      const mockUser = {
        potters_id: 1,
        studio_postcode: "N17",
        username: "emilesherrott",
        firstname: "Emile",
        lastname: "Sherrott",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx"
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockDbResponse] })
      jest.spyOn(User, "getOnePotterById").mockResolvedValueOnce(new User(mockUser))
      const result = await User.create(mockUserData)

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("potters_id", 1)
      expect(result.username).toBe("emilesherrott")
      expect(db.query).toHaveBeenCalledWith("INSERT INTO potters (username, firstname, lastname, password, studio_postcode) VALUES ($1, $2, $3, $4, $5) RETURNING potters_id;", [mockUserData.username, mockUserData.firstname, mockUserData.lastname, mockUserData.password, mockUserData.studioPostcode])
    })


    it("creates a owner with correct data", async () => {
      const mockUserData = {
        postcode: "N17",
        username: "emilesherrott",
        firstname: "Emile",
        lastname: "Sherrott",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx"
      }

      const mockDbResponse = {
        owners_id: 1,
      }

      const mockUser = {
        owners_id: 1,
        postcode: "N17",
        username: "emilesherrott",
        firstname: "Emile",
        lastname: "Sherrott",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx"
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockDbResponse] })
      jest.spyOn(User, "getOneOwnerById").mockResolvedValueOnce(new User(mockUser))
      const result = await User.create(mockUserData)

      expect(result).toBeInstanceOf(User)
      expect(result).toHaveProperty("owners_id", 1)
      expect(result.username).toBe("emilesherrott")
      expect(db.query).toHaveBeenCalledWith("INSERT INTO owners (username, firstname, lastname, password, postcode) VALUES ($1, $2, $3, $4, $5) RETURNING owners_id;", [mockUserData.username, mockUserData.firstname, mockUserData.lastname, mockUserData.password, mockUserData.postcode])
    })


    it("throws an error with missing data", async () => {
      const incompleteUserData = { username: 'emilesherrott', firstname: 'emile' };
      await expect(User.create(incompleteUserData)).rejects.toThrow('Missing data');
    })
  })
})
