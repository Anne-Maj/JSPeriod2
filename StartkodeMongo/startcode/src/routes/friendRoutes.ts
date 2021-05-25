import { Router } from "express"
import { isNamedExportBindings } from "typescript";
const router = Router();
import { ApiError } from "../errors/apiError"
import FriendFacade from "../facades/friendFacade"
const debug = require("debug")("friend-routes")

let facade: FriendFacade;

// Initialize facade using the database set on the application object
router.use(async (req, res, next) => {
  if (!facade) {
    const db = req.app.get("db")
    debug("Database used: " + req.app.get("db-type"))
    facade = new FriendFacade(db)
  }
  next()
})

// This does NOT require authentication in order to let new users create themself
router.post('/', async function (req, res, next) {
  try {
    let newFriend = req.body;
    const status = await facade.addFriend(newFriend)
    res.json({status})

  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      next(err)
    } else {
      next(new ApiError(err.message, 400));
    }
  }
})

router.get("/all", async (req: any, res) => {
  const friends = await facade.getAllFriends();
  const friendsDTO = friends.map(friend => {
    const { firstName, lastName, email } = friend
    return { firstName, lastName, email }
  })
  res.json(friendsDTO);
})

router.put('/:email', async function (req: any, res, next) {

  try {
    const email = null //GET THE USERS EMAIL FROM SOMEWHERE (req.params OR req.credentials.userName)
    const userId = req.params.email
    let newFriend = req.body;
    const modifiedCount = await facade.editFriend(userId, newFriend)
    res.json(modifiedCount)
 
  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      return next(err)
    }
    next(new ApiError(err.message, 400));
  }
})

router.get("/find-user/:email", async (req: any, res, next) => {
  try {
  const userId = req.params.email;
  const friend = await facade.getFriend(userId);
  if (friend == null) {
    throw new ApiError("Not found", 404)
  }
  const { firstName, lastName, email } = friend;
  const friendDTO = { firstName, lastName, email }
  res.json(friendDTO)

  } catch (err) {
    next(err)
  }
})

export default router