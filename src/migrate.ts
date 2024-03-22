import { db } from "@server/db/sql";
import { migrate } from "drizzle-orm/neon-http/migrator";

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
