// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
Chart.plotType = null;
var myAreaChart = null;

// Area Chart
function plotAreaChart(data, plotType) {
    if (!data) return;
    if (Chart.plotType === plotType) return;
    plotType = plotType ? plotType : 'Alert'; // Alert, Checks, Nodes.
    Chart.plotType = plotType;
    var title = plotType === 'Alert' ? 'Total Alerts' : plotType === 'Checks' ? 'Total Node Checks' : 'Total Nodes';
    var results = data.map(function (report) {
        if (plotType === 'Nodes') {
            return report.nodes ? report.nodes.length : 0;
        }
        if (plotType === 'Checks') {
            if (report.nodes && report.nodes.length) {
                return report.nodes.reduce(function(a, b) {
                    var first =  a.checks ? a.checks.length : 0;
                    var second =  b.checks ? b.checks.length : 0;
                    return first + second;
                });
            }
            return 0;
        }
        return report.total_alerts || 0;
    });

    if (myAreaChart) {
        myAreaChart.data.datasets[0].data = results;
        myAreaChart.data.datasets[0].label = title;
        myAreaChart.update();
        return;
    }
    var ctx = document.getElementById( 'myAreaChart' );
    myAreaChart = new Chart( ctx, {
        type: 'line',
        data: {
            labels: data.map(function (item, index) {
               return item.host.name;
            }),
            datasets: [{
                label: title,
                lineTension: 0.3,
                backgroundColor: 'rgba(78, 115, 223, 0.05)',
                borderColor: 'rgba(78, 115, 223, 1)',
                pointRadius: 2,
                pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                pointBorderColor: 'rgba(78, 115, 223, 1)',
                pointHoverRadius: 0.5,
                pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
                pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                pointHitRadius: 4,
                pointBorderWidth: 1,
                data: results,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 12
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 10,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return value;
                        }
                    },
                    gridLines: {
                        color: 'rgb(234, 236, 244)',
                        zeroLineColor: 'rgb(234, 236, 244)',
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: 'rgb(255,255,255)',
                bodyFontColor: '#858796',
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + tooltipItem.yLabel;
                    }
                }
            }
        }
    } );
}
