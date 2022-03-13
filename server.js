'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');

const mysql = require('mysql2');
const e = require('express');

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "rdanjole",
    password: "H00270233",
    database: "rdanjole_PerfectPizza"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.post('/loginemp/', function (req, res) {
    var eemail = req.body.employeeemail;
    var epw = req.body.employeepw;

    var sqlsel = 'select * from employeetable where dbemployeeemail = ?';

    var inserts = [eemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log("SQL: " + sql);
    con.query(sql, function (err, data) {
        if (data.length > 0) {
            console.log("User Name Correct:");
            console.log(data[0].dbemployeepassword);
            bcrypt.compare(epw, data[0].dbemployeepassword, function (err, passwordCorrect) {
                if (err) {
                    throw err
                } else if (!passwordCorrect) {
                    console.log("Password incorrect")
                } else {
                    console.log("Password correct")
                    res.send({ redirect: '/backend/searchemployee.html' })
                }
            })
        } else {
            console.log("Incorrect user name or password");
        }
    });
});

app.post('/logincust/', function (req, res) {
    var cemail = req.body.customeremail;
    var cpw = req.body.customercpw;

    var sqlsel = 'select * from customertable where dbcustomeremail = ?';

    var inserts = [cemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log("SQL: " + sql);
    con.query(sql, function (err, data) {
        if (data.length > 0) {
            console.log("User Name Correct:");
            console.log(data[0].dbcustomerpassword);
            bcrypt.compare(cpw, data[0].dbcustomerpassword, function (err, passwordCorrect) {
                if (err) {
                    throw err
                } else if (!passwordCorrect) {
                    console.log("Password incorrect")
                } else {
                    console.log("Password correct")
                    res.send({ redirect: '/searchcustomer.html' })
                }
            })
        } else {
            console.log("Incorrect user name or password");
        }
    });
});

app.get('/getemptypes/', function (req, res){

    var sqlsel = 'SELECT * FROM employeetypes';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getemps/', function (req, res){

    var sqlsel = 'SELECT * FROM employeetable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/Cart/', function (req, res){
    var cartemp = req.body.CartEmp;

    var sqlsel = 'Select MAX(dbcartdailyid) as daymax from cartinfo ' +
        ' WHERE DATE(dbcartdate) = CURDATE()';
    
    var sql = mysql.format(sqlsel);

    var dailynumber = 1;

    con.query(sql, function (err, data) {
        console.log("Something: " + data[0].daymax);
        if (!data[0].daymax) {
            dailynumber = 1;
        } else {
            dailynumber = data[0].daymax + 1;
        }

        var sqlinsertcart = "INSERT INTO cartinfo (dbcartemp, dbcartdailyid, " +
            " dbcartpickup, dbcartmade, dbcartdate) VALUES (?, ?, ?, ?, now())";

        var insertcart = [cartemp, dailynumber, 0, 0];

        var sqlcart = mysql.format(sqlinsertcart, insertcart);

        con.query(sqlcart, function (err, result) {
            if (err) throw (err);
            console.log("1 record inserted");
            res.redirect('/backend/insertcart.html');
            res.end();
        });
    });
});

app.get('/getcart/', function (req, res){ 
    var empid = req.query.employeeid;

    var sqlsel = "Select cartinfo.*, employeetable.dbemployeename from cartinfo inner join employeetable on employeetable.dbemployeekey = cartinfo.dbcartemp WHERE dbcartemp = ? ";

    var inserts = [empid];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getcustreward/', function (req, res){

    var sqlsel = 'SELECT * FROM customerreward';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getcust/', function (req, res){
    var cname = req.query.customername;
    var caddress = req.query.customeraddress;
    var czip = req.query.customerzip;
    var ccredit = req.query.customercredit;
    var cemail = req.query.customeremail;
    var cmember = req.query.customermember;
    var creward = req.query.customerreward;

    if (cmember == 1 || cmember == 0) {
        var memberaddon = ' and dbcustomermember = ?';
        var memberaddonvar = cmember;
    } else {
        var memberaddon = ' and dbcustomermember LIKE ?';
        var memberaddonvar = '%%';
    }

    if (creward > 0) {
        var rewardaddon = ' and dbcustomerreward = ?';
        var rewardaddonvar = creward;
    } else {
        var rewardaddon = ' and dbcustomerreward LIKE ?';
        var rewardaddonvar = '%%';
    }

    var sqlsel = 'SELECT customertable.*, customerreward.dbcustrewardname from customertable ' +
    'inner join customerreward on customerreward.dbcustrewardid = customertable.dbcustomerreward ' +
    'where dbcustomername LIKE ? and '
    + 'dbcustomeraddress LIKE ? and dbcustomerzip LIKE ? and dbcustomercredit LIKE '
    + '? and dbcustomeremail LIKE ?' + memberaddon + rewardaddon;
    var inserts = ['%' + cname + '%', '%' + caddress + '%', '%' + czip + '%', '%' + ccredit + '%', '%' + cemail + '%', memberaddonvar, rewardaddonvar];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getemp/', function (req, res){
    var eid = req.query.employeeid;
    var ename = req.query.employeename;
    var ephone = req.query.employeephone;
    var eemail = req.query.employeeemail;
    var esalary = req.query.employeesalary;
    var emailer = req.query.employeemailer;
    var etype = req.query.employeetype;

    if (emailer == 1 || emailer == 0) {
        var maileraddon = ' and dbemployeemailer = ?';
        var maileraddonvar = emailer;
    } else {
        var maileraddon = ' and dbemployeemailer LIKE ?';
        var maileraddonvar = '%%';
    }

    if (etype > 0) {
        var typeaddon = ' and dbemployeetype = ?';
        var typeaddonvar = etype;
    } else {
        var typeaddon = ' and dbemployeetype LIKE ?';
        var typeaddonvar = '%%';
    }

    var sqlsel = 'SELECT employeetable.*, employeetypes.dbemptypename from employeetable ' +
    'inner join employeetypes on employeetypes.dbemptypeid = employeetable.dbemployeetype ' +
    'where dbemployeeid LIKE ? and '
    + 'dbemployeename LIKE ? and dbemployeephone LIKE ? and dbemployeeemail LIKE '
    + '? and dbemployeesalary LIKE ?' + maileraddon + typeaddon;
    var inserts = ['%' + eid + '%', '%' + ename + '%', '%' + ephone + '%', '%' + eemail + '%', '%' + esalary + '%', maileraddonvar, typeaddonvar];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.post('/customer', function (req, res) {
    var cname = req.body.customername;
    var caddress = req.body.customeraddress;
    var czip = req.body.customerzip;
    var ccredit = req.body.customercredit;
    var cemail = req.body.customeremail;
    var cpw = req.body.customerpw;
    var cmember = req.body.customermember;
    var creward = req.body.customerreward;

    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(cpw, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.log("Bad");
            return
        } else {
            theHashedPW = hashedPassword;

        var sqlins = "INSERT INTO customertable (dbcustomername, dbcustomeraddress, dbcustomerzip,"
        + " dbcustomercredit, dbcustomeremail, dbcustomermember, dbcustomerreward, dbcustomerpassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
        var inserts = [cname, caddress, czip, ccredit, cemail, cmember, creward, theHashedPW];
    
        var sql = mysql.format(sqlins, inserts);
    
        con.execute(sql, function(err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            res.redirect('insertcustomer.html');
            res.end();
            });
        }
    });
});

app.post('/employee', function (req, res) {
    var eid = req.body.employeeid;
    var ename = req.body.employeename;
    var eemail = req.body.employeeemail;
    var epw = req.body.employeepw;
    var ephone = req.body.employeephone;
    var esalary = req.body.employeesalary;
    var emailer = req.body.employeemailer;
    var etype = req.body.employeetype;

    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(epw, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.log("Bad");
            return
        } else {
            theHashedPW = hashedPassword;

        var sqlins = "INSERT INTO employeetable (dbemployeeid, dbemployeename, dbemployeeemail, dbemployeephone,"
        + " dbemployeesalary, dbemployeemailer, dbemployeetype, dbemployeepassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
        var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype, theHashedPW];
    
        var sql = mysql.format(sqlins, inserts);
    
        con.execute(sql, function(err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            res.redirect('insertemployee.html');
            res.end();
            });
        }
    });
});

