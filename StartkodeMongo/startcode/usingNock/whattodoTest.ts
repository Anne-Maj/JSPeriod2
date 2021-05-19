const expect = require("chai").expect;
import app from "./whattodo";
const request = require("supertest")(app);
import nock from "nock";

describe("What to do endpoint", function () {
  before(() => { //Figure out what to do here })

        nock('https://www.boredapi.com')
        .get("/api/activity")
        .reply(200, {

            "activity": "drink a single beer",
            "type": "recreational",
            "participants": 1,
            "price": 0,
            "link": "",
            "key": "6852505",
            "accessibility": 0.9
        
        })
    })
  it("Should eventually provide 'drink a single beer'", async function () {
    const response = await request.get("/whattodo")
    expect(response.body.activity).to.be.equal("drink a single beer");
  })
})
