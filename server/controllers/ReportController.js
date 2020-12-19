const ResponseHandler = require( '../dtos/ResponseHandler' );
const ReportService = require( '../services/apis/ReportService' );
const messages = require( '../configs/messages' );

class ReportController {

    static async getReportStatus(req, res) {
       try {
           const data = await ReportService.getReportStatus(req.params.id);
           ResponseHandler.success(res, data, messages.reportStatus);
       } catch (e) {
           ResponseHandler.error(res, e.message);
       }
    }

    static async getReport(req, res) {
        try {
            const data = await ReportService.getReport();
            ResponseHandler.success(res, data, messages.report);
        } catch (e) {
            ResponseHandler.error(res, e.message);
        }
    }

}

module.exports = ReportController;
