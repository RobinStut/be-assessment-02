/* eslint-disable semi */

var express = require('express')
var find = require('array-find')
var slug = require('slug')
var bodyParser = require('body-parser')
var multer = require('multer')
var mongo = require('mongodb')

require('dotenv').config()

var db = null
var url = 'mongodb://localhost:27017'

mongo.MongoClient.connect(url, function (err, client) {
  if (err) {
    throw err
  }

  db = client.db('OurWish')
})

//var data = [
//  {
//    id: 'evil-dead',
//    name: 'Emma Watson',
//    age: '23',
//    place: 'Heereveen',
//    value: '95',
//    characts: ['She has brown eyes', 'She is skinny', 'She weares lipstick', 'She has slick hair', '    She is 1.65m']
//  },
//    {
//    id: 'evil-dead',
//    name: 'Joice Latice',
//    age: '20',
//    place: 'Bergen op Zoom',
//    value: '85',
//    characts: ['She has brown eyes', 'She is skinny', 'She weares lipstick', 'She has slick hair', 'She is 1.65m']
//  },
//  {
//    id: 'the-shawshank-redemption',
//    name: 'Chanel Preston',
//    age: '18',
//    place: 'Den Helder',
//    value: '75',
//    characts: ['She has brown eyes', 'She is skinny', 'She weares lipstick', 'She has slick hair', 'She is 1.65m']
//  }
//]

var yourProfileData = [
    {
        id: '1',
        chosen: 'checked',
        cover: 'hair-01.jpg'
  },
    {
        id: '2',
        chosen: '',
        cover: 'hair-02.jpg'
  },
    {
        id: '3',
        chosen: '',
        cover: 'hair-03.jpg'
  }
]

//multer is een npm pakketje die form-data kan handelen
//upload destination is static/upload/
var upload = multer({dest: 'static/upload/'})

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', index)
  .get('/findYourWish', findYourWish)
  .get('/yourProfile', yourProfile)
// wordt maar 1 single upload geaccepteerd
  .post('/', upload.single('cover'), add)
  .get('/add', form)
  .get('/:index', match)
  .delete('/:id', remove)
  .use(notFound)
  .listen(8000)

// wordt aangeroepen wanneer "/" bezocht wordt
function index(req, res) {
// renderd de list.ejs file met de data van var data
  res.render('index.ejs')
}

function findYourWish(req, res) {
    db.collection('Users').find().toArray(done)
// renderd de list.ejs file met de data van var data

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.render('found.ejs', {data: data})
    }
  }
}

function yourProfile(req, res) {
  res.render('yourProfile.ejs', {yourProfileData: yourProfileData})
}

function match(req, res, next) {
  var id = req.params.index
  console.log("113 = "+ id)

  var _id = new mongo.ObjectId(id)
  console.log("116 = "+ _id)

  db.collection('profile').findOne(_id,done)

  function done (error, data) {
    if (error) {
      next (error)
    } else if (id == _id) {
      console.log('matcht')
      res.render('detailProfile.ejs', {
        data: data
      })
    }
  }
}


// wordt aangeroepen wanneer "/add" bezocht wordt
function form(req, res) {
  res.render('add.ejs')
}


// wordt aangeroepen wanneer er een post wordt geplaatst op "/"
function add(req, res) {
//slug is een npm pakketje die strings URL geschikt maakt.
//Bodyparser parsed de data en slaat dat op in req.body
//.title en bijv. .plot zijn de name atributen van inputs
  var id = slug(req.body.title).toLowerCase()

  data.push({
    id: id,
    title: req.body.title,
    //multer doet de req.file fixen
    cover: req.file ? req.file.filename : null,
    plot: req.body.plot,
    description: req.body.description
  })

//stuurt browser naar gegeven path
  res.redirect('/' + id)
}


// wordt aangeroepen wanneer er gedeleted wordt op een specifieke movie pagina
function remove(req, res) {
  var id = req.params.id

//wanneer een id value niet overeenkomt met id, wordt er true gegeven
  data = data.filter(function (value) {
    return value.id !== id
  })

  res.json({status: 'ok'})
}

function notFound(req, res) {
  res.status(404).render('not-found.ejs')
}

