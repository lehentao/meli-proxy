
const configs = {};
function setConfig(conf) {
  Object.keys(conf).forEach((key) => {
    configs[key] = conf[key];
  })
}

module.exports = { configs, setConfig }