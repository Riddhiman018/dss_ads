const express = require("express");
const router = express.Router();
const passport = require("passport");
const sample = require("../functions/sampleUser");
const { ensureLogin, isregistered } = require("../middlewares/ensure_login");
const socketio = require("socket.io");
const multer = require("multer");
const fs = require("fs");
const user = require("../model/user.mongo");
const path = require("path");
const aws = require("aws-sdk");
const { uploadFile } = require("../controller/fileUpload");
const { Route53RecoveryCluster } = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: "AKIAVAR7LPOHXP7CV5AZ",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    if (!fs.existsSync("videofiles")) {
      fs.mkdirSync("videofiles");
    }
    cb(null, "videofiles");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext != ".mkv" && ext != ".mp4") {
      return cb(new Error("Only videofiles"));
    }
    cb(null, true);
  },
});

router.get("/createSample", async (req, res) => {
  try {
    await sample("chandansingh@gmail.com", "Hello123");
    res.status(200).send({
      Message: "Testing",
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      Message: "Error in user creation",
    });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/dashboard",
    session: true,
  }),
  (req, res, next) => {}
);

router.post("/register", isregistered, async (req, res) => {
  try {
    await sample(req.body.username, req.body.password, res);
  } catch (error) {
    res.status(404).send({
      Message: error.Message,
    });
  }
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log(err);
    console.log(user);
    console.log(info);
    req.logIn(user, (error) => {
      if (error) {
        console.log(error);
        res.status(404).send({
          Message: "Error in user login",
        });
      } else {
        console.log("In Route");
        console.log(req.user);
        req.user.password = "";
        res.status(200).send(req.user);
      }
    });
  })(req, res, next);
});
router.get("/location_details", async (req, res) => {
  console.log(req.query);
  res.status(200).send({
    Message: "Location received",
  });
});
router.get("/logout", async (req, res) => {
  req.logOut(function (err) {
    if (err) {
      res.status(404).send({
        Message: "Error logging out",
      });
    }
    res.redirect("/");
  });
});

router.get("/findusers", function (req, res) {
  user.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      console.log(users);
    }
  });
});

router.get('/fetchuser',function(req,res){
  if(req.isAuthenticated()){
    console.log(req.user);
    res.status(200).send(req.user)
  }else{
    res.status(404).send({
      Message:"Not authenticated"
    })
  }
})



//temporary add device view
router.get("/success", (req, res) => {
  console.log("Sending req user");
  console.log(req.user);
  res.status(200).send(req.user);
});
router.get("/connectdevice", async (req, res) => {
  //get should contain device code
  //create socket connection with device
  //add it to room of devices
  //set the unique deviceID
  const io = req.app.get("socketio");
  const socket = req.app.get("socketobj");
  //broadcast the entire msg/// if a device has the particular device ID then that device will respond
  //set the emit arguement as the device id
  //if we receive the socket msg from the server
  //we respond it back with the same socket msg
  //io.emit(`${req.query.deviceID}`);
  socket.emit(`${req.query.deviceID}`, {
    Message: "Connected",
  });
  res.status(200).send({
    Message: "Device Connected Successfully",
  });
  // socket.on(`${req.query.deviceID}`,(obj)=>{
  //     console.log(obj);
  //     if(obj.id===req.query.deviceID){
  //         res.status(200).send({
  //             Message:'Device Connected Successfully'
  //         })
  //     }
  // })
});
//Add this middleware here: ,ensureLogin
router.post("/addVideos", upload.single("postedvideos"), async (req, res) => {
  console.log(req.file);
  try {
    // const title=req.body.title
    const result = await uploadFile(req.file);
    console.log(result);
    // console.log(result.Key);
    if (!result) {
      throw "Error";
    } else {
      console.log(req.body.username);
      user.updateOne(
        {
          username: req.body.username
        },
        {
          $addToSet: {
            videos: result.Location
            // +"-"+title
          },
        },
        function (err, result2) {
          if (err) {
            throw err;
          } else {
            // res.status(200).send({
            //     Message:'Uploaded the video'
            // })
            fs.unlink(req.file.path, (err) => {
              if (err) {
                throw err;
              } else {
                
                res.status(200).send({
                  Message: "Successfully uploaded the file",
                });
              }
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({
      Message: "Error in file upload",
    });
  }
});

router.get("/removescreen", function (req, res) {
  try {
    const screenname = req.body.screenname;
    console.log(screenname);
    console.log("in the function");
    user.updateOne(
      {
        username: req.body.username,
      },
      {
        $pullAll: { screens: [screenname] },
      },
      function (err, result) {
        if (err) {
          throw err;
        } else {
          console.log("removed successfully");
          res.status(200).send({
            Message: "Successfully removed the screen",
          });
        }
      }
    );
  } catch {
    res.status(404).send({
      Message: "not removed",
    });
  }
});

router.get("/getVideos", ensureLogin, async (req, res) => {
  try {
    const us = await user.findOne({
      username: req.user.username,
    });
    if (us) {
      console.log(us);
      res.status(200).send({
        Message: "User found",
        videos: us.videos,
      });
    } else {
      res.status(404).send({
        Message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({
      Message: error.Message,
    });
  }
});

// router.get('/:id',async (req,res)=>{
//   try{
//     const {id}=req.params
//     console.log(id);
//     const name= await user.findOne({
//       username:id
//     });
//     if(name){
//       console.log(name);
//       res.send(200).send(req.user)
//     }else{
//       res.status(404).send({
//         Message:"user not found"
//       })
//     }
//   }catch(error){
//     console.log(error);
//     res.status(404).send({
//       Message:error.Message
//     })
//   }
// })

router.get('/:id',async function(req,res){
  try{
    const {id}=req.params
    console.log(id);
    const name=await user.findOne({
      username:id
    })
    if(name){
      console.log(name);
      res.status(200).send(name)
    }else{
      console.log(error);
      res.status(404).send({
        Message:"User Not Found"
      })
    }
  }catch(error){
    console.log(error);
    res.status(404).send({
      Message:error.Message
    })
  }
})

router.post("/makePlaylist", async (req, res) => {
  //As array should receive a list of videos
  //req.body should contain array object
  console.log(req.body.array);
  user.updateOne(
    {
      username: req.user.username,
    },
    {
      $addToSet: {
        playlists: {
          $each: req.body.array,
        },
      },
    },
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(404).send({
          Message: "Error in playlist creation",
        });
      } else {
        res.status(200).send({
          Message: "Created Playlist",
        });
      }
    }
  );
});

router.get("/removeplaylist", function (req, res) {
  try {
    const link = req.body.link;
    console.log(link);
    console.log("in the function");
    user.updateOne(
      { username: req.body.username},
      { $pullAll: { playlists: [link] } },
      function (err, result) {
        if (err) {
          throw err;
        } else {
          console.log("removed successfully ");
          res.status(200).send({
            Message: "Successfully removed from your playlist",
          });
        }
      }
    );
  } catch {
    res.status(404).send({
      Message: "not removed",
    });
  }
});

router.get('/playlist_view',async (req,res)=>{
  res.render("makePlaylist")
})

module.exports = router;
