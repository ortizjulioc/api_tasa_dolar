# Graph Report - .  (2026-07-13)

## Corpus Check
- Corpus is ~5,798 words - fits in a single context window. You may not need a graph.

## Summary
- 85 nodes · 81 edges · 7 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 71,050 input · 0 output

## Community Hubs (Navigation)
- Bank Exchange Rate Listings
- Runtime Dependencies
- Package Metadata
- TypeScript Config
- Dev Dependencies & Types
- Scraper & API Core
- Tasa Dólar Site Source

## God Nodes (most connected - your core abstractions)
1. `Promedio del Dólar en General (Compra 57.72 / Venta 59.86 DOP)` - 23 edges
2. `compilerOptions` - 9 edges
3. `scripts` - 4 edges
4. `axios` - 2 edges
5. `cheerio` - 2 edges
6. `cors` - 2 edges
7. `dotenv` - 2 edges
8. `express` - 2 edges
9. `express-rate-limit` - 2 edges
10. `ts-node` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bank rate offers aggregated into the general average dollar FinancialProduct** — ctemptasa_financialproduct_schema, ctemptasa_promedio_general, ctemptasa_banreservas, ctemptasa_banco_popular, ctemptasa_banco_bhd, ctemptasa_cambio_extranjero, ctemptasa_asociacion_romana, ctemptasa_taveras, ctemptasa_rm, ctemptasa_moneycorps, ctemptasa_panora_exchange, ctemptasa_gamelin, ctemptasa_motor_credito, ctemptasa_sct, ctemptasa_asociacion_cibao, ctemptasa_banco_lafise, ctemptasa_bonanza_banco, ctemptasa_banco_union, ctemptasa_banesco, ctemptasa_banco_caribe, ctemptasa_asociacion_la_nacional, ctemptasa_abonap, ctemptasa_asociacion_peravia [EXTRACTED 1.00]

## Communities (7 total, 0 thin omitted)

### Community 0 - "Bank Exchange Rate Listings"
Cohesion: 0.08
Nodes (24): Abonap (Compra 56.89 / Venta 60.11 DOP), Asociación Cibao de Ahorros y Préstamos (Compra 57.00 / Venta 60.00 DOP), Asociación La Nacional de Ahorros y Préstamos (Compra 57.00 / Venta 60.00 DOP), Asociación Peravia de Ahorros y Préstamos (Compra 56.85 / Venta 60.50 DOP), Asociación Romana (Compra 57.75 / Venta 0.00 DOP), Banco BHD (Compra 56.60 / Venta 60.00 DOP), Banco Caribe (Compra 58.00 / Venta 60.00 DOP), Banco Lafise (Compra 56.50 / Venta 60.00 DOP) (+16 more)

### Community 1 - "Runtime Dependencies"
Cohesion: 0.13
Nodes (15): axios, cheerio, cors, dotenv, express, express-rate-limit, dependencies, axios (+7 more)

### Community 2 - "Package Metadata"
Cohesion: 0.17
Nodes (11): author, description, license, main, name, scripts, build, dev (+3 more)

### Community 3 - "TypeScript Config"
Cohesion: 0.17
Nodes (11): src/**/*, compilerOptions, esModuleInterop, module, moduleResolution, outDir, rootDir, skipLibCheck (+3 more)

### Community 4 - "Dev Dependencies & Types"
Cohesion: 0.18
Nodes (11): devDependencies, tsx, @types/cors, @types/express, @types/node, typescript, tsx, @types/cors (+3 more)

### Community 5 - "Scraper & API Core"
Cohesion: 0.29
Nodes (6): app, limiter, BankData, DolarData, fetchDolarData(), RawEntry

### Community 6 - "Tasa Dólar Site Source"
Cohesion: 0.67
Nodes (3): schema.org FinancialProduct (JSON-LD), Infodolar.com.do (external logo/image source), Tasa Dólar RD (tasadolar.yagua.site)

## Knowledge Gaps
- **61 isolated node(s):** `name`, `version`, `description`, `license`, `author` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies & Types` to `Package Metadata`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Bank Exchange Rate Listings` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._