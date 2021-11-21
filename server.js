const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const bodyParser = require('body-parser')
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const helmet = require('helmet')
const cors = require('cors')



// node mailer
const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "servicedd544@gmail.com",
        pass: "mymailbot"
    }
})



// mongooseDB
mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

let links = mongoose.Schema({
    name: String,
    link: String
}, {_id: false})
let episodes = mongoose.Schema({
    name: String,
    links: [links]
}, {_id: false})
let season = mongoose.Schema({
    name: String,
    eps: [episodes]
}, {_id: false})
let showSh = mongoose.Schema({
    showid: Number,
    name: String,
    description: String,
    duration: String,
    relese: String,
    panel: String,
    poster: String,
    views: {
        recent: [Number],
        all: Number,
        lt: Number
    },
    genres: [String],
    type: String,
    added: Number,
    season: {type: Number, default: undefined},
    eps: {type: Number, default: undefined},
    seasons: {type: [season], default: undefined},
    links: {type: [links], default: undefined},
    cs: Boolean
}, {
    versionKey: false
})
let userSh = mongoose.Schema({
    uuid: String,
    username: String,
    email: String,
    password: String,
    profilepic: String,
    watched: [Number]
}, {
    versionKey: false
})
let genresSh = mongoose.Schema({
    genre: String,
    pastweek: [Number],
    pwa: Number,
    alltime: Number
}, {
    versionKey: false
})

showSh.index({name: "text", description: "text"})

const users = mongoose.model('users', userSh, 'users')
const shows = mongoose.model('shows', showSh, 'shows')
const genres = mongoose.model('genres', genresSh, 'genres')



// express server
const server = express()
server.set('trust proxy', 1);
server.use(bodyParser.urlencoded())
server.use(bodyParser.json());
server.use(cors())
server.use(helmet({
    contentSecurityPolicy: false
}))
server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: "mongodb://localhost:27017/test"
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly:false,
        secure:false
    }
}))
server.use(express.static(path.join(__dirname, 'public')))
server.use((req, res, next) => {
    if (!req.session.init) {
        req.session.init = {}
        req.session.init.logedin = false
        req.session.init.profileid = undefined
        req.session.init.watched = [],
        req.session.init.lastrefresh = Date.now()
    } else {}
    next()
})



server.post('/admin/newShow', (req, res) => {
    async function sid() {
        let id = Math.floor(Math.random() * 9999999);
        let inuse = 1;
        while (inuse < 1) {
            id = Math.floor(Math.random() * 9999999)
            inuse = await shows.countDocuments({showid: id})
        }
        return id
    }
    async function newShow(body) {
        let js = body
        js.views = {
            recent: [0],
            all: 0,
            lt: 0
        };
        js.added = Date.now()
        js.genres = (!js.genres) ? [] : js.genres
        js.showid = await sid()
        if (js.type == 'movie') {
            let newMovie = new shows(js)
            newMovie.save()
        } else if (js.type == 'series') {
            js.season = js.seasons.length;
            js.eps = js.seasons[js.season-1].eps.length
            let newSeries = new shows(js)
            await newSeries.save()
        }
    }
    if (req.body.length !== undefined) {
        for (let i = 0; i < req.body.length; i++) {
            setTimeout(() => {
                newShow(req.body[i])
            }, 100)
        }
    } else {
        newShow(req.body)
    }
    res.json({ok: "ok"})
})

server.get('/admin/newTag/:tag', (req, res) => {
    let {tag} = req.params
    let newGenre = new genres({
        genre: tag,
        pastweek: 0,
        pwa: Date.now(),
        alltime: 0,
    })
    newGenre.save()
    res.json({ok: "ok"})
})

server.post("/admin/updateShow", (req, res) => {
    let js = req.body
    shows.findOneAndUpdate({name: js.name}, {"$set": {...js.update}}, {new: true}, (err, doc) => {
        if (err) throw err
        res.json(doc)
    })
})

server.post("/admin/updateShowEp", (req, res) => {
    let js = req.body
    shows.findOneAndUpdate({name: js.name}, {"$push": {eps: {"$each": js.update}}}, {new: true}, (err, doc) => {
        if (err) throw err
        res.json(doc)
    })
})

server.post("/admin/deleteShow", (req, res) => {
    shows.findOneAndDelete({ showid: req.body.id }, (err, doc) => {
        if (err) {
            res.json({
                status: "error"
            })
            throw err
        } else {
            res.json({
                status: "ok"
            })
        }
    })
})

server.post('/admin/deleteGenre', (req, res) => {
    genres.findOneAndDelete({ genre: req.body.id }, (err, doc) => {
        if (err) {
            res.json({
                status: "error"
            })
            throw err
        } else {
            res.json({
                status: "ok"
            })
        }
    })
})

server.post("/admin/deleteUser", (req, res) => {
    users.findOneAndDelete({ userid: req.body.id }, (err, doc) => {
        if (err) {
            res.json({
                status: "error"
            })
            throw err
        } else {
            res.json({
                status: "ok"
            })
        }
    })
})


