const Utils = {
  timeDiff: (aheadTime) => new Date(aheadTime).getTime() - new Date().getTime(),
  isTokenExpires: () => {
    const secrets = require('../configs/secrets');
    return !secrets.expires_in || Utils.timeDiff(secrets.expires_at) < 1;
  }
};

module.exports = {Utils};
