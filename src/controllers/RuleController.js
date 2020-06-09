'use strict';
const fs = require('fs');
const database = "src/database/rules.json";

module.exports = {

    create(req, res) {
        var rule = {};
        rule.intervals = req.body.intervals;
        
        if(req.body.specificDay){
            rule.days = req.body.specificDay;
        }else if(req.body.daily){
            rule.days = "Everyday";
        }else if(req.body.weekly){
            rule.days = req.body.weekly;
        }

        fs.readFile(database, (err, data) => {
            if (err) throw err;
            let rules = JSON.parse(data);
            console.log(typeof data);
            var id = Object.keys(data).length;
            rules[id] = rule;
             
            let ruleJson = JSON.stringify(rules, null, 2);

            fs.writeFile(database, ruleJson, (err) => {
                if (err) throw err;

                return res.sendStatus(200);
            });
    
        });
        
    }
};