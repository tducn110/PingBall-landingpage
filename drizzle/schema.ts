import { pgTable, uuid, text, integer, char, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const tournamentStatusEnum = pgEnum("tournament_status", [
  "upcoming",
  "active",
  "completed",
]);

export const tournaments = pgTable("tournaments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  status: tournamentStatusEnum("status").default("upcoming"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const teamStatusEnum = pgEnum("team_status", [
  "pending",
  "confirmed",
  "rejected",
]);

export const groupIdEnum = pgEnum("group_id", ["A", "B", "C", "D"]);

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournament_id: uuid("tournament_id")
    .notNull()
    .references(() => tournaments.id, { onDelete: "cascade" }),
  group_id: groupIdEnum("group_id").notNull(),
  name: text("name").notNull(),
  player1_name: text("player1_name").notNull(),
  player1_student_id: text("player1_student_id"),
  player1_phone: text("player1_phone").notNull(),
  player2_name: text("player2_name").notNull(),
  player2_student_id: text("player2_student_id"),
  payment_proof_url: text("payment_proof_url"),
  status: teamStatusEnum("status").default("pending"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const matchStatusEnum = pgEnum("match_status", [
  "pending",
  "in_progress",
  "completed",
]);

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournament_id: uuid("tournament_id")
    .notNull()
    .references(() => tournaments.id, { onDelete: "cascade" }),
  group_id: groupIdEnum("group_id").notNull(),
  round: integer("round").notNull(),
  match_number: integer("match_number").notNull(),
  team1_id: uuid("team1_id").references(() => teams.id),
  team2_id: uuid("team2_id").references(() => teams.id),
  winner_id: uuid("winner_id").references(() => teams.id),
  status: matchStatusEnum("status").default("pending"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
