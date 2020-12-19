const {ReportController} = require('../controllers');

class ReportRouter {

  constructor(app) {
    const API_ROUTE = `${process.env.API_BASE}reports`;
    app.route(API_ROUTE).get(ReportController.getReports);
    app.route(`${API_ROUTE}/:id/status`).get(ReportController.getReportStatus);
  }
}

module.exports = ReportRouter;
