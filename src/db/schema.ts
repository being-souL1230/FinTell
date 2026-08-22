import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const languageEnum = pgEnum("language", [
  "hi",
  "en",
  "mr",
  "ta",
  "bn",
  "te",
  "gu",
  "pa",
  "kn",
  "ml",
  "or",
]);
export const experienceEnum = pgEnum("experience_level", ["new", "some", "basic"]);
export const simulatorTypeEnum = pgEnum("simulator_type", ["savings", "fd", "emi"]);
export const financialGoalEnum = pgEnum("financial_goal", [
  "emergency_fund",
  "debt_reduction",
  "monthly_saving",
  "education",
  "home",
  "business",
  "other",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("user"),
  language: languageEnum("language").notNull().default("en"),
  experienceLevel: experienceEnum("experience_level"),
  hasBusiness: boolean("has_business").notNull().default(false),
  onboarded: boolean("onboarded").notNull().default(false),
  xp: integer("xp").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull().default("📘"),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("easy"),
  summary: text("summary").notNull(),
  whyItMatters: text("why_it_matters").notNull(),
  explanation: text("explanation").notNull(),
  example: text("example").notNull(),
  commonMistake: text("common_mistake").notNull(),
  safetyTip: text("safety_tip").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctOption: varchar("correct_option", { length: 1 }).notNull(),
  explanation: text("explanation").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    lessonId: integer("lesson_id")
      .references(() => lessons.id, { onDelete: "cascade" })
      .notNull(),
    completed: boolean("completed").notNull().default(false),
    quizScore: integer("quiz_score"),
    quizTotal: integer("quiz_total"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("lesson_progress_user_lesson_idx").on(t.userId, t.lessonId),
  }),
);

export const scamScenarios = pgTable("scam_scenarios", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("easy"),
  channel: varchar("channel", { length: 40 }).notNull().default("SMS"),
  message: text("message").notNull(),
  context: text("context"),
  options: jsonb("options").$type<string[]>().notNull(),
  correctOptionIndex: integer("correct_option_index").notNull(),
  explanation: text("explanation").notNull(),
  safetyLesson: text("safety_lesson").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const scamAttempts = pgTable("scam_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  scenarioId: integer("scenario_id")
    .references(() => scamScenarios.id, { onDelete: "cascade" })
    .notNull(),
  chosenIndex: integer("chosen_index").notNull(),
  correct: boolean("correct").notNull(),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

export const glossaryTerms = pgTable("glossary_terms", {
  id: serial("id").primaryKey(),
  term: varchar("term", { length: 120 }).notNull().unique(),
  simpleMeaning: text("simple_meaning").notNull(),
  usedFor: text("used_for").notNull(),
  category: varchar("category", { length: 80 }).notNull().default("general"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 10 }).notNull().default("🏅"),
  xpReward: integer("xp_reward").notNull().default(10),
});

export const userBadges = pgTable(
  "user_badges",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    badgeId: integer("badge_id")
      .references(() => badges.id, { onDelete: "cascade" })
      .notNull(),
    earnedAt: timestamp("earned_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("user_badges_user_badge_idx").on(t.userId, t.badgeId),
  }),
);

export const simulatorHistory = pgTable("simulator_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: simulatorTypeEnum("type").notNull(),
  inputJson: jsonb("input_json").notNull(),
  resultJson: jsonb("result_json").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const moneyProfiles = pgTable(
  "money_profiles",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    monthlyIncome: integer("monthly_income").notNull().default(0),
    fixedExpenses: integer("fixed_expenses").notNull().default(0),
    variableExpenses: integer("variable_expenses").notNull().default(0),
    existingDebtEmi: integer("existing_debt_emi").notNull().default(0),
    savingsGoalName: varchar("savings_goal_name", { length: 160 }).notNull().default("Emergency fund"),
    savingsGoalAmount: integer("savings_goal_amount").notNull().default(30000),
    currentSavings: integer("current_savings").notNull().default(0),
    preferredMonthlySaving: integer("preferred_monthly_saving").notNull().default(0),
    monthlyFinancialGoal: financialGoalEnum("monthly_financial_goal").notNull().default("emergency_fund"),
    bufferPreference: integer("buffer_preference").notNull().default(50),
    notes: text("notes"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("money_profiles_user_idx").on(t.userId),
  }),
);

export const monthlyMoneyProgress = pgTable(
  "monthly_money_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    monthKey: varchar("month_key", { length: 7 }).notNull(),
    plannedSaving: integer("planned_saving").notNull().default(0),
    actualSaving: integer("actual_saving").notNull().default(0),
    actualFixedExpenses: integer("actual_fixed_expenses").notNull().default(0),
    actualVariableExpenses: integer("actual_variable_expenses").notNull().default(0),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("monthly_money_progress_user_month_idx").on(t.userId, t.monthKey),
  }),
);

export const aiChatLogs = pgTable("ai_chat_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  source: varchar("source", { length: 20 }).notNull().default("knowledge_base"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
