import express, { Request, Response } from "express";
import cors from "cors";
import { fetchDolarData } from "./scraper.js"; // Needs .js extension if module: NodeNext
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors()); // Permite que tu frontend de Next.js consuma esto

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Bienvenido a la API del Dólar. Las tasas están en la ruta /api/dolar",
  );
});

app.get("/api/dolar", async (req: Request, res: Response) => {
  try {
    const data = await fetchDolarData();

    // Separamos el promedio si lo necesitas
    const promedioIndex = data.findIndex((b) =>
      b.entidad.toLowerCase().includes("promedio"),
    );

    let promedioObj = promedioIndex !== -1 ? data[promedioIndex] : null;
    if (promedioObj) {
      promedioObj.entidad = "Promedio General";
    }

    const response = {
      timestamp: new Date(),
      promedio: promedioObj,
      bancos:
        promedioIndex !== -1
          ? data.filter((_, i) => i !== promedioIndex)
          : data,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las tasas" });
  }
});

const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT, () =>
  console.log(`API corriendo en http://localhost:${PORT}`),
);
