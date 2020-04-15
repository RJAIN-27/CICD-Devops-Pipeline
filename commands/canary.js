const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const sshSync = require("../lib/ssh");
const child = require("child_process");

exports.command = "canary <blueBranch> <greenBranch>";
exports.desc = "Spin up 3 local machines";

exports.builder = (yargs) => {
  yargs.options({});
};

exports.handler = async (argv) => {
  const { blueBranch, greenBranch } = argv;
  (async () => {
    if (blueBranch != null && greenBranch != null) {
      await run(blueBranch, greenBranch);
      // console.log(g);
    } else {
      console.error("Arguments missing");
    }
  })();
};

async function run(blueBranch, greenBranch) {
  console.log(blueBranch);
  console.log(greenBranch);

  console.log(chalk.blueBright("Provisioning one server..."));
  let result = child.spawnSync(
    `bakerx`,
    `run master bionic --ip 192.168.33.30 --sync --memory 3072`.split(" "),
    { shell: true, stdio: "inherit" }
  );
  if (result.error) {
    console.log(result.error);
    process.exit(result.status);
  }

  console.log(chalk.blueBright("Provisioning two server..."));
  result = child.spawnSync(
    `bakerx`,
    `run broken bionic --ip 192.168.33.40 --memory 3072`.split(" "),
    { shell: true, stdio: "inherit" }
  );
  if (result.error) {
    console.log(result.error);
    process.exit(result.status);
  }

  console.log(chalk.blueBright("Provisioning three server..."));
  result = child.spawnSync(
    `bakerx`,
    `run monitor bionic --ip 192.168.33.50 --memory 3072`.split(" "),
    { shell: true, stdio: "inherit" }
  );
  if (result.error) {
    console.log(result.error);
    process.exit(result.status);
  }
}
