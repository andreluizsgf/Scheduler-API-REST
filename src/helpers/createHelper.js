const moment = require("moment");
const Validator = require('jsonschema').Validator;

const getDay = function(date){ 
    return moment(date, "DD-MM-YYYY").format('dddd');
}

const getNewRuleId = function(rules){
    const ids = Object.keys(rules);
    
    if(ids.length){
        const max = ids.reduce(function(a, b) {
            return Math.max(a, b) || 0;
        });

        return +max;
    }
    else
        return 0;
} 

const validateRule = function(newRule, rules){
    let rulesArray = Object.entries(rules);
    let intervals = newRule.intervals;
    
    //check if the rule is based on days (weeky, daily) or an specific date.
    let days = newRule.date ? newRule.date : newRule.days;
    let flag = newRule.date ? "date" : "days";

    let intervalsChecked = intervals.map(interval => {
        let intervalChecked = {};
        intervalChecked.interval = interval;

        rulesArray.forEach(rule => {
            let rulesIntervals = Object.entries(rule[1].intervals);
            let check = false;

            rulesIntervals.forEach(e => {

                if(flag == "date"){ //based on specific date, checks if there is any conflict with created rules
                    if((interval.start < e[1].end)  &&  (interval.end > e[1].start) && (days == rule[1].date || (rule[1].days.includes(getDay(days)))) ){
                        check = true;
                        intervalChecked.check = check;
                    }
                }
                else if(flag == "days"){ //based on days of the week, checks if there is any conflict with created rules
                    let array3 = days.filter(function(day) { return !(rule[1].days.includes(day)) });
                    intervalChecked.days = array3;
                    if((interval.start < e[1].end)  &&  (interval.end > e[1].start && (rule[1].days.some(r=> days.indexOf(r) >= 0) || (days.includes(getDay(rule[1].date))))) && !array3.length ){
                        check = true;
                        intervalChecked.check = check;
                    }
                }

                
            });
            
        });

        if(!intervalChecked.check){
            return intervalChecked;
        }
        else
            return;
    });

    return intervalsChecked.filter(function(e){return e != undefined});
};

const validateRuleFormat = function(rule){
    const validator = new Validator();
    let schema = {
        "id": "/Rule",
        "type": "object",
        "properties": {
            "date": {"type": "string"},
            "days": {"type": "array"},
            "intervals": {"type": "array"}
        },
        "required": ["intervals"]
    }
    validator.addSchema(schema, '/Rule');
    
    return validator.validate(rule, schema).errors;

}

module.exports = { getNewRuleId, validateRule, validateRuleFormat }