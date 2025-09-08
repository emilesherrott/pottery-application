process.env.TEST_ENV = "true" 

const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")

const pottersResetSQL = fs.readFileSync(
  path.join(__dirname, "resetFiles", "01-potters-reset.sql")
).toString()

const ownersResetSQL = fs.readFileSync(
  path.join(__dirname, "resetFiles", "02-owners-reset.sql")
).toString()

const ceramicsResetSQL = fs.readFileSync(
  path.join(__dirname, "resetFiles", "03-ceramics-reset.sql") 
).toString()

const salesResetSQL = fs.readFileSync(
  path.join(__dirname, "resetFiles", "04-sales-reset.sql")
).toString()

const resetTestDB = async () => {
  const db = new Pool({
    host: "localhost",
    port: 5433,
    user: "testuser",
    password: "testpassword",
    database: "testdb",
  })

  try {
    // Run each reset file individually
    await db.query(pottersResetSQL)
    await db.query(ownersResetSQL)
    await db.query(ceramicsResetSQL)
    await db.query(salesResetSQL)

    console.log("✅ Test DB reset complete")
  } catch (err) {
    console.error("❌ Error resetting DB:", err)
    throw err
  } finally {
    await db.end()
  }
}

module.exports = { resetTestDB }
