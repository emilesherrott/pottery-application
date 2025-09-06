const { Sale } = require("../../../models/Sale")
const db = require("../../../database/connect")

describe("Sale", () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe("getSalesInfo", () => {
    it("retrieves sales info", async () => {
      const mockSalesResponse = [
        {
          piece_name: "Large Fluted Bowl",
          sale_time: "2025-08-28",
          sale_number: 1,
        },
        {
          piece_name: "Small Bottleneck Vase",
          sale_time: "2025-09-05",
          sale_number: 3,
        },
        {
          piece_name: "Moon Jar",
          sale_time: "2025-09-01",
          sale_number: 2,
        },
      ]

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockSalesResponse })
      const result = await Sale.getSalesInfo(1, 1)

      expect(result).toBeInstanceOf(Array)
      expect(result[0]).toBeInstanceOf(Sale)
      expect(result[0].piece).toBe("Large Fluted Bowl")
      expect(result[0].saleTime).toBe("2025-08-28")
      expect(result[0].saleNumber).toBe(1)
      expect(db.query).toHaveBeenCalledWith(
        "SELECT ceramics.piece_name, sales.sale_time, sales.sale_number FROM sales JOIN ceramics ON sales.ceramic_item_id = ceramics.ceramics_id JOIN potters ON ceramics.piece_name_potter_id = potters.potters_id WHERE potters.potters_id = $1 AND ceramics.ceramics_id = $2;",
        [1, 1]
      )
    })

    it("should throw an error if no sale data is found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(Sale.getSalesInfo(999, 999)).rejects.toThrow("No sales information available")
    })
  })

  describe("styleInfo", () => {
    it("retrieves style info", async () => {
      const mockStyleResponse = [
        {
          style: "Mug",
          sale_number: 10,
        },
        {
          style: "Vase",
          sale_number: 4,
        },
        {
          style: "Jar",
          sale_number: 16,
        },
      ]

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockStyleResponse })
      const result = await Sale.styleInfo(1)

      expect(result).toBeInstanceOf(Array)
      expect(result[0]).toBeInstanceOf(Sale)
      expect(result[0].style).toBe("Mug")
      expect(result[0].saleNumber).toBe(10)
      expect(db.query).toHaveBeenCalledWith(
        "SELECT c.style, s.sale_number FROM potters p JOIN ceramics c ON p.potters_id = c.piece_name_potter_id JOIN sales s ON c.ceramics_id = s.ceramic_item_id WHERE p.potters_id = $1;",
        [1]
      )
    })

    it("throw an error when no sale information is available", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })

      await expect(Sale.styleInfo(999)).rejects.toThrow("No sales information available")
    })
  })

  describe("makeSale", () => {
    it("processes sales response data", async () => {
      const mockSaleData = {
        saleTime: "2024-10-12",
        saleNumber: 2,
        ceramicItem: 2,
      }

      const mockSaleResponse = {
        sale_id: 1,
        piece: "Short stem pot",
        sale_time: "2024-10-12",
        sale_number: 2,
        style: "Pot",
        ceramic_item_purchaser_id: 4,
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockSaleResponse] })
      const result = await Sale.makeSale(4, mockSaleData)

      expect(result).toBeInstanceOf(Sale)
      expect(result.saleNumber).toBe(2)
      expect(result.style).toBe("Pot")
      expect(db.query).toHaveBeenCalledWith("INSERT INTO sales (sale_time, sale_number, ceramic_item_id, ceramic_item_purchaser_id) VALUES ($1, $2, $3, $4) RETURNING *;", [
        mockSaleData.saleTime,
        mockSaleData.saleNumber,
        mockSaleData.ceramicItem,
        4,
      ])
    })

    it("throw an error when no sale information is available", async () => {
      const mockSaleData = {
        saleNumber: 2,
        ceramicItem: 2,
      }

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] })
      await expect(Sale.makeSale(999, mockSaleData)).rejects.toThrow("Purchase unable to be made")
    })
  })
})
