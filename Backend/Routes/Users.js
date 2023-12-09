const exp = require("express");
const router = exp.Router();
let User = require("../Models/UserModel.js");

const S3 = require("aws-sdk/clients/s3")

require("dotenv").config();

const s3 = new S3({
    apiVersion: process.env.AWS_APIVERSION,
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    region: process.env.AWS_REGION,
    signatureVersion: process.env.AWS_SIGNATUREVERSION
  });

router.route("/presignedResume/:id/:filename").get((req, res) => {
    //req.params.filename should include .pdf extension from parameter
    //req.params.id is the folder of the user
    const Key = `${req.params.id}/${req.params.filename}`;

    const s3Params = {
        Bucket: "resumes-jat",
        Key,
        Expires: 60,
        ContentType: `application/pdf`,
    };
    let uploadUrl = "";

    uploadUrl = s3.getSignedUrl("putObject", s3Params)
    res.json({uploadUrl, key: Key})
})

router.route("/getPresignedResumeDownload/:id/:filename").get((req, res) => {
    const Key = `${req.params.id}/${req.params.filename}`;

    const s3Params = {
        Bucket: "resumes-jat",
        Key,
        Expires: 7200
    };
    let uploadUrl = "";

    uploadUrl = s3.getSignedUrl("getObject", s3Params)
    res.json({uploadUrl, key: Key})
})

//delete resume in s3 bucket folder
router.route("/deleteResume/:id/:filename").delete((req, res) => {
    const Key = `${req.params.id}/${req.params.filename}`;
    const params = {
        Bucket: "resumes-jat",
        Key
    }
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.error('Error deleting object: ', err);
            res.json(err)
        } else {
            console.log('Object deleted successfully: ', data);
            res.json("object deleted successfully")
        }
    });
})
// get all
router.route("/").get((req, res) => {
    User.find()
    .then(users => res.json(users)) //send array of jsons back to client call
    .catch(err => res.status(400).json("Error: "+err))
})

//get /check if user exists for login
router.route("/checkuser").get((req, res) => {
    User.find({username: req.query.username, password: req.query.password})
    .then(user => {res.json(user); })
    .catch(err => res.status(400).json("Error "+err))
})

// get by user id
router.route("/:id").get((req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json("Error: "+err))
})

// post /create new user
router.route("/createuser").post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const jobs = []

    const newUser = new User({
        username,
        password,
        jobs
    })

    newUser.save()
    .then(() => res.json("New user added"))
    .catch(err => res.status(400).json("Error: "+err))
})


// update by id /add new job
router.route("/add/:id").put((req, res) => {
    User.findById(req.params.id)
    .then(user => {
        let applications = user.jobs;
        applications.push(req.body.payload);

        User.findByIdAndUpdate(req.params.id, {$set: {jobs: applications}})
        .then(out => res.json(out))
        .catch(err => res.status(400).json("Error: "+err))
    })
    .catch(err => res.status(400).json("Error: "+err))
})

//update by id /delete job
router.route("/delete/:id/:index").delete((req, res) => {
    User.findById(req.params.id)
    .then(user => {
        let applications = user.jobs;
        applications.splice(req.params.index, 1)

        User.findByIdAndUpdate(req.params.id, {$set: {jobs: applications}})
        .then(out => res.json(out))
        .catch(err => res.status(400).json("Error: "+err))
    })
    .catch(err => res.status(400).json("Error: "+err))
})

//update by id /edit job details
router.route("/update/:id/:index").put((req, res) => {
    User.findById(req.params.id)
    .then(user => {
        let applications = user.jobs;
        let index = Number(req.params.index)
        applications[index] = req.body.data

        User.findByIdAndUpdate(req.params.id, {$set: {jobs: applications}})
        .then(out => res.json(out))
        .catch(err => res.status(400).json("Error: "+err))
    })
    .catch(err => res.status(400).json("Error: "+err))
})

module.exports = router;