import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "./sql";

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "./server/db/migrations" });
    console.log("Migration complete");
  } catch (error) {
    console.log(error);
  }

  process.exit(0);
};

main();
