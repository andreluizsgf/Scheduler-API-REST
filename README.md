
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

## Routes
```
- GET        /post
- POST 	     /post
- DELETE     /post
- GET  		 /post
```

## Endpoints
```
- index
- create
- delete
- available
```

### index
This method receives an JSON object and writes it in a JSON file named rules.json. The default structure to a rule is
```
{
    "date": "",
    "days": [],
    "intervals": [],
}
```
The validation to guarantee the user wont be added twice comes through `{ "email": } parameter, so don't forget to add it to run the API properly.

### addToLine
This method receives the id of a created User, writes it in a JSON file named queue.json and returns its position. It only adds an user if it isn't already in there and the id is from a created user. To add the user with id 1, for example, just do:
```
{
    "id": 1
}
```
Possible status are:
```
200 - OK - User created; 
409 - There is no user with the passed id;
500 - The user is already on the queue;
```

### findPosition
This method receives the email of an user on the queue and returns its position. 
```
{
    "email": ""
}
```

Possible status are:
```
200 - OK - User found
500 - There is no user with the passed email on the queue;
```
### showLine
This method returns the list of users on queue, ordered by position.

### filterLine
This method receives an "gênero" and return the list of users with this "gênero".
```
{
    "gênero": ""
}
```
Possible status are:
```
200 - OK - List of users;
500 - There is no user with the passed "gênero";
```
### popLine
This method deletes the first user on the queue and returns it. <br> 
Possible status are:
```
200 - OK - User removed
500 - The queue is empty;
```
### Collection
There is a collection in postman to test user /createUser, /addToLine, /showLine and /popLine. Feel free to test it. <br>
Link: https://schema.getpostman.com/json/collection/v2.1.0/collection.json

For now, that's it!