"use strict";

//TODO: Graph representation and data overview
//TODO: Loading View for the app
//TODO: Error Checking Update.


var reports = {
    service_reports: []
};

var reportJob = {job_id: null};

var reportTrail = 0;

/**
 * Total Counts Card implementation
 */
function generateStatistics() {
    $('#totalAlerts').html(reports.total_alerts || 0);
    var data = reports.service_reports.reduce(function (result, data) {
        result.success += ( data.status_code < 400 ? 1 : 0);
        result.failed += ( (data.status_code >= 400 && data.status_code !== 501) || typeof data.status_code === 'string' ? 1 : 0);
        result.unimplemented += ( data.status_code === 501 ? 1 : 0);
        return result;
    }, {success: 0, failed: 0, unimplemented: 0});
    var unImplementedPercent = Math.ceil(data.unimplemented / reports.service_reports.length * 100) + '%';
    $('#successService').html(data.success || 0);
    $('#failedService').html(data.failed || 0);
    $('#unimplementedService').html(unImplementedPercent);
    $('#progressbarUnimplemented').attr('aria-valuenow',  data.unimplemented || 0).css('width', unImplementedPercent);
    $('#summaryNow').html('Detailed Summary Report for ' + new Date(reports.requested_at).toDateString());
    plotChart(data, reports.service_reports);
}

/**
 * Show Area Graph type
 */
function showGraph() {
    var type = $('#plotType').val();
    plotAreaChart(reports.service_reports, type);
}

/**
 * Show Service based on filter
 */
function showServiceFilter() {
    var type = $('#filterService').val();
    var tableBody = $('#report-table-body');
    if (type === 'All') {
        tableBody.html('');
        generateReportTable(reports.service_reports);
        return;
    }
    var data = reports.service_reports.filter(function (report) {
        if (type === 'Success') {
            return report.status_code < 400
        }

        if (type === 'Alert') {
            return report.total_alerts > 0;
        }

        if (type === 'Unimplemented') {
            return report.status_code === 501;
        }

        return (report.status_code >= 400 && report.status_code !== 501) || typeof report.status_code === 'string'; //failed
    });
    tableBody.html('');
    generateReportTable(data);
}

/**
 * This is used to plot necessary charts
 * @param pieChartData
 * @param areaChartData
 */
function plotChart(pieChartData, areaChartData) {
    if (pieChartData) {
        plotPieChart( pieChartData );
    }
    plotAreaChart(areaChartData);
}

/**
 * This is used to get status reports
 */
function getStatusReport() {
    reports = CacheUtil.get(REPORT_STATUS_KEY);
    if (reports) {
        generateReportTable(reports.service_reports);
        generateStatistics();
        $('#overlay').addClass('d-none');
        return;
    }
    reportTrail++;
    reportService.getReportStatus(reportJob.job_id).then(function (res) {
        reports = res.data; // store report globally
        CacheUtil.set(REPORT_STATUS_KEY, reports); // implemented caching to reduce load on the server at every refresh
        reportTrail = 0;
        generateReportTable(reports.service_reports); // populate table view.
        generateStatistics();
        $('#overlay').addClass('d-none');
    }).catch(function (err) {
        if (reportTrail > 5) {
            $('#overlay').addClass('d-none');
            alert("Error Occurred while trying to get report status using job identification, please refresh... Thank you");
            return;
        }
        getStatusReport(); // retry calling status again
    })
}

/**
 *  This is used to generate table data.
 */
function generateReportTable(data) {
    if (!reports) return;
    var tableBody = $('#report-table-body');
    data.forEach(function (report, index) {
        tableBody.append(
            "<tr>" +
            "<td>" + (index + 1) + "</td>" +
            "<td>" + (report.host.name) + "</td>" +
            "<td>" + (report.host.downstream_protocol + '://' + report.host.downstream_host ) + "</td>" +
            "<td>" + (report.total_alerts || 0) + "</td>" +
            "<td>" + (report.nodes.length || 0) + "</td>" +
            "<td>" + ( '(' + report.status_code + ') ' + report.status_text) + "</td>" +
            "<td>" + (new Date(report.requested_at).toUTCString()) + "</td>" +
            "<td>" + (new Date(report.completed_at).toUTCString()) + "</td>" +
            "<td>" + ( report.nodes.length ?
            "<button class='btn btn-primary btn-sm' onclick='viewNodeDetail(" + JSON.stringify(report) + ")'> View Detail" + "</button>"
            : 'No Nodes' ) +"</td>" +
            "</tr>"
        )
    });
}

/**
 * This is used to view node statuses and parts
 */
function viewNodeDetail(report) {

    if (!report || !report.nodes) return;
    $('#checksModalTitle').html(report.host.name + "'s Node Checking Detail Report");
    var tableBody = $('#node-table-body');

    function getNodeChecks(node) {
        var tableChecks = '-';
        if ( node.checks && node.checks.length ) {
            var checks = node.checks.reduce( function(result, check) {
                result += '<tr>' +
                    '<td>' + check.name + '</td>' +
                    '<td>' + check.state + '</td>' +
                    '<td>' + check.message + '</td>' +
                    '<td>' + check.started_at + '</td>' +
                    '<td>' + check.completed_at + '</td>' +
                    '</tr>';
                return result;
            }, '' );
            tableChecks = '<table width=\'100%\'>' +
                '<tr>' +
                '<th width=\'25%\'>Name</th>' +
                '<th width=\'10%\'>State</th>' +
                '<th width=\'35%\'>Message</th>' +
                '<th width=\'15%\'>Started At</th>' +
                '<th width=\'15%\'>Completed At</th>' +
                '</tr>' +
                checks
                +
                '</table>';
        }
        return tableChecks;
    }

    report.nodes.forEach(function (node, index) {
        var tableChecks = getNodeChecks( node );
        tableBody.append(
            "<tr>" +
            "<td>" + (index + 1) + "</td>" +
            "<td>" + (node.web_node) + "</td>" +
            "<td>" + (node.total_alerts || 0) + "</td>" +
            "<td>" + ( '(' + report.status_code + ') ' + report.status_text) + "</td>" +
            "<td>" + tableChecks + "</td>" +
            "</tr>"
        )
    });

    $('#node_checks-view').modal('show');
}

/**
 *  This is used to clear cache and refresh data on client end to get newly updated reports
 */
function refreshReport() {
    reportTrail = 0;
    CacheUtil.clear();
    initApp();
}

/**
 *  This is used to retry a report for already generated jobID
 */
function retryReport() {
    reportTrail = 0;
    $('#overlay').removeClass('d-none');
    getStatusReport();
}

/**
 * This is application initialization entry point.
 */
function initApp() {
    $('#overlay').removeClass('d-none');
    reportTrail = 0;
    reportJob = CacheUtil.get(REPORT_JOB_KEY);
    if (reportJob) {
        getStatusReport(); // get status report after few seconds
        return;
    }
    reportService.getReports().then( function (res) {
        // process report here
        reportJob = res.data;
        CacheUtil.set(REPORT_JOB_KEY, reportJob); // implemented caching to reduce load on the server at every refresh
        setTimeout(function () {
            getStatusReport(); // get status report after few seconds
        }, 5000);
    } ).catch( function (err) {
        $('#overlay').addClass('d-none');
        alert("Error Occurred while trying to get report job identification, please refresh... Thank you");
    } );
}

initApp();
