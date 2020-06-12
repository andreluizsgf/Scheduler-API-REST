'use strict';
const fs = require('fs');
const database = "src/tests/database/rules.json"
const helper = require("../../helpers/getAvailableIntervals")
const createHelper = require("../../helpers/createHelper")

module.exports = {

    create(req) {
        const rule = req;

        const rules = JSON.parse(fs.readFileSync(database, 'utf8'));
        
        const max = createHelper.getNewRuleId(rules);

        const novaRuleId = max + 1;

        rules[novaRuleId] = rule;
        
        const rulesTratadas = JSON.stringify(rules,null,4); // 2 || 4

        fs.writeFileSync(database, rulesTratadas, 'utf8');

        return rule;
    },

    delete(id){
        const rules = JSON.parse(fs.readFileSync(database, 'utf8'));

        delete rules[id];

        const rulesTratadas = JSON.stringify(rules,null,4);

        fs.writeFileSync(database, rulesTratadas, 'utf8');        
    },
    
    async available(days){
        
        const startDay = days[0],
                finalDay = days[1];

        const dates = helper.getDaysByInterval(startDay, finalDay);
        const intervalsByDate =  await helper.getIntervalsByDate(dates);
        const intervalsByDayOfWeek = await helper.getIntervalsByDayOfWeek(dates);
        const allIntervals = helper.getAllIntervals(intervalsByDate, intervalsByDayOfWeek, dates);
        const availableHours = helper.getAvailableHours(dates, allIntervals); 
        
        return availableHours;   
    },
};
