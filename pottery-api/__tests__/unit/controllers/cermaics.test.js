const ceramicsController = require("../../../controllers/ceramics")
const { Ceramic } = require("../../../models/Ceramic")

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}))

const mockRes = { status: mockStatus }

describe("Ceramics controller", () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe("index", () => {
    it("should return an array of cermaics", async () => {
      const mockCeramicResult = [
        {
          id: 1,
          piece: "Tall Jar",
          clay_used: "Porcelain",
          style: "Jar",
          price: "10",
          size: "10",
          creator: "Keith Jones",
        },
        {
          id: 2,
          piece: "Medium Jar",
          clay_used: "Porcelain",
          style: "Jar",
          price: "8",
          size: "7",
          creator: "Keith Jones",
        },
        {
          id: 3,
          piece: "Mug",
          clay_used: "Stoneware",
          style: "Mug",
          price: "15",
          size: "6",
          creator: "Rich Miller",
        },
      ]

      jest.spyOn(Ceramic, "getAll").mockResolvedValue(mockCeramicResult)
      await ceramicsController.index(null, mockRes)

      expect(Ceramic.getAll).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith(mockCeramicResult)
    })

    it("should return an error upon failure", async () => {
      jest.spyOn(Ceramic, "getAll").mockRejectedValue(new Error("Ceramic pieces not found"))

      await ceramicsController.index(null, mockRes)

      expect(Ceramic.getAll).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({ error: "Ceramic pieces not found" })
    })
  })

  describe("inventory", () => {
    it("should return ceramic items relating to a potter", async () => {
      const mockReq = {
        pottersId: 1,
      }

      const mockResult = [
        {
          id: 1,
          piece: "Tall Jar",
          clay_used: "Porcelain",
          style: "Jar",
          price: "10",
          size: "10",
          creator: "Keith Jones",
        },
        {
          id: 2,
          piece: "Medium Jar",
          clay_used: "Porcelain",
          style: "Jar",
          price: "8",
          size: "7",
          creator: "Keith Jones",
        },
      ]

      jest.spyOn(Ceramic, "getInventory").mockResolvedValue(mockResult)

      await ceramicsController.inventory(mockReq, mockRes)

      expect(Ceramic.getInventory).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith(mockResult)
    })

    it("should return an error if no items found", async () => {
      const mockReq = {
        pottersId: 999,
      }

      jest.spyOn(Ceramic, "getInventory").mockRejectedValue(new Error("Ceramic pieces not found"))

      await ceramicsController.inventory(mockReq, mockRes)

      expect(Ceramic.getInventory).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({ error: "Ceramic pieces not found" })
    })
  })

  describe("create", () => {
    it("should create a new ceramic piece and return it", async () => {
      const mockReq = {
        body: {
          id: 1,
          pieceName: "Tall Jar",
          clay: "Porcelain",
          style: "Jar",
          price: "10",
          size: "10",
        },
      }

      const mockCeramicResult = {
        id: 1,
        piece: "Tall Jar",
        clay_used: "Porcelain",
        style: "Jar",
        price: "10",
        size: "10",
        creator: "Keith Jones",
      }

      jest.spyOn(Ceramic, "create").mockResolvedValue(mockCeramicResult)

      await ceramicsController.create(mockReq, mockRes)

      expect(Ceramic.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        result: mockCeramicResult,
      })
    })

    it("should return an error missing data provded", async () => {
      const mockReq = {
        body: {
          pieceName: null,
          clay: "Porcelain",
          style: "Jar",
        },
      }

      jest.spyOn(Ceramic, "create").mockRejectedValue(new Error("Ceramic piece not added"))

      await ceramicsController.create(mockReq, mockRes)

      expect(Ceramic.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({ error: "Ceramic piece not added" })
    })
  })

  describe("salesInfo", () => {
    it("should retrieve piece and price info from specific potter", async () => {
      const mockReq = {
        pottersId: 1,
      }

      const mockSalesData = [
        {
          piece: "Tall Jar",
          price: 10,
        },
        {
          piece: "Medium Jar",
          price: 8,
        },
        {
          piece: "Small Jar",
          price: 5,
        },
      ]

      jest.spyOn(Ceramic, "getPieceAndPrice").mockResolvedValue(mockSalesData)

      await ceramicsController.salesInfo(mockReq, mockRes)

      expect(Ceramic.getPieceAndPrice).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith(mockSalesData)
    })

    it("should return an error missing data provded", async () => {
      const mockReq = {}
      

      jest.spyOn(Ceramic, "getPieceAndPrice").mockRejectedValue(new Error("No ceramic pieces available"))

      await ceramicsController.salesInfo(mockReq, mockRes)

      expect(Ceramic.getPieceAndPrice).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({ error: "No ceramic pieces available" })
    })
  })
})
