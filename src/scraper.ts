import axios from "axios";
import * as cheerio from "cheerio";

export interface BankData {
  entidad: string;
  compra: number;
  venta: number;
  variacion: string;
}

export const fetchDolarData = async (): Promise<BankData[]> => {
  const { data: html } = await axios.get("https://www.infodolar.com.do/");
  const $ = cheerio.load(html);
  const banks: BankData[] = [];

  $("table tbody tr").each((_, element) => {
    const cells = $(element).find("td");
    if (cells.length >= 3) {
      const nombre = $(cells[0])
        .text()
        .replace(/\n/g, " ")
        .replace(/^Dólar\s+/i, "")
        .trim();
      const compra = parseFloat(
        $(cells[1])
          .text()
          .replace(/[^0-9.]/g, ""),
      );
      const venta = parseFloat(
        $(cells[2])
          .text()
          .replace(/[^0-9.]/g, ""),
      );
      const variacion = $(cells[3]).text().trim();

      if (nombre && !isNaN(compra)) {
        banks.push({ entidad: nombre, compra, venta, variacion });
      }
    }
  });

  return banks;
};
