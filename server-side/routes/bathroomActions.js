const express = require("express");
const router = express.Router();
const {User, Bathroom, Review} = require("../models");
const { authenticateUser } = require("../middleware/auth");

  //add a bathroom (user authentication)
  router.post("/createBathroom", authenticateUser,  async (req, res) => {
    try{
           const userId = req.session.userId;
   
           const newbathroom = await Bathroom.create({
           sourceid: "usercreated", 
           address: req.body.address,
           lat: req.body.lat,
           lng: req.body.lng,
           name: req.body.name,
           rating: req.body.rating,
           content: req.body.content,
           photo: req.body.photo,
           wheelchair: req.body.wheelchair,
           unisex: req.body.unisex,
           emergencyCord: req.body.emergencyCord,
           emergencyButton: req.body.emergencyButton,
           petFriendly: req.body.petFriendly,
           requiresKey: req.body.requiresKey,
           handDryer: req.body.handDryer,
           feminineProducts: req.body.feminineProducts,
           toiletCovers: req.body.toiletCovers,
           bidet: req.body.bidet,
           singleStall: req.body.singleStall,
           multipleStall: req.body.multipleStall,
           changingTable: req.body.changingTable,
           trashCan: req.body.trashCan,
           goodFlooring: req.body.goodFlooring,
           airFreshener: req.body.airFreshener,
           automatic: req.body.automatic,
           coatHook: req.body.coatHook,
           brailleSign: req.body.brailleSign,
           hotWater: req.body.hotWater,
           firstAid: req.body.firstAid,
           sharpsDisposal: req.body.sharpsDisposal,
           createdAt: new Date(),
           updatedAt: new Date(),
           UserId: req.session.userId, // Set the UserId to the logged-in user's ID
         });
     
   
         console.log("router posted bathroom User ID: (from bathroomActions.jsx)", userId);
         res.status(201).json(newbathroom);
   
       }
       catch(err){
         console.error(err);
         res.status(500).send({message: err.message});
       }
     });

//get a bathroom by Id
router.get("/bathrooms/:bathroomId", async (req, res) => {

  const bathroomId = parseInt(req.params.bathroomId, 10);
  
  console.log(bathroomId);


  try {
    const bathroom = await Bathroom.findOne({ where: { id: bathroomId } });

    if (bathroom) {
      res.status(200).json(bathroom);
    } else {
      res.status(404).send({ message: "bathroom not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
 //--------------------------------------------------------------------------
 router.delete("/bathrooms/:bathroomId", authenticateUser,  async (req, res) => {
  const bathroomId = parseInt(req.params.bathroomId, 10);

  try {
    const record = await Bathroom.findOne({ where: { id: bathroomId } });
    if (record && record.UserId !== parseInt(req.session.userId, 10)) {
      console.log("UserID in record:", record.UserId);
console.log("UserID from session:", req.session.userId);
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this bathroom" });
    }
    const deleteOp = await Bathroom.destroy({ where: { id: bathroomId } });
    if (deleteOp > 0) {
      res.status(200).send({ message: "Bathroom deleted successfully" });
    } else {
      res.status(404).send({ message: "Bathroom not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
//--------------delete a review
router.delete("/userReviews/:reviewId", authenticateUser,  async (req, res) => {
  const reviewId = parseInt(req.params.reviewId, 10);

  try {
    const record = await Review.findOne({ where: { id: reviewId } });
    if (record && record.UserId !== parseInt(req.session.userId, 10)) {
      console.log("UserID in record:", record.UserId);
console.log("UserID from session:", req.session.userId);
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this bathroom" });
    }
    const deleteOp = await Review.destroy({ where: { id: reviewId } });
    if (deleteOp > 0) {
      res.status(200).send({ message: "Bathroom deleted successfully" });
    } else {
      res.status(404).send({ message: "Bathroom not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

     module.exports = router;