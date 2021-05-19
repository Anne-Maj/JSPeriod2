import {Router} from "express"
const router = Router();

import { ApiError } from "../errors/apiError"

import authMiddleware from "../middleware/basic-auth";
router.use(authMiddleware);

//var express = require('express')
//var router = express.Router()
 
import facade from "../facades/DummyDB-Facade"




router.get("/all", async (req: any, res) => {
  const friends = await facade.getAllFriends();
  const friendsDTO = friends.map(friend=>{
    const        {firstName, lastName} = friend
    return {firstName:firstName,lastName} //Two ways, the silly way, and the easy way
  })
  res.json(friendsDTO);
})

router.get("/findby-username/:userid", async (req, res, next) => { //Sikkerhedsmæssigt dumt, da id gives med i url. broken acces control
    const userId = req.params.userid;
   try {
    const friend = await facade.getFriend(userId);
    if (friend == null) {
      
      throw new ApiError("user not found", 404)
    }
    const { firstName, lastName, email } = friend;
    const friendDTO = { firstName, lastName, email }
    res.json(friendDTO);
  } catch (err) {
    next(err)
  }
  })
  
router.get("/youare", async (req: any, res) =>{
  const user = req.user;

  res.json(user);
})

export default router;
