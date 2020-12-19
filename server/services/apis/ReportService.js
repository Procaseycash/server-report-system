const {env: ENV} = process;
const ApiService = require( '../ApiHandlerService' );

class ReportService {

    static async getReport() {
        return ApiService.post(ENV.REPORT_API);
    }

    static async getReportStatus(jobId) {
        return ApiService.get(ENV.REPORT_STATUS_API.replace(':jobId', jobId));
    }

}

module.exports = ReportService;
