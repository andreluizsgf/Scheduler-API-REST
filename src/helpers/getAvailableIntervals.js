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

const getDaysByDates = function(dates){
    let days = dates.map(date => {
        let day = moment(date, "DD-MM-YYYY").format('dddd');
        return day;
    });

    return days;
}

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
                //console.log(datePlusInterval);
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

const getAllIntervals = function(intervalsByDate, intervalsByDayOfWeek, dates){
    
    var newArr = intervalsByDate.concat(intervalsByDayOfWeek);
    //console.log(newArr);
    let kk = newArr.map(e => {
        return (e.intervals)
    }).filter((obj) => { return(Object.entries(obj).length !== 0) });

    let allIntervals = dates.map(date => {

        let schedule = {};
        schedule.date = date;
        
        let intervals = newArr.map(e => {
            if(date == e.date){
                return e.intervals;
            }
        });

        schedule.intervals = intervals;

        return schedule;
    }).filter((schedule) => {return (schedule.intervals.map(e => {
        if(e)
            console.log(e);
    }))});

    //console.log(allIntervals);
}

module.exports = { getIntervalsByDate, getDaysByInterval, getIntervalsByDayOfWeek, getAllIntervals }