import { pgTable, text, timestamp, varchar, doublePrecision, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orderItems } from "./orders";

export const canvasLayouts = pgTable("canvas_layouts", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  orderItemId: varchar("order_item_id", { length: 36 }).references(() => orderItems.id).notNull(),
  zoom: doublePrecision("zoom").default(1),
  panX: doublePrecision("pan_x").default(0),
  panY: doublePrecision("pan_y").default(0),
  gridEnabled: boolean("grid_enabled").default(true),
  snapToGrid: boolean("snap_to_grid").default(true),
  previewImageId: varchar("preview_image_id", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const canvasObjects = pgTable("canvas_objects", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  layoutId: varchar("layout_id", { length: 36 }).references(() => canvasLayouts.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // Rectangle, Square, Frame, Divider, Glass, Pipe, Text, Dimension
  x: doublePrecision("x").notNull(),
  y: doublePrecision("y").notNull(),
  width: doublePrecision("width"),
  height: doublePrecision("height"),
  rotation: doublePrecision("rotation").default(0),
  label: text("label"),
  material: varchar("material", { length: 100 }),
  thickness: varchar("thickness", { length: 50 }),
  color: varchar("color", { length: 50 }),
  metadata: jsonb("metadata"), // extra generic properties
  zIndex: doublePrecision("z_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const measurements = pgTable("measurements", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  objectId: varchar("object_id", { length: 36 }).references(() => canvasObjects.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  value: doublePrecision("value").notNull(),
  unit: varchar("unit", { length: 20 }).default("mm"), // mm, cm, inch, ft
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const canvasLayoutsRelations = relations(canvasLayouts, ({ one, many }) => ({
  orderItem: one(orderItems, {
    fields: [canvasLayouts.orderItemId],
    references: [orderItems.id],
  }),
  objects: many(canvasObjects),
}));

export const canvasObjectsRelations = relations(canvasObjects, ({ one, many }) => ({
  layout: one(canvasLayouts, {
    fields: [canvasObjects.layoutId],
    references: [canvasLayouts.id],
  }),
  measurements: many(measurements),
}));

export const measurementsRelations = relations(measurements, ({ one }) => ({
  object: one(canvasObjects, {
    fields: [measurements.objectId],
    references: [canvasObjects.id],
  }),
}));
