import { pgTable, text, timestamp, boolean, uuid, integer } from "drizzle-orm/pg-core";

export const connectedUsers = pgTable("connected_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  email: text("email"),
  phone: text("phone"),
  name: text("name"),
  deviceName: text("device_name"),
  termsReadComplete: boolean("terms_read_complete").default(false),
  connectedAt: timestamp("connected_at").defaultNow(),
  lastActivity: timestamp("last_activity").defaultNow(),
  sessionId: text("session_id"),
});

export const adminSettings = pgTable("admin_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  settingName: text("setting_name").notNull().unique(),
  value: text("value"),
  enabled: boolean("enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: text("updated_by"),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
});

export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actionType: text("action_type").notNull(),
  settingName: text("setting_name"),
  enabled: boolean("enabled"),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});
