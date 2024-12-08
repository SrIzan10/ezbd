import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const birthdayTable = sqliteTable("birthday", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: text().notNull(),
  date: text().notNull(),
  authorId: text().notNull(),
});
