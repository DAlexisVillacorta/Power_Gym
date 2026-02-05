import { DataSource } from "typeorm"
import "dotenv/config"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: [],
  subscribers: []
})


export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize()
    console.log("Base de datos conectada exitosamente")
  } catch (error) {
    console.error("Error al conectar la base de datos:", error)
    throw error
  }
}