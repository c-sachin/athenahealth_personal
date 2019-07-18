var arrayFunctions = {
    /**
     * Parse solr response based on key name & sort type.
     * 
     * @param {string[]} resposneArray Solr Response json.
     * @param {string} keyname Key name.
     * @param {number} sortBy Sort type.
     * 
     * @returns Parsed solr response.
     */
    'getValueFromArray': function (resposneArray, keyname, sortBy) {
        let qty_value = ''
        if (sortBy == 2) {
            //higest
            let qty_value_array = resposneArray.reduce((prev, curr) => Math.round(prev[keyname]) > Math.round(curr[keyname]) ? prev : curr);
            qty_value = qty_value_array;
        }
        if (sortBy == 3) {
            //lowest 
            let qty_value_array = resposneArray.reduce((prev, curr) => Math.round(prev[keyname]) < Math.round(curr[keyname]) ? prev : curr);
            qty_value = qty_value_array;
        }
        if (sortBy == 4) {
            //mean value
            let sum = resposneArray.reduce((prev, curr) => curr[keyname] += prev[keyname]);
            qty_value = parseInt(sum) / resposneArray.length;
        }
        if (sortBy == 5) {
            //median
            resposneArray.sort((a, b) => a - b);
            let lowMiddle = Math.floor((resposneArray.length - 1) / 2);
            let highMiddle = Math.ceil((resposneArray.length - 1) / 2);
            qty_value = (Math.round(resposneArray[lowMiddle][keyname]) + Math.round(resposneArray[highMiddle][keyname])) / 2;
        }
        return qty_value;
    }
}

module.exports = arrayFunctions;