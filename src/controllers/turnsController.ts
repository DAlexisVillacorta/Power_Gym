import { Request, Response } from "express"

export const turnsController = async (req: Request, res: Response) => {
  try {
    console.log("Body recibido en controlador de prueba:", req.body)

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "El body llegó vacío. Verifica express.json() y Postman."
      })
    }

    const { id, date, time, userId, status, service } = req.body

    return res.status(200).json({
      message: "Body recibido correctamente.",
      data: { id, date, time, userId, status, service }
    })
  } catch (err) {
    res.status(500).json({
      message: "Error en el controlador de prueba.",
      error: err instanceof Error ? err.message : "Error desconocido"
    })
  }
}