const moment = require("moment");
const fs = require('fs')
const database = "src/database/rules.json";

const getDaysByInterval = function(startDate, finalDate){ //gets all days between two given dates.
    let dates = [];

    let newDate = startDate;
    
    while(newDate != finalDate){
        dates.push(newDate); //push every added day to an array.
        newDate = moment(newDate, "DD-MM-YYYY").add(1, 'days').format('DD-MM-YYYY'); //we use moment to add days.
    }

    return dates; //returns the array containg all days in the interval.
};

const fetchIntervalsByDate = function(dates){
    let datesWithIntervals = [];
   
    return fs.promises.readFile(database)
        .then(data => {
            const rules = JSON.parse(data); //gets all data from rules.json
            const arr = Object.entries(rules); //turn our rules object into an array.
           
            dates.forEach(date => {
                let intervals = [];
                let datePlusInterval = {}; //creates an object that contains an date and its time intervals.
                datePlusInterval.date = date;  //set the date.
 
                arr.forEach(day => {
                    if(day[1]['date'] == date) {
                        intervals.push(day[1].intervals); //if a rule has the same date as any of dates in our interval, we push its interval into an array.
                    }
                })
 
                datePlusInterval.intervals = intervals; //puts the interval in the object;
                datesWithIntervals.push(datePlusInterval); //push the object to  the final array.
            });
           
            return datesWithIntervals;
    }).catch(err => {
        console.log(err);
    });
};

const getIntervalsByDate = async function(dates){
    let x = await fetchIntervalsByDate(dates);
    return x;
}

const getIntervalsByDayOfWeek = function(dates, datesWithIntervals){
    fs.readFile(database, (err, data) => {
        if (err) throw err;
        const rules = JSON.parse(data);
        const arr = Object.entries(rules);
        var datesWithIntervals = [];
        
        dates.forEach(date => {
            var intervals = [];
            var datePlusInterval = {};
            datePlusInterval.date = date;

            arr.forEach(day => {
                if(day[1]['date'] == date) {
                    intervals.push(day[1].intervals);
                }
            })
            datePlusInterval.intervals = intervals;
            datesWithIntervals.push(datePlusInterval);
        }); 

        return datesWithIntervals;
    });
};


module.exports = { getIntervalsByDate, getDaysByInterval, getIntervalsByDayOfWeek }