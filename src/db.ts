import { Database } from "bun:sqlite";
import type { CreateFlashSaleInput, FlashSale, Product, ProductWithPricing, CheckoutRequest, CheckoutResult } from "./types";

let dbInstance: Database | null = null;
let activeSalesCache: { productsVersion: number; expiresAtMs: number; data: ProductWithPricing[] } | null = null;
let productsVersionCounter = 0;

function getDb(): Database {
  if (!dbInstance) {
    dbInstance = new Database("ecom.sqlite", { create: true });
    dbInstance.exec("PRAGMA journal_mode = WAL;");
    dbInstance.exec("PRAGMA foreign_keys = ON;");
    initializeSchema(dbInstance);
    seedIfEmpty(dbInstance);
  }
  return dbInstance;
}

function initializeSchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price_cents INTEGER NOT NULL CHECK(price_cents > 0),
      stock INTEGER NOT NULL CHECK(stock >= 0)
    );

    CREATE TABLE IF NOT EXISTS flash_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      sale_price_cents INTEGER NOT NULL CHECK(sale_price_cents > 0),
      start_at_ms INTEGER NOT NULL,
      end_at_ms INTEGER NOT NULL,
      max_units INTEGER,
      sold_units INTEGER NOT NULL DEFAULT 0,
      CHECK (end_at_ms > start_at_ms),
      CHECK (max_units IS NULL OR max_units > 0),
      CHECK (sold_units >= 0)
    );
  `);
}

function seedIfEmpty(db: Database): void {
  const row = db.query<{ count: number }, []>("SELECT COUNT(*) as count FROM products").get();
  if (!row || row.count === 0) {
    const insert = db.prepare("INSERT INTO products (name, price_cents, stock) VALUES (?, ?, ?)");
    insert.run("Wireless Headphones", 12999, 50);
    insert.run("Mechanical Keyboard", 9999, 40);
    insert.run("USB-C Charger 65W", 3999, 100);

    // Create a demo flash sale for the first product starting now for 30 minutes at 50% off
    const now = Date.now();
    const product = db.query<{ id: number; price_cents: number }>("SELECT id, price_cents FROM products ORDER BY id LIMIT 1").get();
    if (product) {
      const salePrice = Math.floor(product.price_cents * 0.5);
      db.prepare(`
        INSERT INTO flash_sales (product_id, sale_price_cents, start_at_ms, end_at_ms, max_units, sold_units)
        VALUES (?, ?, ?, ?, ?, 0)
      `).run(product.id, salePrice, now, now + 30 * 60 * 1000, 25);
    }
  }
}

export function listProducts(nowMs: number = Date.now()): ProductWithPricing[] {
  const db = getDb();
  const query = db.query<ProductWithPricing & { sale_sale_price_cents?: number; sale_start_at_ms?: number; sale_end_at_ms?: number }>(
    `SELECT 
      p.id, p.name, p.price_cents as priceCents, p.stock,
      fs.sale_price_cents as sale_sale_price_cents,
      fs.start_at_ms as sale_start_at_ms,
      fs.end_at_ms as sale_end_at_ms
     FROM products p
     LEFT JOIN flash_sales fs
       ON fs.product_id = p.id
       AND fs.start_at_ms <= ?
       AND fs.end_at_ms > ?
       AND (fs.max_units IS NULL OR fs.sold_units < fs.max_units)
     ORDER BY p.id ASC`
  );

  const rows = query.all(nowMs, nowMs);
  return rows.map(r => {
    const activeFlashSale = r.sale_sale_price_cents != null ? {
      salePriceCents: r.sale_sale_price_cents!,
      startAtMs: r.sale_start_at_ms!,
      endAtMs: r.sale_end_at_ms!,
    } : undefined;
    const { sale_sale_price_cents, sale_start_at_ms, sale_end_at_ms, ...rest } = r as any;
    return { ...rest, activeFlashSale } as ProductWithPricing;
  });
}

export function getActiveFlashSale(productId: number, nowMs: number = Date.now()): FlashSale | null {
  const db = getDb();
  const row = db.query<FlashSale>(
    `SELECT id, product_id as productId, sale_price_cents as salePriceCents, start_at_ms as startAtMs, end_at_ms as endAtMs, max_units as maxUnits
     FROM flash_sales
     WHERE product_id = ?
       AND start_at_ms <= ?
       AND end_at_ms > ?
       AND (max_units IS NULL OR sold_units < max_units)
     ORDER BY id DESC
     LIMIT 1`
  ).get(productId, nowMs, nowMs);
  return row ?? null;
}

export function createFlashSale(input: CreateFlashSaleInput): FlashSale {
  const db = getDb();
  const product = db.query<{ price_cents: number }>("SELECT price_cents FROM products WHERE id = ?").get(input.productId);
  if (!product) throw new Error("Product not found");
  if (input.endAtMs <= input.startAtMs) throw new Error("endAtMs must be greater than startAtMs");
  if (input.salePriceCents <= 0) throw new Error("salePriceCents must be > 0");
  if (input.salePriceCents >= product.price_cents) throw new Error("sale price must be less than product price");

  const stmt = db.prepare(`
    INSERT INTO flash_sales (product_id, sale_price_cents, start_at_ms, end_at_ms, max_units, sold_units)
    VALUES (?, ?, ?, ?, ?, 0)
  `);
  const result = stmt.run(input.productId, input.salePriceCents, input.startAtMs, input.endAtMs, input.maxUnits ?? null);
  const id = Number(result.lastInsertRowid);
  const row = db.query<FlashSale>(
    `SELECT id, product_id as productId, sale_price_cents as salePriceCents, start_at_ms as startAtMs, end_at_ms as endAtMs, max_units as maxUnits
     FROM flash_sales WHERE id = ?`
  ).get(id)!;
  // Invalidate cache
  activeSalesCache = null;
  return row;
}

export function listFlashSales(): FlashSale[] {
  const db = getDb();
  return db.query<FlashSale>(
    `SELECT id, product_id as productId, sale_price_cents as salePriceCents, start_at_ms as startAtMs, end_at_ms as endAtMs, max_units as maxUnits
     FROM flash_sales
     ORDER BY start_at_ms DESC`
  ).all();
}

export function deleteFlashSale(id: number): void {
  const db = getDb();
  db.prepare("DELETE FROM flash_sales WHERE id = ?").run(id);
  activeSalesCache = null;
}

export function updateFlashSale(id: number, input: Partial<CreateFlashSaleInput>): FlashSale {
  const db = getDb();
  const current = db.query<FlashSale & { sold_units: number }>(
    `SELECT id, product_id as productId, sale_price_cents as salePriceCents, start_at_ms as startAtMs, end_at_ms as endAtMs, max_units as maxUnits, sold_units
     FROM flash_sales WHERE id = ?`
  ).get(id);
  if (!current) throw new Error("Flash sale not found");

  const next = {
    productId: input.productId ?? current.productId,
    salePriceCents: input.salePriceCents ?? current.salePriceCents,
    startAtMs: input.startAtMs ?? current.startAtMs,
    endAtMs: input.endAtMs ?? current.endAtMs,
    maxUnits: input.maxUnits ?? current.maxUnits,
  } as CreateFlashSaleInput;

  if (next.endAtMs <= next.startAtMs) throw new Error("endAtMs must be greater than startAtMs");
  const product = db.query<{ price_cents: number }>("SELECT price_cents FROM products WHERE id = ?").get(next.productId);
  if (!product) throw new Error("Product not found");
  if (next.salePriceCents >= product.price_cents) throw new Error("sale price must be less than product price");
  if (next.maxUnits != null && current.sold_units > (next.maxUnits ?? Number.MAX_SAFE_INTEGER)) {
    throw new Error("maxUnits cannot be less than already sold units");
  }

  db.prepare(
    `UPDATE flash_sales SET product_id = ?, sale_price_cents = ?, start_at_ms = ?, end_at_ms = ?, max_units = ? WHERE id = ?`
  ).run(next.productId, next.salePriceCents, next.startAtMs, next.endAtMs, next.maxUnits ?? null, id);

  return db.query<FlashSale>(
    `SELECT id, product_id as productId, sale_price_cents as salePriceCents, start_at_ms as startAtMs, end_at_ms as endAtMs, max_units as maxUnits FROM flash_sales WHERE id = ?`
  ).get(id)!;
}

export function checkout(request: CheckoutRequest, nowMs: number = Date.now()): CheckoutResult {
  const db = getDb();
  if (request.quantity <= 0) throw new Error("quantity must be > 0");

  const tx = db.transaction((req: CheckoutRequest): CheckoutResult => {
    const product = db.query<{ id: number; price_cents: number; stock: number }>(
      "SELECT id, price_cents, stock FROM products WHERE id = ?"
    ).get(req.productId);
    if (!product) throw new Error("Product not found");

    if (product.stock < req.quantity) throw new Error("Insufficient stock");

    const sale = db.query<{ id: number; sale_price_cents: number; max_units: number | null; sold_units: number }>(
      `SELECT id, sale_price_cents, max_units, sold_units FROM flash_sales
       WHERE product_id = ? AND start_at_ms <= ? AND end_at_ms > ?
         AND (max_units IS NULL OR sold_units < max_units)
       ORDER BY id DESC LIMIT 1`
    ).get(req.productId, nowMs, nowMs);

    let unitPriceCents = product.price_cents;
    let usedFlashSale = false;

    if (sale) {
      if (sale.max_units != null && sale.sold_units + req.quantity > sale.max_units) {
        throw new Error("Flash sale sold out for requested quantity");
      }
      unitPriceCents = sale.sale_price_cents;
      usedFlashSale = true;
      db.prepare("UPDATE flash_sales SET sold_units = sold_units + ? WHERE id = ?").run(req.quantity, sale.id);
    }

    db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(req.quantity, req.productId);
    productsVersionCounter++;
    activeSalesCache = null;

    const totalPriceCents = unitPriceCents * req.quantity;
    return {
      success: true,
      unitPriceCents,
      quantity: req.quantity,
      totalPriceCents,
      usedFlashSale,
    };
  });

  return tx.immediate(request);
}

export function getNow(): number {
  return Date.now();
}

export function listProductsCached(nowMs: number = Date.now()): ProductWithPricing[] {
  if (activeSalesCache && activeSalesCache.expiresAtMs > nowMs) {
    return activeSalesCache.data;
  }
  const data = listProducts(nowMs);
  // Cache for 2 seconds to reduce DB hits
  activeSalesCache = { productsVersion: productsVersionCounter, expiresAtMs: nowMs + 2000, data };
  return data;
}

