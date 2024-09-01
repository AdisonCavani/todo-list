import { logger } from "@lib/logger";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./sql";

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "./server/db/migrations" });
    logger.info("Migration complete");
  } catch (error) {
    logger.error(error as string);
  }

  process.exit(0);
};

main();
