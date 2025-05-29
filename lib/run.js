const {
    readFile
} = require('fs');

function run(argv, fn) {
  const command = argv.command;

  processCommand(command, {
      argv,
      cliPwd: require.main.filename,
      targetPwd: (argv.path ? argv.path : process.cwd())
  }, err => {
      if (err) console.error(err);
      fn(err ? 1 : 0);
  });
};

function doLoadConfig(pwd) {
  const future = new Promise((resolve, reject) => {

      readFile(pwd, (err, result) => {
          if (err) {
              resolve(undefined, err);
          } else resolve(JSON.parse(result.toString()), undefined)
      })
  });
  return future;
};

function processCommand(command, env, fn) {
  doLoadConfig(env.argv.config ? env.argv.config : `${env.targetPwd}/jiconfig.json`)
      .then((config, err) => {
          if (!['install', 'stop', 'start', 'reset', 'generate-wallet'].includes(command)) {
              fn(`Command ${command} need jiconfig.json`);
              return;
          }
          const commands = {
              install: require("./commands/install"),
              stop: require("./commands/stop"),
              start: require("./commands/start"),
              reset: require("./commands/reset"),
              "generate-wallet": require("./commands/generate-wallet"),
            //   update: require("./commands/update")
          };

          if (commands[command] === undefined) {
              fn(`Command ${command} not found.`);
              return;
          }

          commands[command]({ command, ...env })
              .then(result => fn(result))
              .catch(error => fn(error))
      })
};

module.exports = run;