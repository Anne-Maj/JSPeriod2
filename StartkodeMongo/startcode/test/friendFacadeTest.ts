import * as mongo from "mongodb"
import FriendFacade from '../src/facades/friendFacade';

import chai from "chai";
const expect = chai.expect;

//use these two lines for more streamlined tests of promise operations
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import bcryptjs from "bcryptjs"
import { InMemoryDbConnector } from "../src/config/dbConnector"
import { ApiError } from "../src/errors/errors";


let friendCollection: mongo.Collection;
let facade: FriendFacade;

describe("## Verify the Friends Facade ##", () => {

  before(async function () {
    //Connect to inmemory test database
    const client = await InMemoryDbConnector.connect();
    //Get the database and initialize the facade
    const db = client.db();
    //Initialize friendCollection, to operate on the database without the facade
    friendCollection = db.collection("friends");
    facade = new FriendFacade(db)
})

  beforeEach(async () => {
    const hashedPW = await bcryptjs.hash("secret", 4)
    await friendCollection.deleteMany({})
    //Create a few few testusers for ALL the tests
    await friendCollection.insertMany(
        [
            { firstName: "Ib", lastName: "Ibsen", email: "i@b.dk", password: hashedPW},
            { firstName: "Bo", lastName: "Jensen", email: "b@o.dk", password: hashedPW},
            { firstName: "Ea", lastName: "Hansen", email: "ea@e.dk", password: hashedPW}
        ]
    )
  })

  describe("Verify the addFriend method", () => {
    it("It should Add the user Jan", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret" }
      const status = await facade.addFriend(newFriend);
      expect(status).to.be.not.null
      const jan = await friendCollection.findOne({ email: "jan@b.dk" })
      expect(jan.firstName).to.be.equal("Jan")
    })

    xit("It should not add a user with a role (validation fails)", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret", role: "admin" }
      await expect(facade.addFriend(newFriend)).to.be.rejectedWith(ApiError)
    })
  })

  describe("Verify the editFriend method", () => {
    xit("It should change lastName to XXXX", async () => {
        const userName = "b@o.dk"
        const editedLastName = {firstName: "Bo", lastName:"XXXX", email: "b@o.dk", password: "VerySecrect"}
        await facade.editFriend(userName, editedLastName)
        const updatedFriend = await facade.getFrind(userName)
        expect(updatedFriend.firstName).to.be.equal("XXXX")
    })
  })

  describe("Verify the deleteFriend method", () => {
    xit("It should remove the user Ea", async () => {
        const deletedFriend = await facade.deleteFriend("ea@e.dk")
        expect(deletedFriend).to.be.true
    })
    xit("It should return false, for a user that does not exist", async () => {
        const fakeUserName = "doesnot@exist.dk"
        const doesUserExist = await facade.deleteFriend(fakeUserName);
        expect(doesUserExist).to.be.false
       
    })
  })

  describe("Verify the getAllFriends method", () => {
    xit("It should get three friends", async () => {
        const allFriends = await facade.getAllFriends();
        expect(allFriends.length).to.be.equal(3)
    })
  })

  describe("Verify the getFriend method", () => {

    xit("It should find Ea Hansen", async () => {
        const user = "ea@e.dk"
        const friendToBeFound = await facade.getFrind(user)
        expect(friendToBeFound.email).to.be.equal(user)

    })
    xit("It should not find xxx.@.b.dk", async () => {
        const user = "xxx@b.dk"
       const userNotFound = await facade.getFrind(user)
       expect(userNotFound).to.be.null
    })
  })

  describe("Verify the getVerifiedUser method", () => {
    it("It should correctly validate Ib Ibsens's credential,s", async () => {
      const veriefiedIb = await facade.getVerifiedUser("i@b.dk", "secret")
      expect(veriefiedIb).to.be.not.null;
    })

    xit("It should NOT validate Ib Ibsen's credential,s", async () => {
        const notIb = await facade.getVerifiedUser("i@b.dk", "notmypsw")
        expect(notIb).to.be.null 
    })

    xit("It should NOT validate a non-existing users credentials", async () => {
        const notUser = await facade.getVerifiedUser("No UserName", "none")
        expect(notUser).to.be.null
    })
  })

})