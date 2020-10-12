const process = require("child_process");

try {
  process.exec("pm2 start process.json", function (error, stdout, stderr) {
    if (error !== null) {
      console.log("exec error: " + error);
    }
  });
} catch (error) {
  console.log("process.exec", error);
}
