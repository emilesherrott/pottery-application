const axios = require("axios")
const salesController = require("../../../controllers/sales")
const { Sale } = require("../../../models/Sale")

jest.mock("axios")

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}))

const mockRes = { status: mockStatus }

describe("Sales controller", () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe("salesInfo", () => {
    it("should return a visualisation of sales data", async () => {
      const mockReq = {
        pottersId: 1,
        body: {
          itemId: 1,
        },
      }

      const mockSalesData = [
        {
          piece: "Tall Jar",
          saleTime: "2025-09-02",
          saleNumber: 2,
        },
        {
          piece: "Tall Jar",
          saleTime: "2025-09-03",
          saleNumber: 1,
        },
        {
          piece: "Tall Jar",
          saleTime: "2025-09-04",
          saleNumber: 3,
        },
        {
          piece: "Tall Jar",
          saleTime: "2025-09-05",
          saleNumber: 2,
        },
      ]

      const mockVisualisation = `<img src=bar-chart.png alt="bar-chart"/>`

      jest.spyOn(Sale, "getSalesInfo").mockResolvedValue(mockSalesData)
      axios.post.mockResolvedValue({ data: mockVisualisation })
      await salesController.salesInfo(mockReq, mockRes)

      expect(Sale.getSalesInfo).toHaveBeenCalledTimes(1)
      expect(axios.post).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        visualisation: mockVisualisation,
      })
    })

    it("should return an error upon failure", async () => {
      jest.spyOn(Sale, "getSalesInfo").mockRejectedValue(new Error("No sales information available"))

      const mockReq = {
        ownersId: 1,
        body: {},
      }

      await salesController.salesInfo(mockReq, mockRes)

      expect(Sale.getSalesInfo).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({ error: "No sales information available" })
    })
  })

  describe("styleInfo", () => {
    it("should return visualisation on sales by style", async () => {
      const mockReq = {
        pottersId: 1,
      }

      const mockStyleSaleResults = [
        {
          style: "Jar",
          saleNumber: 2,
        },
        {
          piece: "Mug",
          saleNumber: 1,
        },
        {
          piece: "Jar",
          saleNumber: 3,
        },
        {
          piece: "Bowl",
          saleNumber: 2,
        },
      ]

      const mockVisualisation = `<img src=pie-chart.png alt="pie-chart"/>`

      jest.spyOn(Sale, "styleInfo").mockResolvedValue(mockStyleSaleResults)
      axios.post.mockResolvedValue({ data: mockVisualisation })
      await salesController.styleInfo(mockReq, mockRes)

      expect(Sale.styleInfo).toHaveBeenCalledTimes(1)
      expect(axios.post).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        visualisation: mockVisualisation,
      })
    })

    it("should return an error upon failure", async () => {
      jest.spyOn(Sale, "styleInfo").mockRejectedValue(new Error("No sales information available"))

      const mockReq = {
      }

      await salesController.styleInfo(mockReq, mockRes)

      expect(Sale.styleInfo).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({ error: "No sales information available" })
    })
  })

  describe("makeSale", () => {
    it("should return purchase infomarion with successful sale", async () => {
      const mockReq = {
        ownersId: 1,
        body: {
          saleTime: "2025-8-06",
          saleNumber: 2,
          ceramicItem: 1,
        },
      }

      const mockSaleInfo = {
        saleTime: "2025-08-06",
        saleNumber: 2,
        purchaserId: 4,
      }

      jest.spyOn(Sale, "makeSale").mockResolvedValue(mockSaleInfo)
      await salesController.makeSale(mockReq, mockRes)

      expect(Sale.makeSale).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        purchaseInfo: mockSaleInfo,
      })
    })

    it("should return an error upon failure", async () => {
      jest.spyOn(Sale, "makeSale").mockRejectedValue(new Error("Purchase unable to be made"))

      const mockReq = {
        ownersId: 1,
        body: {
          ceramicItem: 1,
        },
      }

      await salesController.makeSale(mockReq, mockRes)

      expect(Sale.makeSale).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith({ error: "Purchase unable to be made" })
    })
  })
})
