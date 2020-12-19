"use strict";

var CacheUtil = function () {
    return {
        /**
         * Set Data to local storage
         * @param key
         * @param data
         */
        set: function (key, data) {
            this.lset(key, data)
        },

        /**
         * get data from local storage
         * @param key
         */
        get: function (key) {
            return this.lget(key);
        },

        /**
         * Set Data to session storage
         * @param key
         * @param data
         */
        sset: function (key, data) {
            sessionStorage.setItem(key, JSON.stringify(data))
        },
        /**
         * Set Data to local storage
         * @param key
         * @param data
         * @param callback - optional
         */
        lset: function (key, data) {
            localStorage.setItem(key, JSON.stringify(data))
        },

        /**
         * get Data to local storage
         * @param key
         */
        lget: function (key) {
            return JSON.parse(localStorage.getItem(key))
        },

        /**
         * get Data to session storage
         * @param key
         */
        sget: function (key) {
            return JSON.parse(sessionStorage.getItem(key))
        },

        /**
         * Used to clear cache Data
         */
        clear: function () {
            sessionStorage.clear();
            localStorage.clear();
        },

        /**
         * This is used to remove a data by key
         * @param key
         */
        sRemove: function (key) {
            sessionStorage.removeItem(key);
        },

        /**
         * This is used to remove a data by key
         * @param key
         */
        lRemove: function (key) {
            localStorage.removeItem(key);
        },

        remove: function (key) {
            this.lRemove(key);
            this.sRemove(key);
        },

        /**
         * This is used to clear data in session
         */
        sclear: function () {
            sessionStorage.clear();
        },

        /**
         * This is used to clear data in local
         */
        lclear: function () {
            localStorage.clear();
        }
    }
}();
