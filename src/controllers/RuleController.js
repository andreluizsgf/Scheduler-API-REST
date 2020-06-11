'use strict';
const fs = require('fs');
const database = "src/database/rules.json";
const helper = require("../helpers/getAvailableIntervals")
const createHelper = require("../helpers/createHelper")

module.exports = {

    index(req, res){
        try {
            const rules = JSON.parse(fs.readFileSync(database, 'utf8'));
            return res.status(200).json({
                message: "Rules successfully listed.",
                status: true,
                metadata: rules
            });
        }
        catch (err) {
            return res.status(400).json({
                message: "problems listing the rules.",
                status: false,
                error: err.message
            });
        }
    },

    create(req, res) {
        try {
            const rule = req.body;
            
            const rules = JSON.parse(fs.readFileSync(database, 'utf8'));
            
            const validatedIntervals = createHelper.validateRule(req.body, rules);
            
            if(validatedIntervals == undefined){
                return res.status(400).json({
                    message: "All intervals are already created.",
                    status: true,
                });
            }
                
            rule.intervals = validatedIntervals;
            
            const max = createHelper.getNewRuleId(rules);

            const novaRuleId = max + 1;

            rules[novaRuleId] = rule;
            const rulesTratadas = JSON.stringify(rules,null,4); // 2 || 4

            fs.writeFileSync(database, rulesTratadas, 'utf8');
            
            return res.status(201).json({
                message: "Rule successfully created.",
                status: true,
                metadata: rule
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
        const id = req.body.id;

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

            const rulesTratadas = JSON.stringify(rules,null,4);

            fs.writeFileSync(database, rulesTratadas, 'utf8');
            
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

            const dates = helper.getDaysByInterval(startDay, finalDay);
            const intervalsByDate =  await helper.getIntervalsByDate(dates);
            const intervalsByDayOfWeek = await helper.getIntervalsByDayOfWeek(dates);
            const allIntervals = helper.getAllIntervals(intervalsByDate, intervalsByDayOfWeek, dates);
            const availableHours = helper.getAvailableHours(dates, allIntervals); 
            
            return res.send(availableHours);
        } catch(err){
            return res.status(500).json({
                message: "Problems listing available a times.",
                status: false,
                error: err.message
            });
        }   
    },
};