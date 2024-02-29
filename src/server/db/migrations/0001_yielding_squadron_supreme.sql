CREATE TABLE `lists` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	CONSTRAINT `lists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD `list_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` DROP COLUMN `user_id`;