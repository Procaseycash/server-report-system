"use strict";

$(function initApp() {
    reportService.getReports().then(function (res) {
        // process report here
    }).catch(function (err) {
        console.log('ErrorReport=', err);
    });
})();