server.get("/api/main", async (req, res) => {
    let bilbord = await shows.find().sort({ "views.recent": -1 }).limit(1).select('name duration relese description genres panel type showid -_id')
    let popular = await shows.find().sort({ "views.recent": -1 }).skip(10).limit(28).select('name poster duration relese type season eps showid -_id')
    let cs = await shows.find({cs: true}).sort({ "relese": -1 }).skip(10).limit(28).select('name poster duration relese type season eps showid -_id')
    let latest = await shows.find().sort({ added: -1 }).limit(42).select('name poster type duration relese season eps showid -_id')
    let tags = await genres.find().sort({ pastweek: -1 }).limit(6).select('genre -_id').then(doc => {
        let genre = []
        for (let i = 0; i < doc.length; i++) {
            genre.push(doc[i].genre)
        }
        return genre
    })
    let genreList = await genres.find().select('genre -_id').then(doc => {
        let genre = []
        for (let i = 0; i < doc.length; i++) {
            genre.push(doc[i].genre)
        }
        return genre
    })
    let genre = []
    for (let i = 0; i < tags.length; i++) {
        let n = {
            genre: tags[i],
            shows: []
        }
        n.shows = await shows.find({genres: tags[i]}).limit(14).select('name poster type duration relese showid -_id')
        genre.push(n)
    } 
    res.json({
        top: bilbord,
        pop: popular,
        latest: latest,
        genre: genre,
        genres: genreList,
        cs: cs
    })
})

server.get("/api/search/:text/:ft", async (req, res) => {
    let {ft, text} = req.params
    let maxcount = await shows.countDocuments({$text : { $search: text }})
    let docs = await shows.find({$text : { $search: text }}, { score: {$meta: "textScore"}}, {lean: true})
        .sort({score: {$meta: "textScore"}})
        .skip(parseInt(ft)*21)
        .limit(21)
        .select('name poster type duration relese season eps showid -_id')
    let maxpage = (maxcount%21 == 0) ? 0:1
    res.json({
        shows: docs,
        maxpage: parseInt(maxcount/21) + maxpage
    })
})

server.get('/api/show/:type/:ft', async (req, res) => {
    let {ft, type} = req.params
    let maxcount = await shows.countDocuments({type: 'series'})
    let docs = await shows.find((type !== 'all') ? {type: type} : {})
        .skip(parseInt(ft)*21)
        .limit(21)
        .select('name poster type duration relese season eps showid -_id')
    let maxpage = (maxcount%21 == 0) ? 0:1
    res.json({
        shows: docs,
        maxpage: parseInt(maxcount/21) + maxpage
    })
})

server.get("/api/genre/:genre/:ft", async (req, res) => {
    let {ft, genre} = req.params
    let maxcount = await shows.countDocuments({genres: genre})
    let docs = await shows.find({genres: genre}).skip(parseInt(ft)*21).limit(21).select('name poster type duration relese season eps -_id')
    let maxpage = (maxcount%21 == 0) ? 0:1
    res.json({
        shows: docs,
        maxpage: parseInt(maxcount/21) + maxpage
    })
})


server.post("/api/login", (req, res) => {
    users.findOne({ email: req.body.email }).then(doc => {
        if (doc !== undefined) {
            if (doc.password == req.body.password) {
                res.json({
                    status: "Loged in"
                })
            } else {
                res.json({
                    status: "Wrong password"
                })
            }
        } else {
            res.json({
                status: "User does not exist!"
            })
        }
    })
})

server.get("/api/watch/:id", (req, res) => {
    let id = parseInt(req.params.id)
    shows.findOne({showid: id}).select('name genres duration relese description poster links seasons season showid -_id')
    .then(doc => {
        if (doc == undefined) {
            res.json({fuck: "off"})
        }
        else {
            if (!req.session.init.watched.includes(doc.showid)) {
                shows.findOneAndUpdate({name: doc.name}, {$inc: {"views.all": 1}}, {new: true}, (err, doc) => {
                    if (err) throw err
                })
                req.session.init.watched.push(doc.showid)
                if (req.session.init.logedin) {
                    users.findByIdAndUpdate({uuid: req.session.init.profileid}, {$push: {watched: doc.showid}})
                }
            }
            res.json(doc)
        }
    })
})

server.post("/api/forgotPassword", (req, res) => {
    let {email} = req.body
    users.find({
        email: email
    })
    res.json({status: undefined})
})

server.post("/api/register", async (req, res) => {
    let {username, password, email} = req.body
    if (
        ((username == undefined) && (password == undefined) && (email == undefined)) &&
        ((username == '') && (password == '') && (email == ''))
        ) {
        res.json({
            status: "fill in the info"
        })
    } else {
        let uniqueUser = await users.find({username: username})
        let uniqueEmail = await users.find({email: email})
        if ((uniqueUser.length < 1) && (uniqueEmail.length < 1)) {
            let user = {
                userid: Math.floor(Math.random() * 9999999),
                username: username,
                email: email,
                password: password,
                profilepic: '',
                watch: []
            }
            let newuser = new users(user)
            newuser.save()
            res.json({
                status: "success",
                user: username
            })
        } else {
            res.json({
                status: "email or username already in use"
            })
        }
    }
})

server.post("/api/contact", (req, res) => {
    let {email, subject, details} = req.body
    if (
        ((email !== '') && (subject !== '') && (details !== '')) && 
        ((email !== undefined) && (subject !== undefined) && (details !== undefined))
        ) {
            mailer.sendMail({
                from: email,
                to: "damiandeni888@gmail.com",
                subject: subject,
                text: details
            }, (err, info) => {
                if (err) throw err
            })
            res.json({status: 'ok'})
        } else {
            res.json({status: "fill in the forum"})
        }
})

server.get('/api', (req, res) => {
    shows.find().then(doc => {
        res.json(doc)
    })
})

server.listen(3000, () => {
    console.log('server started')
})