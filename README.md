
# Scheduler API-REST

This API was developed to Cubos backend internship tecnical challenge. You will be able to manage the schedules of a clinic.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

To run this application you need npm and NodeJs installed on your computer.
If you don't have it, just go install them following the links below:
```
https://docs.npmjs.com/cli/install
https://nodejs.org/en/download/
```
### Installing

Lets get you prepared to use this API.

Install all dependencies:
```
npm install
```

If you have any problems, just run the following commands:
```
npm install express
npm install jest --save-dev
npm install moment
npm install jsonschema
```
Ok, you are ready to test this application.
Just run
```
npm run start
```  
and enjoy it! :)

### Usage

I assume you're using Postman to test this API. If not, just go to https://www.getpostman.com/downloads/ and start using. :)

## Routes & Endpoints
|Method  | Route | Endpoint  
|--|--|--|
| GET |/post  | index
| POST |/post  | create
| DELETE |/post  | delete
| GET |/post  | available

### index
This endpoint lists all created rules

### create
This method receives an JSON object and writes it in a JSON file named rules.json. The default structure to a rule is
```
{
    "date": "",
    "days": [],
    "intervals": [{}],
}
```
The validation to guarantee the correct structure of a rule is made with jsonschema. You can see the schema below.
```
{
	"date": {"type":  "string"},
	"days": {"type":  "array"},
	"intervals": {"type":  "array"}
}
```
This endpoint allows you to choose any date with format DD-MM-YYYY, any week day written like below and interval objects. 
```
{
	"date": "DD-MM-YYYY",
	"days": ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday, "Friday", "Saturday"],
	"intervals": [{ start: "10:40", end: "11:00" }, { start: "15:00", end: "15:30" }]
}
```
There is three possible uses of this structure: 

One specific day:
```
{
    "date": "26-01-2020",
    "days": [],
    "intervals": [{"start": "10:00", "end": "15:00"}],
}
```
Daily:
```
{
    "date": "",
    "days": [],
    "intervals": [{"start": "10:00", "end": "15:00"}],
}
```
Weekly:
```
{
    "date": "",
    "days": ["Monday", "Friday"],
    "intervals": [{"start": "10:00", "end": "15:00"}],
}
```
There is validation to ensure time conflict with already created rules.
For example, if there is a created rule with date "12-06-2020" will be thrown an error informing the conflict. As this date is an Friday, if you try to create a rule with Friday an error will also be thrown .
  
Possible status are:
```
400 - All intervals are already created; 
201 - The rule was successfully created;
500 - there is some error with JSON structure;
```
 
### delete
This method receives the id of a created Rule, get the rule in JSON file named rules.json and delete it.

In the below example the API will try to delete rule with id number 1;
```
{
    "id": 1
}
```
Possible status are:
```
400 - There is no id in the body;
404 - There is no rule with this id;
200 - The rule was successfully delete;
500 - There is any other kind of error;
```

### available
This method receives the two dates with format "DD-MM-YYYY" and returns all available intervals between these dates considering all created rules. 
```
{
	"days": ["25-06-2020", "29-06-2020"]
}
```

Possible status are:
```
201 - Lists all availables hours;
500 - There is no user with the passed email on the queue;
```
## Tests

There is a few tests to ensure all endpoints responses and proper functioning of the functions. All tests can be found in tests/routes.test.js

### Support files
To test the application were created an fake database and a fake controller to simulate the real Controller.

## Collection
There is a collection in postman to test index, create, delete and available endpoints. Feel free to test it. <br>
Link: https://www.getpostman.com/collections/e7a5d0d91c0d38abbfd8

That's all, folks!