'use strict';
const fs = require('fs');
const database = "src/database/rules.json";
const helper = require("../helpers/getAvailableIntervals")
const createHelper = require("../helpers/createHelper")
const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

module.exports = {

    index(req, res){
        try {
            const rules = JSON.parse(fs.readFileSync(database, 'utf8'));
            return res.status(200).json({
                message: "Rules successfully listed.",
                status: true,
                rules: rules
            });
        }
        catch (err) {
            return res.status(400).json({
                message: "Problems listing the rules.",
                status: false,
                error: err.message
            });
        }
    },

    create(req, res) {
        try {
            const rule = req.body;

            if(!rule.date && !rule.days.length ){
                rule.days = allDays; //if rule is daily puts all days in days array
            }
            
            let err = createHelper.validateRuleFormat(rule) //check rule format, return error if there is any

            if(err.length){
                return res.status(500).json({
                    message: "Please use the right format for rules.",
                    status: false,
                    error: err.message
                });
            }

            const rules = JSON.parse(fs.readFileSync(database, 'utf8'));
            
            const validatedRules = createHelper.validateRule(req.body, rules); //check if there is any conflict with the rules informed;
            
            if(!validatedRules.length){ //it only occurs all intervals informed are already created;
                return res.status(400).json({
                    message: "All intervals are already created.",
                    status: true,
                });
            }

            rule.intervals = validatedRules.map(element => {return(element.interval) });
            let days = validatedRules.map(element => { return element.days }).filter(function(e){return e != undefined}); //turn all days arrays into one;
            if(days.length)
                rule.days = [...new Set(days.reduce((a, b) => [...a, ...b], []))]; //delete any repeated day

            const max = createHelper.getNewRuleId(rules);

            const newRuleId = max + 1;

            rules[newRuleId] = rule;
            const rulesHandled = JSON.stringify(rules,null,4); // 2 || 4

            fs.writeFileSync(database, rulesHandled, 'utf8');
            
            return res.status(201).json({
                message: "Rule successfully created.",
                status: true,
                rule: rule
            });
        }
        catch (err) {
            return res.status(500).json({
                message: "Problems creating the new rule.",
                status: false,
                error: err.message
            });
        }
    },

    delete(req, res){
        try {
            const id = req.body.id;

            if (!id) {
                return res.status(400).json({
                    message: "Please inform a valid id.",
                    status: true
                });
            }

            const rules = JSON.parse(fs.readFileSync(database, 'utf8'));

            if (!rules[id]) {
                return res.status(404).json({
                    message: "No rule found, impossible to delete.",
                    status: true
                });
            }

            delete rules[id];

            const rulesHandled = JSON.stringify(rules,null,4);

            fs.writeFileSync(database, rulesHandled, 'utf8');
            
            return res.status(200).json({
                message: "Rule successfully deleted",
                status: true
            });
        }
        catch (err) {
            return res.status(500).json({
                message: "Problems deleting a rule.",
                status: false,
                error: err.message
            });
        }
        
    },
    
    async available(req, res){
        try{
            const startDay = req.body.days[0],
                  finalDay = req.body.days[1];

            const dates = helper.getDaysByInterval(startDay, finalDay); //it returns all dates between the interval
            const intervalsByDate =  await helper.getIntervalsByDate(dates); //it returns all created intervals based on the array of dates;
            const intervalsByDayOfWeek = await helper.getIntervalsByDayOfWeek(dates); //it returns all created intervals based on the days of the week of each date in between the interval.
            const allIntervals = helper.getAllIntervals(intervalsByDate, intervalsByDayOfWeek, dates); //it concatenate all intervals;
            const availableHours = helper.getAvailableHours(dates, allIntervals); 
            
            return res.status(201).json({
                message: "All available hours",
                status: true,
                availableHours: availableHours
            });
        } catch(err){
            return res.status(500).json({
                message: "Problems listing available a times.",
                status: false,
                error: err.message
            });
        }   
    },
};
