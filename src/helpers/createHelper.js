const moment = require("moment");

const getNewRuleId = function(rules){
    let lastId = Object.keys(rules)[Object.keys(rules).length - 1];

    if(lastId === undefined)
        lastId = 0;
        
    return +lastId + 1;
} 

const validateRule = function(rules, intervals){
    rulesArray = Object.entries(rules);
    
    intervals.forEach(interval => {
        let time = [moment(`2016-12-06 ${interval.start}`), moment(`2016-12-06 ${interval.end}`)];
        
        rulesArray.forEach(rule => {

            let intervals = rule.map(interval => {
                
                console.log(interval);
            });
        })
    });

    return "oi";
};

module.exports = { getNewRuleId, validateRule }