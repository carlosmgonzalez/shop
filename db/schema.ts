import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  description: text().notNull(),
  stock: integer().notNull().default(0),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertProduct = typeof productsTable.$inferInsert;
export type ProductType = typeof productsTable.$inferSelect;

export const imagesProductsTable = pgTable("images_products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer().references(() => productsTable.id),
  url: varchar({ length: 255 }).notNull(),
  publicId: varchar({ length: 255 }).notNull(),
});

export type InsertImageProduct = typeof imagesProductsTable.$inferInsert;
export type ImageProductType = typeof imagesProductsTable.$inferSelect;

export const cartItemsTable = pgTable("cart_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cartId: integer().references(() => cartTable.id),
  productId: integer().references(() => productsTable.id),
  quantity: integer().notNull().default(1),
});

export type InsertCartItem = typeof cartItemsTable.$inferInsert;
export type CartItemType = typeof cartItemsTable.$inferSelect;

export const cartTable = pgTable("cart", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userSessionId: integer().references(() => usersSessionsTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertCart = typeof cartTable.$inferInsert;
export type CartType = typeof cartTable.$inferSelect;

export const usersSessionsTable = pgTable("users_sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUserSession = typeof usersSessionsTable.$inferInsert;
export type UserSessionType = typeof usersSessionsTable.$inferSelect;

// Relations
export const productsRelations = relations(productsTable, ({ many }) => ({
  images: many(imagesProductsTable),
  cartItems: many(cartItemsTable),
}));

export const imagesProductsRelations = relations(
  imagesProductsTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [imagesProductsTable.productId],
      references: [productsTable.id],
    }),
  })
);

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartTable, {
    fields: [cartItemsTable.cartId],
    references: [cartTable.id],
  }),
  product: one(productsTable, {
    fields: [cartItemsTable.productId],
    references: [productsTable.id],
  }),
}));

export const cartRelations = relations(cartTable, ({ one, many }) => ({
  userSession: one(usersSessionsTable, {
    fields: [cartTable.userSessionId],
    references: [usersSessionsTable.id],
  }),
  items: many(cartItemsTable),
}));

export const usersSessionsRelations = relations(
  usersSessionsTable,
  ({ many }) => ({
    carts: many(cartTable),
  })
);
