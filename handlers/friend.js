const Friend = require('../models/Friend');
const User = require('../models/User');

async function addFriend(userId, addFriendId) {
  const friend = await new Friend({
    user: addFriendId,
    friendRequest: userId
  })

  try {
    await user.save();
  } catch (error) {
    console.error(error)
  }
}

async function acceptOrRefuseRequest(userId, addFriendId, acceptOrRefuse) {
  if(acceptOrRefuse){
    const acceptRequest = await User.findOneAndUpdate(
      { _id: userId }, {
        $push: {
          friend: addFriendId
        },
        $pull: {
          friendRequest: addFriend
        }
      }
    )
    return acceptRequest;
  }
  const refuseRequest = await User.findOneAndUpdate(
    { _id: userId }, {
      $pull: {
        friendRequest: addFriend
      }
    }
  )
  return refuseRequest;
}

module.exports = {
  addFriend,
  acceptOrRefuseRequest
}