CREATE TABLE `tasks` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`title` text NOT NULL,
	`description` text,
	`is_completed` boolean NOT NULL,
	`is_important` boolean NOT NULL,
	`priority` enum('P1','P2','P3','P4') NOT NULL);
