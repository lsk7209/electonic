import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const eiaStateRates = sqliteTable(
  "eia_state_rates",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    state: text("state").notNull(),
    sector: text("sector").notNull(),
    period: text("period").notNull(),
    centsPerKwh: real("cents_per_kwh").notNull(),
    vintage: integer("vintage").notNull(),
    sourceForm: text("source_form").notNull().default("EIA-826"),
    createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
    updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP")
  },
  (table) => ({
    uniq: uniqueIndex("eia_state_rates_unique").on(table.state, table.sector, table.period, table.vintage),
    statePeriodIdx: index("eia_state_rates_state_period_idx").on(table.state, table.period)
  })
);

export const eiaUtilityRates = sqliteTable(
  "eia_utility_rates",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    state: text("state").notNull(),
    utilitySlug: text("utility_slug").notNull(),
    utilityName: text("utility_name").notNull(),
    year: integer("year").notNull(),
    customers: integer("customers"),
    revenueThousandDollars: real("revenue_thousand_dollars"),
    salesMwh: real("sales_mwh"),
    centsPerKwh: real("cents_per_kwh").notNull(),
    vintage: integer("vintage").notNull(),
    sourceForm: text("source_form").notNull().default("EIA-861"),
    createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
    updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP")
  },
  (table) => ({
    uniq: uniqueIndex("eia_utility_rates_unique").on(table.state, table.utilitySlug, table.year, table.vintage),
    utilityIdx: index("eia_utility_rates_slug_idx").on(table.utilitySlug)
  })
);
