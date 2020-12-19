"use strict";

function initApp() {
    reportService.getReports().then( function (res) {
        // process report here
        console.log('Response=', res);
    } ).catch( function (err) {
        console.log( 'ErrorReport=', err );
    } );
}

initApp();
