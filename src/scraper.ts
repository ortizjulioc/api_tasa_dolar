import axios from "axios";

export interface BankData {
  entidad: string;
  compra: number;
  venta: number;
  variacion: string;
}

export interface DolarData {
  promedio: BankData | null;
  promedioBancoCentral: BankData | null;
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
  let promedioBancoCentral: BankData | null = null;
  const banks: BankData[] = [];

  for (const entry of entries) {
    const item: BankData = {
      entidad: entry.entidad,
      compra: entry.compra,
      venta: entry.venta,
      variacion: entry.variacion ?? "",
    };

    const name = entry.entidad.toLowerCase();

    if (name.includes("promedio") && name.includes("general")) {
      item.entidad = "Promedio General";
      promedio = item;
    } else if (name.includes("promedio") && name.includes("central")) {
      item.entidad = "Promedio Banco Central";
      promedioBancoCentral = item;
    } else {
      banks.push(item);
    }
  }

  return { promedio, promedioBancoCentral, banks };
};
