const ReportRouter = require('./ReportRouter');

class AppRoute {
  static init(app) {
    new ReportRouter(app);
  }
}

module.exports = AppRoute;
