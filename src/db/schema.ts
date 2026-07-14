import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Users table matching the Firebase Auth UID
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID or Custom local UID
  email: text("email").notNull().unique(), // Unique email
  username: text("username").notNull(),
  password: text("password"), // Optional password for local accounts
  createdAt: timestamp("created_at").defaultNow(),
});

// User activities logging all events within the portal
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  activityType: text("activity_type").notNull(), // 'login', 'register', 'logout', 'view_page', 'add_favorite', 'remove_favorite', 'add_planner', 'remove_planner', 'export_pdf'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel plans for saving itineraries
export const travelPlans = pgTable("travel_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  spots: text("spots").notNull(), // JSON string representing planned spots: [{ provinceId, spotId }]
  tripDays: integer("trip_days").default(3).notNull(),
  transportMode: text("transport_mode").default("car").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations for User -> Activities and Travel Plans
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(userActivities),
  travelPlans: many(travelPlans),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
}));

export const travelPlansRelations = relations(travelPlans, ({ one }) => ({
  user: one(users, {
    fields: [travelPlans.userId],
    references: [users.id],
  }),
}));
