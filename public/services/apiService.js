"use strict";
var apiService = {
  get: function (url, options) {
      options = options || {};
      return $.get(url, options).catch(errorCheck);
  },
  delete: function (url, options) {
      options = options || {};
      return $.delete(url, options).catch(errorCheck);
  },
  put: function (url, body, options) {
      options = options || {};
      return $.put(url, body, options).catch(errorCheck);
  },
  post: function (url, body, options) {
      options = options || {};
      return $.post(url, body, options).catch(errorCheck);
  },
  patch: function (url, body, options) {
      options = options || {};
      return $.patch(url, body, options).catch(errorCheck);
  },
};

function errorCheck(error) {
    console.log('error=', error);
    throw new Error(error.message);
}
