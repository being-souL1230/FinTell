CREATE TYPE "public"."experience_level" AS ENUM('new', 'some', 'basic');--> statement-breakpoint
CREATE TYPE "public"."financial_goal" AS ENUM('emergency_fund', 'debt_reduction', 'monthly_saving', 'education', 'home', 'business', 'other');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('hi', 'en', 'mr', 'ta', 'bn', 'te', 'gu', 'pa', 'kn', 'ml', 'or');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."simulator_type" AS ENUM('savings', 'fd', 'emi');--> statement-breakpoint
CREATE TABLE "ai_chat_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"source" varchar(20) DEFAULT 'knowledge_base' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(60) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(10) DEFAULT '🏅' NOT NULL,
	"xp_reward" integer DEFAULT 10 NOT NULL,
	CONSTRAINT "badges_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "glossary_terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"term" varchar(120) NOT NULL,
	"simple_meaning" text NOT NULL,
	"used_for" text NOT NULL,
	"category" varchar(80) DEFAULT 'general' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "glossary_terms_term_unique" UNIQUE("term")
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"lesson_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"quiz_score" integer,
	"quiz_total" integer,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"category" varchar(80) NOT NULL,
	"icon" varchar(10) DEFAULT '📘' NOT NULL,
	"difficulty" varchar(20) DEFAULT 'easy' NOT NULL,
	"summary" text NOT NULL,
	"why_it_matters" text NOT NULL,
	"explanation" text NOT NULL,
	"example" text NOT NULL,
	"common_mistake" text NOT NULL,
	"safety_tip" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lessons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "money_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"monthly_income" integer DEFAULT 0 NOT NULL,
	"fixed_expenses" integer DEFAULT 0 NOT NULL,
	"variable_expenses" integer DEFAULT 0 NOT NULL,
	"existing_debt_emi" integer DEFAULT 0 NOT NULL,
	"savings_goal_name" varchar(160) DEFAULT 'Emergency fund' NOT NULL,
	"savings_goal_amount" integer DEFAULT 30000 NOT NULL,
	"current_savings" integer DEFAULT 0 NOT NULL,
	"preferred_monthly_saving" integer DEFAULT 0 NOT NULL,
	"monthly_financial_goal" "financial_goal" DEFAULT 'emergency_fund' NOT NULL,
	"buffer_preference" integer DEFAULT 50 NOT NULL,
	"notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monthly_money_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"month_key" varchar(7) NOT NULL,
	"planned_saving" integer DEFAULT 0 NOT NULL,
	"actual_saving" integer DEFAULT 0 NOT NULL,
	"actual_fixed_expenses" integer DEFAULT 0 NOT NULL,
	"actual_variable_expenses" integer DEFAULT 0 NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"question" text NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_c" text NOT NULL,
	"option_d" text NOT NULL,
	"correct_option" varchar(1) NOT NULL,
	"explanation" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scam_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"scenario_id" integer NOT NULL,
	"chosen_index" integer NOT NULL,
	"correct" boolean NOT NULL,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scam_scenarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"category" varchar(80) NOT NULL,
	"difficulty" varchar(20) DEFAULT 'easy' NOT NULL,
	"channel" varchar(40) DEFAULT 'SMS' NOT NULL,
	"message" text NOT NULL,
	"context" text,
	"options" jsonb NOT NULL,
	"correct_option_index" integer NOT NULL,
	"explanation" text NOT NULL,
	"safety_lesson" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulator_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" "simulator_type" NOT NULL,
	"input_json" jsonb NOT NULL,
	"result_json" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"badge_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(190) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"language" "language" DEFAULT 'hi' NOT NULL,
	"experience_level" "experience_level",
	"onboarded" boolean DEFAULT false NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai_chat_logs" ADD CONSTRAINT "ai_chat_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "money_profiles" ADD CONSTRAINT "money_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_money_progress" ADD CONSTRAINT "monthly_money_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scam_attempts" ADD CONSTRAINT "scam_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scam_attempts" ADD CONSTRAINT "scam_attempts_scenario_id_scam_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scam_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulator_history" ADD CONSTRAINT "simulator_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_progress_user_lesson_idx" ON "lesson_progress" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "money_profiles_user_idx" ON "money_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "monthly_money_progress_user_month_idx" ON "monthly_money_progress" USING btree ("user_id","month_key");--> statement-breakpoint
CREATE UNIQUE INDEX "user_badges_user_badge_idx" ON "user_badges" USING btree ("user_id","badge_id");