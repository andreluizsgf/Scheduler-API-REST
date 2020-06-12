const fs = require('fs');
const request = require('supertest')
const server = require('../server')
const RuleController = require('./controllers/RuleController')
const database = "src/tests/database/rules.json"

describe('Test create function', () => {
  it('should create a new rule', async () => {
    const res = await request(server.app)
      .post('/api/rules')
      .send({
        "date": "26-01-2018",
        "days" : [],
        "intervals": [
            { "start": "10:09", "end": "10:10" },
            { "start": "09:05", "end": "10:08" }
        ]
      })
      
    expect(res.statusCode).toEqual(201)
    expect(res.body.message).toEqual('Rule successfully created.')
  })
})

describe('Try to create a rule with wrong format', () => {
  it('should get error for wrong format', async () => {
    const res = await request(server.app)
      .post('/api/rules')
      .send({
        "date": "26-01-2018",
        "days" : "", //days is suposed to be an array;
        "intervals": [
            { "start": "10:09", "end": "10:10" },
            { "start": "09:05", "end": "10:08" }
        ]
      })
      
    expect(res.statusCode).toEqual(500)
    expect(res.body.message).toEqual('Please use the right format for rules.')
  })
})

describe('Index all created rules', () => {
  it('should index all rules', async () => {
    const res = await request(server.app)
      .get('/api/rules')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Rules successfully listed.')
  })
})

describe('Delete a specific rule', () => {
  it('should delete a specific rule', async () => {
    let req = {
      "date": "26-01-2018",
      "days" : [], //days is suposed to be an array;
      "intervals": [
          { "start": "10:09", "end": "10:10" },
          { "start": "09:05", "end": "10:08" }
      ]
    };

    RuleController.create(req);
    RuleController.delete(1);

    const rules = JSON.parse(fs.readFileSync(database, 'utf8'));
    const rulesLength = Object.keys(rules).length;

    expect(rulesLength).toEqual(0)

  })
})
