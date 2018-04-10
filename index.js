/* eslint-disable semi */

var express = require('express')
var find = require('array-find')
var slug = require('slug')
var bodyParser = require('body-parser')
var multer = require('multer')
var mongo = require('mongodb')
var argon2 = require('argon2')
var express_fileupload = require('express-fileupload')
var session = require('express-session')


require('dotenv').config()

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) {
        throw err
    }

    db = client.db(process.env.DB_NAME)
})

//multer is een npm pakketje die form-data kan handelen
//upload destination is static/upload/
var upload = multer({
    dest: 'static/upload/'
})

express()
    .use(session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET
    }))
    .use(express.static('static'))

    .use(bodyParser.urlencoded({
        extended: true
    }))
    .set('view engine', 'ejs')
    .set('views', 'view')
    .get('/', index)
    .get('/findYourWish', findYourWish)
    .get('/yourProfile', yourProfile)
    .get('/add', form)
    .get('/logIn', loginForm)
    .get('/signUp', signUpForm)
    .get('/:index', match)
    .get('/yourProfile', profile)

//    .get('/log-out', logout)
    .post('/signUp', signUp)

    // wordt maar 1 single upload geaccepteerd
    .post('/', upload.single('pictures'), add)
    .post('/logIn', login)
    //    .post('/signUp', signUp)

.delete('/:id', remove)
    .use(notFound)
    .listen(8000)

// wordt aangeroepen wanneer "/" bezocht wordt
function index(req, res) {
    // renderd de list.ejs file met de data van var data
    res.render('index.ejs', {username: req.session.username})
}

function findYourWish(req, res) {
    db.collection('Users').find().toArray(done)
        // renderd de list.ejs file met de data van var data
    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('found.ejs', {
                data: data
            })
        }
    }
}

function yourProfile(req, res) {
    res.render('yourProfile.ejs', {username: req.session.username})
}

function match(req, res, next) {
    var id = req.params.index

    var _id = new mongo.ObjectId(id)

    db.collection('Users').findOne(_id, done)

    function done(error, data) {
        if (error) {
            next(error)
        } else if (id == _id) {
            console.log('matcht')
            res.render('detailProfile.ejs', {
                data: data
            })
        }
    }
}


function profile(req, res, next) {
    var id = req.params.index

    var _id = new mongo.ObjectId(id)

    db.collection('Users').findOne(_id, done)

    function done(error, data) {
        if (error) {
            next(error)
        } else if (id == _id) {
            console.log('matcht')
            res.render('yourProfile.ejs', {
                data: data
            })
        }
    }
}


// wordt aangeroepen wanneer "/add" bezocht wordt
function form(req, res) {
    res.render('add.ejs')
}

//function form2(req, res) {
//    res.render('add2.ejs')
//}


function add(req, res, next) {

    db.collection('Users').insertOne({
        name: req.body.name,
        bornDate: parseInt(req.body.bornDate),
        pictures: [req.file ? req.file.filename : null],
        eyeColor: req.body.eyeColor,
        hairColor: req.body.hairColor,
        hairLength: req.body.hairLength,
        place: req.body.place,
        gender: req.body.gender,
        attractedTo: req.body.attractedTo
            //    description: req.body.description
    }, done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            //             + data.insertedId
            res.redirect('/' + data.insertedId)
        }
    }
}




// wordt aangeroepen wanneer er gedeleted wordt op een specifieke movie pagina
function remove(req, res) {
    var id = req.params.id

    //wanneer een id value niet overeenkomt met id, wordt er true gegeven
    data = data.filter(function (value) {
        return value.id !== id
    })

    res.json({
        status: 'ok'
    })
}

function notFound(req, res) {
    res.status(404).render('not-found.ejs')
}

function signUpForm(req, res) {
    res.render('signUp.ejs')
}

function signUp(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    var min = 4
    var max = 16

    if (!username || !password) {
        return res.status(400).send('Username or password are missing')
    }

    if (password.length < min || password.length > max) {
        return res.status(400).send(
            'Password must be between ' + min +
            ' and ' + max + ' characters'
        )
    }

    db.collection('Users').find({
        'username': username
    }).toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else if (data.length === 0) {
            argon2.hash(password).then(onhash, next)
        } else {
            res.status(409).send('Username already in use')
        }
    }

    function onhash(hash) {
        db.collection('Users').insertOne({
            username: username,
            hash: hash,
        }, oninsert)

        function oninsert(err) {
            if (err) {
                next(err)
            } else {
                req.session.user = {
                    username: username
                }
                res.redirect('/')
            }
        }
    }
}

function loginForm(req, res) {
    res.render('logIn.ejs', {user: req.session.user
        })
}

function login(req, res, next) {
    var naam = req.body.name
    var username = req.body.username
    var password = req.body.password

    if (!username || !password) {
        return res.status(400).send('Username or password are missing')
    }

    db.collection('Users').find({
        'username': username
    }).toArray(done)

    function done(err, data) {
        var user = data && data[0]

        if (err) {
            next(err)
        } else if (user) {
            argon2.verify(user.hash, password).then(onverify, next)
        } else {
            res.status(401).send('Username does not exist')
        }

        function onverify(match) {
            if (match) {
                req.session.user = {
                    username: user.username
                };
                res.redirect('/')
            } else {
                res.status(401).send('Password incorrect')
            }
        }
    }
}

