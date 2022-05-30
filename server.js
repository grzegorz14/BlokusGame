const express = require("express")
const app = express()
const path = require("path")
var PORT = process.env.PORT || 3000; 

app.use(express.json())
app.use(express.static("static"))

app.get("/", async function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
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

var boardState = clearBoard
var players = []
var login

app.post("/addPlayer", (req, res) => {
    login = req.body.login
    console.log("Adding player: " + login)

    switch (players.length) {
        case 1:
            if (login == players[0]) {
                res.json({ success: false, info: "This login is occupied. Please choose different one." })
            } 
            else {
                players.push(login)
                res.json({ success: true, player: 1 })
            }
            break
        case 0:
            players.push(login)
            res.json({ success: true, player: 2 })
            break
        default: 
            res.json({ success: false, info: "The game is on! Wait until players finish or click reset button." })
            break
    }
})

app.post("/waitingForOpponent", (req, res) => {
    res.json({ success: players.length == 2 })
})

app.post("/reset", (req, res) => {
    players = []
    boardState = clearBoard
    console.log("New game")
    res.json({ success: true })
})

app.listen(PORT, function () {
    console.log("App is running on port " + PORT)
})