import axios from "axios";

export interface BankData {
  entidad: string;
  compra: number;
  venta: number;
  variacion: string;
}

export interface DolarData {
  promedio: BankData | null;
  tasaBancoCentral: BankData | null;
  banks: BankData[];
}

interface RawEntry {
  entidad: string;
  compra: number;
  venta: number;
  variacion: string;
  logo?: string | null;
  isOfficial?: boolean;
  timestamp?: string;
}

export const fetchDolarData = async (): Promise<DolarData> => {
  const { data: html } = await axios.get("https://preciodolar.site/", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  // El RSC payload embeds data as an escaped JS string inside self.__next_f.push([1, "..."])
  // JSON.parse('"' + content + '"') properly unescapes it before searching for initialData
  const scriptMatches = [
    ...html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/gs),
  ] as RegExpMatchArray[];

  let entries: RawEntry[] | null = null;
  for (const sm of scriptMatches) {
    const decoded: string = JSON.parse('"' + sm[1] + '"');
    const inner = decoded.match(/"initialData":\[(.+?)\](?=[,\]])/s);
    if (inner) {
      entries = JSON.parse(`[${inner[1]}]`);
      break;
    }
  }

  if (!entries) throw new Error("No se encontró initialData en la página");

  let promedio: BankData | null = null;
  let tasaBancoCentral: BankData | null = null;
  const banks: BankData[] = [];

  for (const entry of entries) {
    const item: BankData = {
      entidad: entry.entidad,
      compra: entry.compra,
      venta: entry.venta,
      variacion: entry.variacion ?? "",
    };

    const name = entry.entidad.toLowerCase();

    // La fuente usa un flag estructural `isOfficial` para marcar la tasa del
    // Banco Central; no depender solo del texto de "entidad", que la página
    // cambia de vez en cuando (antes decía "Promedio Banco Central", ahora
    // "Banco Central de la República Dominicana" y ya no es un promedio).
    const isBancoCentral =
      entry.isOfficial === true ||
      (name.includes("banco") && name.includes("central"));

    if (isBancoCentral) {
      item.entidad = "Banco Central de la República Dominicana";
      tasaBancoCentral = item;
    } else if (name.includes("promedio")) {
      item.entidad = "Promedio General";
      promedio = item;
    } else {
      banks.push(item);
    }
  }

  // La fuente dejó de enviar una fila "Promedio General" dentro de initialData
  // (lo confirmamos viendo el payload real: ya no aparece ninguna entidad con
  // "promedio" en el arreglo). En vez de depender de que la vuelvan a incluir,
  // lo calculamos nosotros mismos a partir de los bancos individuales, que es
  // justo lo que este campo debe representar.
  if (!promedio && banks.length > 0) {
    const compraAvg =
      banks.reduce((sum, b) => sum + b.compra, 0) / banks.length;

    // Algunas entidades reportan venta en 0 (dato incompleto de la fuente);
    // se excluyen para no distorsionar el promedio de venta hacia abajo.
    const bancosConVenta = banks.filter((b) => b.venta > 0);
    const ventaAvg =
      bancosConVenta.length > 0
        ? bancosConVenta.reduce((sum, b) => sum + b.venta, 0) /
          bancosConVenta.length
        : 0;

    promedio = {
      entidad: "Promedio General",
      compra: Math.round(compraAvg * 100) / 100,
      venta: Math.round(ventaAvg * 100) / 100,
      variacion: "",
    };
  }

  return { promedio, tasaBancoCentral, banks };
};
