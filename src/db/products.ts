import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { products, type NewProduct } from './schema.ts';

export async function getProducts() {
  try {
    return await db.select().from(products).orderBy(products.id);
  } catch (error) {
    console.error('Database query getProducts failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getProductByCode(code: string) {
  try {
    const results = await db.select().from(products).where(eq(products.code, code)).limit(1);
    return results[0] || null;
  } catch (error) {
    console.error(`Database query getProductByCode(${code}) failed:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function seedProductsIfEmpty(initialList: NewProduct[]) {
  try {
    const existing = await db.select({ id: products.id }).from(products).limit(1);
    if (existing.length === 0 && initialList.length > 0) {
      console.log(`Seeding ${initialList.length} products to Cloud SQL...`);
      await db.insert(products).values(initialList).onConflictDoNothing();
      console.log('Seeding completed successfully.');
    }
  } catch (error) {
    console.error('Failed to seed products:', error);
  }
}

export async function createProduct(productData: NewProduct) {
  try {
    const result = await db.insert(products).values(productData).returning();
    return result[0];
  } catch (error) {
    console.error('Database insert product failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
