/* jshint esversion : 6 */
/* jslint node: true */

const mongodb = require("mongodb").MongoClient;
const settings = require("./settings");

function ExpertManager() {
    let me = this;
    me.isConnected = false;
    me.db = false;

    function connect() {
        return mongodb
            .connect(settings.mongo.uri)
            .then((db) => {
                me.db = db;
            })
            .catch((error) => {
                throw error;
            });
    }

    function getAllExperts() {
        //if they are not loaded load from MongoDB
        let collection = me.db.collection("experts");

        // if (me.experts)
        //     return new Promise((resolve) => { resolve(me.experts); });

        return collection
            .find({})
            .toArray()
            .then((experts) => {
                return (me.experts = experts);
            });
    }

    function getResults(collectionName) {
        //if they are not loaded load from MongoDB
        let collection = me.db.collection(collectionName || "scrapy_success_mixed_all");

        // if (me.results)
        //     return new Promise((resolve) => { resolve(me.results); });

        return collection
            .find({})
            .toArray()
            .then((recordset) => {
                return (me.results = recordset);
            });
    }

    /**
     * Get unique keys from experts for 'ares' and 'scrapy'.
     * @param {object} experts
     */
    function getUniqueExpertsKeys(experts) {
        let keys = [];
        if (!Array.isArray(experts))
            return false;

        for (let i = 0; i < experts.length; i++) {
            let scrapy = Object.keys(experts[i].scrapy || {});
            let ares = Object.keys(experts[i].ares || {});

            let currentKeys = [...scrapy, ...ares];
            for (let j = 0; j < currentKeys.length; j++) {

                if (keys.indexOf(currentKeys[j]) == -1)
                    keys.push(currentKeys[j]);
            }
        }

        return keys;
    }

    /**
     * Get unique keys from results.
     * @param {object} results
     */
    function getUniqueResultsKeys(results) {
        let keys = [];
        if (!Array.isArray(results))
            return false;

        for (let i = 0; i < results.length; i++) {
            let scrapy = Object.keys(results[i]);
            let ares = Object.keys(results[i].ares || {});

            let currentKeys = Object.keys(results[i]);
            for (let j = 0; j < currentKeys.length; j++) {

                if (keys.indexOf(currentKeys[j]) == -1)
                    keys.push(currentKeys[j]);
            }
        }

        return keys;
    }

    function tablifyExperts(experts) {
        try {
            let keys = getUniqueExpertsKeys(experts);
            return experts.map(function (value, index, array) {
                value.key_status = setExpertStatus(value, keys);
                return value;
            });
        } catch (e) {
            console.error(e);
        }
    }

    function setExpertStatus(expert, keys) {
        let key_status = {};

        keys.forEach(function (key) {
            if (expert.scrapy && expert.scrapy[key]) {
                if (typeof expert.scrapy[key] === 'object')
                    key_status[key] = "scrapy";
                else if (typeof expert.scrapy[key] === 'string')
                    key_status[key] = expert.scrapy[key];
            } else if (expert.ares && expert.ares[key]) {
                if (typeof expert.ares[key] === 'object')
                    key_status[key] = "ares";
                else if (typeof expert.ares[key] === 'string')
                    key_status[key] = expert.ares[key];
            } else
                key_status[key] = "";
        });

        return key_status;
    }

    me.connect = connect;
    me.getAllExperts = getAllExperts;
    me.getUniqueExpertsKeys = getUniqueExpertsKeys;
    me.getUniqueResultsKeys = getUniqueResultsKeys;
    me.tablifyExperts = tablifyExperts;
    me.getResults = getResults;

    return me;
}

module.exports = new ExpertManager();