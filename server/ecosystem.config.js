module.exports = {
  apps: [
    {
      name: "app1",
      script: "./app.js",
      cron_restart: "0 0 * * *",
    },
  ],
};
