
# Queue API-REST

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
 Possible status are:
```
500 - there is some error with JSON structure;
201 - The rule was successfully created;
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
This method receives the two dates and returns all available intervals between these dates considering all created rules. 
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


## Collection
There is a collection in postman to test index, create, delete and available endpoints. Feel free to test it. <br>
Link: https://www.getpostman.com/collections/e7a5d0d91c0d38abbfd8

That's all, folks!