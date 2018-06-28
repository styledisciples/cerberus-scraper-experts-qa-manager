/* jshint esversion : 6 */
/* jslint node: true */

module.exports = (function () {
    let settings = {
        "mongo": {
            "uri": process.env.MONGO_CONNECTION_STRING, //"mongodb://81.174.151.175:27017/hades_dev",
            "experts": "experts"
        }
    };

    return settings;
}());