var mongo = require('mongodb');
var server = new mongo.Server('localhost', 27017, { auto_reconnect: true });
var db = new mongo.Db('utilizationdb', server);
const bcrypt = require('bcrypt');



db.open(function(err, db) {
    if (!err) {
        db.collection('dates', { strict: true }, function(err, collection) {
            if (err) {
                console.log("DB Error: " + err);
            }
            db.collection('whateverDB', { strict: true }, function(err, collection) {
                if (err) {
                    console.log("DB Error: " + err);
                    
                }
            })
        });
    }
    else {
        console.log("DB ERROR: " + err);
    }
});



exports.getLast = function(req, res) {
    var cursor = db.collection('dates').find().limit(1).sort({$natural:-1}).toArray(function (err, result) {
        if(!err)
        {
            res.send(result);
        }
        else
            console.log("Error: Could not acces collection.");
        res.end();
    })
}

//Sends entire collection as Array
exports.findAll = function(req, res) {
    var cursor = db.collection('dates').find().toArray(function(err, result) {
        if (!err) 
            res.send(result);
        else 
            console.log("ERROR: Could not access collection.");
        res.end();
    })
}

//Return target country currency amount compared to USD as JSON obj
exports.viewDay = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;


    var cursor = db.collection('dates').find({'year': year, 'month': month, 'day': day}).toArray(function(err, result) {
        if(!err)
            res.send(result);
        else
            console.log("Error: Could not access collection.");
        res.end();
    })
}

//Return target country currency amount compared to USD as JSON obj
exports.viewMonth = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var fMonth = req.params.fMonth;
    var year = req.params.year;

    var cursor = db.collection('dates').find({'fYear': year, 'fMonth': fMonth}).toArray(function(err, result) {
        if (!err) 
            res.send(result);
        else 
            console.log("ERROR: Could not access collection.");
        res.end();
    });
};

//Return target country currency amount compared to USD as JSON obj
exports.viewYear = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var year = req.params.year;

    var cursor = db.collection('dates').find({'fYear': year}).toArray(function(err, result) {
        if (!err) {
            res.send(JSON.stringify(result));
        }
        else {
            console.log("ERROR: Could not access collection.");
        }
        res.end();
    });
};

//Return target country currency amount compared to USD as JSON obj
exports.viewWeek = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let week = req.params.week;
    let fMonth = req.params.fMonth;
    let year = req.params.year;

    var cursor = db.collection('dates').find({'fYear': year, 'week': week, 'fMonth': fMonth}).toArray(function(err, result) {
        if (!err) {
            res.send(result);
        }
        else {
            console.log("ERROR: Could not access collection.");
        }
        res.end();
    });
};

exports.addDate = function(req, res) {
    var util = {};
    util.day = req.body.day;
    util.month = req.body.month;
    util.fMonth = req.body.fMonth;
    util.fYear = req.body.fYear;
    util.year = req.body.year;
    util.week = req.body.week;
    util.initials = req.body.initials;
    util.hoursWorked = req.body.hoursWorked;
    util.totalFront = req.body.totalFront
    util.totalBack = req.body.totalBack;
    util.percentTarget = req.body.percentTarget;
    util.toTarget = req.body.toTarget;


    db.collection('dates').findOne({'day': util.day, 'month': util.month, 'year': util.year, 'initials': util.initials}, function(err, result) {
        if (!result) {
            try{
                db.collection('dates').insertOne(util);
            }
            catch (err)
            {
                //console.log("Error");
                res.Status(409).send("Failed");
            }
            res.status(201).send(JSON.stringify(util));
        }
        else {
            res.status(409).send("You have already entered Utilization. Use 'Update Utilization'");
        }
    })


};


exports.updateUtilization = function(req, res) {
    var util = {};
    util.day = req.body.day;
    util.month = req.body.month;
    util.fMonth = req.body.fMonth;
    util.fYear = req.body.fYear;
    util.year = req.body.year;
    util.week = req.body.week;
    util.initials = req.body.initials;
    util.hoursWorked = req.body.hoursWorked;
    util.totalFront = req.body.totalFront;
    util.totalBack = req.body.totalBack;
    util.percentTarget = req.body.percentTarget;
    util.toTarget = req.body.toTarget;

    db.collection('dates').findOne({ 'day': util.day, 'month': util.month, 'year': util.year, 'initials': util.initials }, function(err, item) {
        console.log(err);
        if (item) {
            db.collection('dates').update({'day': util.day, 'month': util.month, 'year': util.year, 'initials': util.initials}, 
                {$set:{'day': util.day, 'month': util.month,'fMonth': util.fMonth, 'year': util.year, 'fYear': util.fYear, 'initials': util.initials, 'hoursWorked': util.hoursWorked,'totalFront': util.totalFront, 'totalBack': util.totalBack,"toTarget": util.toTarget, "percentTarget": util.percentTarget }}, { upsert: true});
            res.format({
                'text/plain': function() {
                    res.send(util.date + ", " + util.initials + " Updated.");
                }
            })
        }
        else {
            res.status(404).send('No entry found, use Add');
        }
    })

}



exports.checkSession = function(req, res) {
    if (req.session.user && req.session.user.Username) {
        db.collection('whateverDB').findOne({ 'Username': req.session.user.Username }, function(err, user) {
            if (!user) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(202);
            }
        })
    }
    else {
        res.sendStatus(404);
    }
}

exports.login = function(req, res) {
    db.collection('whateverDB').findOne({ 'Username':req.body.Username }, function(err, user) {
        if (!user) {
            res.status(404).send(err);
        }
        else {
            bcrypt.compare(req.body.Password, user.pass, function (err, test) {
                if(test)
                {
                    req.session.user = user;
                    res.sendStatus(202);
                }
                else {
                    res.status(404).send(err);
                }
            });
        }
    });
}

exports.removeUtil = function(req, res)
{
    var day = req.body.day;
    var month = req.body.month;
    var year = req.body.year;
    var initials = req.body.initials;
    db.collection('dates').findOne({'day': day, 'month': month, 'year': year, 'initials': initials}, function(err, util) {
        if(!err) {
            db.collection('dates').deleteOne({'day': day, 'month': month, 'year': year, 'initials': initials}, function(err, test) {
                if(!err)
                    res.sendStatus(202);
                else
                    res.status(404).send(err);
            })
        }
        else
            res.status(404).send(err);

    })
}
