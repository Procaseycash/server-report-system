"use strict";

var reportService = {
  getReports: function() {
      return apiService.get(REPORT_API);
  },
  getReportStatus: function(jobId) {
      return apiService.get(REPORT_API + jobId + '/status' );
  }
};
