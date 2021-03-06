const Datastore = require('nedb')

const gameData = new Datastore({
    filename: './db/gameData.db',
    autoload: true
});

const express = require("express")
const app = express()
const path = require("path")
var PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static("static"))
app.use(express.urlencoded({ extended: true }))

app.get("/", async function (req, res) {
    res.sendFile(path.join(__dirname + "/static/html/index.html"))
})

const clearBoard = [ // 0 - empty, 1 - player 1 segment, 2 - player 2 segment
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

var coords = null
var blockId = -1

var boardState = clearBoard
var players = []
var points1 = 0
var points2 = 0
var finishedCounter = 0
var win = null
var reset = 0
var sender = -1

app.post("/addPlayer", (req, res) => {
    let login = req.body.login

    switch (players.length) {
        case 1:
            if (login == players[0]) {
                res.json({ success: false, info: "This login is occupied. Please choose different one." })
            }
            else {
                gameData.remove({ _id: "gameState" }, {}, function (err, state) {
                    console.log("State deleted")
                })

                const gameState = {
                    _id: "gameState",
                    points1: 0,
                    points2: 0,
                    board: boardState
                }
                gameData.insert(gameState, function (err, record) {
                    console.log("State added")
                })

                players.push(login)
                res.json({ success: true, player: 1 })
            }
            break
        case 0:
            resetGame()
            players.push(login)
            res.json({ success: true, player: 2 })
            break
        default:
            res.json({ success: false, info: "The game is on! Wait until players finish or click reset button." })
            break
    }

    console.log("Adding player: " + login)
})

app.post("/waitingForOpponent", (req, res) => {
    res.json({ success: players.length == 2 })
})

app.post("/getPlayers", (req, res) => {
    res.json({ players })
})

app.post("/placeBlock", (req, res) => {
    blockId = req.body.blockId
    console.log("Placed Block", blockId)
    coords = req.body.coords
    sender = req.body.player
    boardState = req.body.board

    if (req.body.player == 1) points1 += req.body.points
    else points2 += req.body.points

    let newState = {
        _id: "gameState",
        points1: points1,
        points2: points2,
        board: boardState
    }

    gameData.update({ _id: "gameState" }, { $set: newState }, {}, function (err, record) {
        console.log("State updated")
    });

    res.json({ success: true })
})

app.post("/getBlock", (req, res) => {
    //console.log("Got Block", blockId)
    if (sender != req.body.player) {
        res.json({ blockId, coords, win, points1, points2, finishedCounter })
        blockId = -1
    } else {
        res.json({ blockId: -1, coords, win, points1, points2, finishedCounter })
    }
})

app.post("/getState", (req, res) => {
    gameData.findOne({ _id: "gameState" }, function (err, record) {
        //console.log(JSON.stringify(record, null, 3))
        //res.json({ board: JSON.stringify(record.board), points1, points2 })
        res.json({ board: record.board, points1, points2 })
    })
})

app.post("/finishGame", (req, res) => {
    finishedCounter += 1
    res.json({ "ok": "ok" })
})

app.post("/win", (req, res) => {
    win = req.body.player
    res.json({ success: true })
})

app.post("/resetRequest", (req, res) => {
    (reset += 1) == 2 && resetGame()
    res.json({ success: true })
})

app.post("/reset", (req, res) => {
    resetGame()
    res.json({ success: true })
})

app.listen(PORT, function () {
    console.log("App is running on port " + PORT)
})

function resetGame() {
    reset = 0
    blockId = -1
    players = []
    finishedCounter = 0
    win = null
    points1 = 0
    points2 = 0
    boardState = clearBoard
    console.log("New game")
}
