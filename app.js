require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`CONNECTED TO MONGO!`);
    })
    .catch((err) => {
        console.log(`MONGO CONNECTION ERROR!`);
        console.log(err);
    });


// ReUse Organisations
const Reuse_org = mongoose.model('resueorg', new mongoose.Schema({
    name: String,
    description: String,
    type: String, // pick-up or on-site
    location: String,
    link: String,
    contact: Number
}));


// ReCycle Organisations
const Recycle_org = mongoose.model('recycleorg', new mongoose.Schema({
    name: String,
    description: String,
    type: String, // pick-up or on-site
    location: String,
    link: String,
    contact: Number
}));

// Message Collection
const Messages = mongoose.model('message', new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
}));


app.get('/', function (req, res) {
    res.render('index');
});

app.get('/services/donate', function (req, res) {

    Reuse_org.find()
        .then(function (foundItems) {
            res.render('services/donate', { items: foundItems });
        })
        .catch(function (err) {
            console.log(err);
        });

});

app.get('/services/recycle', function (req, res) {

    Recycle_org.find()
        .then(function (foundItems) {
            res.render('services/recycle', { items: foundItems });
        })
        .catch(function (err) {
            console.log(err);
        })

});

app.get('/blog1', function (req, res) {
    res.render('blog1');
});

app.get('/blog2', function (req, res) {
    res.render('blog2');
});

app.get('/blog3', function (req, res) {
    res.render('blog3');
});

app.post('/', function (req, res) {

    const msg = new Messages({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.subject
    })

    msg.save();
    res.redirect('/');
    console.log('Your response has been received.');
});

app.post('/services/donate', function (req, res) {

    // console.log(req.body);
    const requestedLocation = _.startCase(req.body.location).trim();

    Reuse_org.find({ $or: [{ location: requestedLocation }, { location: 'PAN India' }] })
        .then(function (foundItems) {
            res.render('services/donate', { items: foundItems });
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.post('/services/recycle', function (req, res) {
    // console.log(req.body);
    const requestedLocation = _.startCase(req.body.location).trim();

    Recycle_org.find({ $or: [{ location: requestedLocation }, { location: 'PAN India' }] })
        .then(function (foundItems) {
            // console.log(foundItems);
            res.render('services/recycle', { items: foundItems, });
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Server started on Port ', process.env.PORT);
});