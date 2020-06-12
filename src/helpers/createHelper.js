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
    const max = rulesArray.length;
    let intervals = newRule.intervals;
    
    let days = newRule.date ? newRule.date : newRule.days;
    let flag = newRule.date ? "date" : "days";

    let intervalsChecked = intervals.map(interval => {
        let intervalChecked = {};
        intervalChecked.interval = interval;

        rulesArray.forEach(rule => {
            let rulesIntervals = Object.entries(rule[1].intervals);
            const max = rule[1].intervals.length;
            let check = false;

            rulesIntervals.forEach(e => {
                if((interval.start <= e[1].end)  &&  (interval.end >= e[1].start) && ((days == rule[1].date) || (rule[1].days.some(r=> days.indexOf(r) >= 0)) || (rule[1].days.includes(getDay(days))))){
                    check = true;
                }

                intervalChecked.check = check;
                /*
                for (let index = 0; index < max; index++) {
                    let check = false;
                    if((interval.start <= e[1].end)  &&  (interval.end >= e[1].start) && ((days == rule[1].date) || (rule[1].days.some(r=> days.indexOf(r) >= 0)) || (rule[1].days.includes(getDay(days))))){
                        check = true;
                        intervalChecked.check = check;
                        break;
                    }

                    intervalChecked.check = check;   
                }*/
            });
            
        });
        
        if(!intervalChecked.check)
            return interval;
        else
            return;
    });

    return intervalsChecked.filter(function(interval) {return interval != null});
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