app.get('/getsingleemp/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from employeetable where dbemployeekey = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleemp/', function (req, res) {

    var eid = req.body.upemployeeid;
    var ename = req.body.upemployeename;
    var ephone = req.body.upemployeephone;
    var eemail = req.body.upemployeeemail;
    var esalary = req.body.upemployeesalary;
    var emailer = req.body.upemployeemailer;
    var etype = req.body.upemployeetype;
    var ekey = req.body.upemployeekey;

    var sqlins = "UPDATE employeetable SET dbemployeeid = ?, dbemployeename = ?, dbemployeeemail = ?, " +
        "dbemployeephone = ?, dbemployeesalary = ?, dbemployeemailer = ?, dbemployeetype = ? WHERE dbemployeekey = ?";
    var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype, ekey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record updated");
        res.end();
    });
});

app.get('/getsinglecust/', function (req, res) {

    var cid = req.query.upcustid;

    var sqlsel = 'select * from customertable where dbcustomerid = ?';
    var inserts = [cid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/updatesinglecust/', function (req, res) {

    var cname = req.body.upcustomername;
    var caddress = req.body.upcustomeraddress;
    var czip = req.body.upcustomerzip;
    var ccredit = req.body.upcustomercredit;
    var cemail = req.body.upcustomeremail;
    var cpw = req.body.upcustomerpw;
    var cmember = req.body.upcustomermember;
    var creward = req.body.upcustomerreward;
    var cid = req.body.upcustomerid;

    var sqlins = "UPDATE customertable SET dbcustomername = ?, dbcustomeraddress = ?, dbcustomerzip = ?, " +
        "dbcustomercredit = ?, dbcustomeremail = ?, dbcustomermember = ?, dbcustomerreward = ? WHERE dbcustomerid = ?";
    var inserts = [cname, caddress, czip, ccredit, cemail, cmember, creward, cid];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record updated");
        res.end();
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
