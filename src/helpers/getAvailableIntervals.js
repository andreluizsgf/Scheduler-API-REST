const moment = require("moment");
const fs = require('fs')
const database = "src/database/rules.json";

const getDaysByInterval = function(startDate, finalDate){ //gets all days between two given dates.
    let dates = [];

    let newDate = startDate;
    dates.push(newDate);
    
    while(newDate != finalDate){
        newDate = moment(newDate, "DD-MM-YYYY").add(1, 'days').format('DD-MM-YYYY'); //we use moment to add days.
        dates.push(newDate); //push every added day to an array.
    }

    return dates; //returns the array containg all days in the interval.
};

const fetchIntervalsByDate = function(dates){
    
    return fs.promises.readFile(database)
        .then(data => {
            const rules = JSON.parse(data); //gets all data from rules.json
            const arr = Object.entries(rules); //turn our rules object into an array.
            
            let datesWithIntervals = dates.map(date => {
                let datePlusInterval = {}; //creates an object that contains an date and its time intervals.
                datePlusInterval.date = date;  //set the date.
                
                let intervals = arr.map(day => {
                    if(day[1]['date'] == date)
                        return day[1]['intervals'];
                }).filter((obj) => { return ![null, undefined].includes(obj) });
 
                datePlusInterval.intervals = intervals; //puts the interval in the object;
                
                return datePlusInterval; //push the object to  the final array.
            });
           
            return datesWithIntervals;

    }).catch(err => {
        console.log(err);
    });
};

const getIntervalsByDate = async function(dates){
    let intervalsByDate = await fetchIntervalsByDate(dates);
    return intervalsByDate;
}

const fetchIntervalsByDayOfWeek = function(dates, intervalsByDate){

    return fs.promises.readFile(database)
        .then(data => {
            const rules = JSON.parse(data); //gets all data from rules.json
            const arr = Object.entries(rules); //turn our rules object into an array.
            
            let datesWithIntervals = dates.map(date => {
                let datePlusInterval = {};
                datePlusInterval.date = date;

                let intervals = arr.map(rule => {
                    return rule[1]['days'].map(day =>{
                        let dateDay = moment(date, "DD-MM-YYYY").format('dddd');
                        if(day == dateDay){
                            return rule[1]['intervals'];
                        }
                    }).filter((obj) => { return (obj != undefined) });
                    
                }).filter((obj) => { return (obj[0] != undefined) } );
                
                let intervalsFiltered = intervals.map(interval => {
                    return (interval[0]);
                });

                datePlusInterval.intervals = intervalsFiltered;

                return datePlusInterval;
            });

        return datesWithIntervals;
    }).catch(err => {
        console.log(err);
    });
};

const getIntervalsByDayOfWeek = async function(dates){
    let intervalsByDayOfWeek = await fetchIntervalsByDayOfWeek(dates);
    
    return intervalsByDayOfWeek;
};

function isObjectEmpty(object) {
    return Object.entries(object).length === 0
}

function sortArray(array){
    return array.sort(function (a, b) {
        if (a.start > b.start) {
          return 1;
        }
        if (a.start < b.start) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
}

const getAllIntervals = function(intervalsByDate, intervalsByDayOfWeek, dates){
    
    const newArr = intervalsByDate.concat(intervalsByDayOfWeek);

    let allIntervals = dates.map(date => {

        let schedule = {};
        schedule.date = date;
        
        let intervals = newArr.map(e => {
            if(date == e.date){
                return e.intervals;
            }
        }).filter(interval => {
            if(interval && ( !isObjectEmpty(interval) )){
                return interval;
            }
        });
        
        if(intervals[0] && intervals[1])
            intervals = (intervals[0].concat(intervals[1]));

        let concatenedInterval = intervals[0];

        for (let index = 1; index < Object.keys(intervals).length; index++) {
            concatenedInterval = concatenedInterval.concat(intervals[index]);
        }

        if(concatenedInterval && Object.keys(concatenedInterval).length == 1 ){
            concatenedInterval = concatenedInterval[0];
        }

        schedule.intervals = concatenedInterval;
        
        return schedule;
    });

    return allIntervals;
}

const getAvailableHours = function(dates, allIntervals){

      let availableHours = allIntervals.map(schedule => {
        let availableHour = {};
        availableHour.date = schedule.date;

        if(schedule.intervals == undefined){
            availableHour.intervals = [{ start: "00:00", end: "23:59"}];
        }else{
            
            let sortedArray = sortArray(schedule.intervals),
                start = "00:00",
                availablesIntervals = [],
                aux = 0;
            
            sortedArray.forEach(interval => {
                let availableInterval = {};
                aux++; 
                availableInterval.start = start;
                availableInterval.end = interval.start;
                availablesIntervals.push(availableInterval);
                start = interval.end;
            });

            let lastInterval = {};
            lastInterval.start = availablesIntervals[aux-1].end;
            lastInterval.end = "23:59";
            availablesIntervals.push(lastInterval);

            availableHour.intervals = availablesIntervals;
        }

        return availableHour;
    });

    return availableHours;
}

module.exports = { getIntervalsByDate, getDaysByInterval, getIntervalsByDayOfWeek, getAllIntervals, getAvailableHours }