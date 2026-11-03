import { boolean, doublePrecision, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products table for Farmacia 701 catalog
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // Product SKU/code (e.g. 'cat-1')
  name: text('name').notNull(),
  genericName: text('generic_name'),
  category: text('category').notNull(), // 'prescription' | 'otc' | 'vitamins' | 'skincare' | 'firstaid'
  categoryLabel: text('category_label').notNull(),
  presentation: text('presentation').notNull(),
  price: doublePrecision('price').notNull(),
  insuranceCovered: boolean('insurance_covered').notNull().default(false),
  coPayPrice: doublePrecision('copay_price'),
  rxRequired: boolean('rx_required').notNull().default(false),
  inStock: boolean('in_stock').notNull().default(true),
  stockCount: integer('stock_count').notNull().default(0),
  description: text('description').notNull(),
  brand: text('brand').notNull(),
  dosage: text('dosage'),
  badge: text('badge'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
