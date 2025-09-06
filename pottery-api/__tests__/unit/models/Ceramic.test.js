const { Ceramic } = require("../../../models/Ceramic")
const db = require("../../../database/connect")

describe("Ceramic", () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe("getAll", () => {
    it("resolves with array of ceramic instances", async () => {
      const mockCeramics = [
        {
          ceramics_id: 1,
          piece_name: "Tall pinch jar",
          clay: "Stoneware",
          style: "Jar",
          price: "12",
          size: "23",
          firstname: "emile",
          lastname: "sherrott",
        },
        {
          ceramics_id: 2,
          piece_name: "Small pinch jar",
          clay: "Stoneware",
          style: "Jar",
          price: "7",
          size: "15",
          firstname: "emile",
          lastname: "sherrott",
        },
        {
          ceramics_id: 3,
          piece_name: "Small pinch bowl",
          clay: "Stoneware",
          style: "Bowl",
          price: "8",
          size: "12",
          firstname: "emile",
          lastname: "sherrott",
        },
        {
          ceramics_id: 4,
          piece_name: "Shallow plate",
          clay: "Porcelain",
          style: "Plate",
          price: "10",
          size: "13",
          firstname: "edward",
          lastname: "stephan",
        },
      ]

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockCeramics })
      const result = await Ceramic.getAll()

      expect(result).toBeInstanceOf(Array)
      expect(result[0]).toBeInstanceOf(Ceramic)
      expect(result[0]).toHaveProperty("id", 1)
      expect(result[0]).toHaveProperty("piece", "Tall pinch jar")
      expect(db.query).toHaveBeenCalledWith(`
        SELECT 
            ceramics.ceramics_id,
            ceramics.piece_name, 
            ceramics.clay, 
            ceramics.style, 
            ceramics.price, 
            ceramics.size, 
            potters.firstname, 
            potters.lastname
        FROM 
            ceramics
        JOIN 
            potters ON ceramics.piece_name_potter_id = potters.potters_id;
        `)
    })

    it("should throw an Error when user is not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(Ceramic.getAll()).rejects.toThrow("Ceramic pieces not found")
    })
  })

  describe("getInventory", () => {
    it("resolves with cermaics instance from potter", async () => {
      const mockCeramics = {
        ceramics_id: 4,
        piece_name: "Shallow plate",
        clay: "Porcelain",
        style: "Plate",
        price: "10",
        size: "13",
        firstname: "edward",
        lastname: "stephan",
        piece_name_owner_id: 1,
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockCeramics] })
      const result = await Ceramic.getInventory(1)

      expect(result).toBeInstanceOf(Array)
      expect(result[0]).toBeInstanceOf(Ceramic)
      expect(result[0].clay_used).toBe("Porcelain")
      expect(result[0]).toHaveProperty("creator", "edward stephan")
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM ceramics WHERE piece_name_potter_id = $1;", [1])
    })

    it("should throw an Error when user is not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })
      await expect(Ceramic.getInventory(-2)).rejects.toThrow("Ceramic pieces not found")
    })
  })

  describe("create", () => {
    it("resovles with one instance of Cermaic", async () => {
      const mockCeramicData = {
        pieceName: "Shallow plate",
        clay: "Porcelain",
        style: "Plate",
        price: 10,
        size: 13,
      }

      const mockCeramicResponse = {
        ceramics_id: 4,
        piece_name: "Shallow plate",
        clay: "Porcelain",
        style: "Plate",
        price: 10,
        size: 13,
        firstname: "edward",
        lastname: "stephan",
        piece_name_owner_id: 1,
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockCeramicResponse] })
      const result = await Ceramic.create(2, mockCeramicData)

      expect(result).toBeInstanceOf(Ceramic)
      expect(result).toHaveProperty("piece", "Shallow plate")
      expect(result.creator).toBe("edward stephan")
      expect(db.query).toHaveBeenCalledWith("INSERT INTO ceramics (piece_name, clay, style, price, size, piece_name_potter_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;", [
        mockCeramicData.pieceName,
        mockCeramicData.clay,
        mockCeramicData.style,
        mockCeramicData.price,
        mockCeramicData.size,
        2,
      ])
    })

    it("should throw an Error when targeted with missing data", async () => {
      const mockCeramicData = {
        pieceName: "Tall pinpot jar",
        clay: "Porcelain",
        price: 20,
      }

      await expect(Ceramic.create(1, mockCeramicData)).rejects.toThrow("Missing data")
    })

    it("should throw an Error when receiving an empty array", async () => {
      const mockCeramicData = {
        pieceName: "Tall pinpot figure",
        clay: "Porcelain",
        style: "Figure",
        price: "20 pounds",
        size: 19,
      }
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })
      await expect(Ceramic.create(1, mockCeramicData)).rejects.toThrow("Ceramic piece not added")
    })
  })
})

describe("getPieceAndPrice", () => {
  it("resovles with array of cermaic data", async () => {
    const mockCeramicResponse = [
      {
        piece_name: "Tall jar",
        price: 16,
      },
      {
        piece_name: "Medium jar",
        price: 14,
      },
      {
        piece_name: "Small jar",
        price: 12,
      }
    ]

    jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockCeramicResponse })
    const result = await Ceramic.getPieceAndPrice()

    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toBeInstanceOf(Ceramic)
    expect(result[0]).toHaveProperty("piece", "Tall jar")
    expect(result[0]).toHaveProperty("price", 16)
    expect(db.query).toHaveBeenCalledWith('SELECT piece_name, price FROM ceramics;')
  })

  it("should throw an Error when returned an empty array", async () => {
    jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

    await expect(Ceramic.getPieceAndPrice()).rejects.toThrow("No ceramic pieces available")
  })
})
