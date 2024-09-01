export const logger = {
  error: (message: string) => {
    console.log(getTimestamp(), "[\x1b[31merror\x1b[0m]", message);
  },
  info: (message: string) => {
    console.log(getTimestamp(), "[\x1b[32minfo\x1b[0m]", message);
  },
};

function getTimestamp() {
  return new Date().toISOString().replace("T", " ").replace("Z", "");
}
