import express, { Request, Response } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { fetchDolarData } from "./scraper.js"; // Needs .js extension if module: NodeNext
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors()); // Permite que tu frontend de Next.js consuma esto

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Límite de 100 peticiones por IP por cada ventana de tiempo (1 minuto)
  message: { error: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo después de un minuto" },
  standardHeaders: true, // Retorna los headers de RateLimit en la respuesta
  legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
});

app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Tasa Dólar RD</title>
      <style>
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 3rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          max-width: 600px;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #00f2fe, #4facfe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #e0e0e0;
          margin-bottom: 2rem;
        }
        .endpoint {
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          font-family: monospace;
          font-size: 1.1rem;
          color: #4facfe;
          display: inline-block;
          margin-bottom: 2rem;
        }
        .btn {
          display: inline-block;
          background: #4facfe;
          color: #0f2027;
          text-decoration: none;
          padding: 10px 24px;
          border-radius: 30px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .btn:hover {
          background: #00f2fe;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 172, 254, 0.4);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>API Tasa Dólar RD</h1>
        <p>Bienvenido a la API para consultar las tasas de cambio del dólar en República Dominicana.</p>
        <div class="endpoint">GET /api/dolar</div>
        <br>
        <a href="/api/dolar" class="btn">Ir al Endpoint</a>
      </div>
    </body>
    </html>
  `;
  res.send(htmlContent);
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
          ? data
              .filter((_, i) => i !== promedioIndex)
              .filter((b) => !b.entidad.toLowerCase().includes("popular"))
          : data.filter((b) => !b.entidad.toLowerCase().includes("popular")),
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
