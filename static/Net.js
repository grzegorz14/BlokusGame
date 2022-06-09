class Net {
    constructor(game, ui) {
        this.game = game
        this.ui = ui

        this.timerInterval = null
        this.updateInterval = null

        this.login = ""

        this.audio = new Audio('./sounds/bad-piggies-drip.mp3')

        document.getElementById("playButton").onclick = this.play
        document.getElementById("resetButton").onclick = this.reset
    }

    play = async () => {
        const login = document.getElementById("login").value.trim()
        document.getElementById("login").value = ""
        if (!login) {
            return
        }

        const body = JSON.stringify({ login })
        const headers = { "Content-Type": "application/json" }
        let response = await fetch("/addPlayer", { method: "post", body, headers })
        await response.json().then(data => {
            if (data.success) {
                console.log("Player: " + data.player)
                console.log("Login: " + login)

                this.login = login
                this.game.player = data.player
                this.game.opponent = data.player == 1 ? 2 : 1

                data.player == 2 ? this.waitForOpponent() : this.preparePlayer()
            }
            else {
                alert(data.info)
            }
        })
    }

    reset = async () => {
        console.log("Game reset")
        let response = await fetch("/reset", { method: "post" })
        await response.json().then(data => {
            if (data.success) {
                //alert("New game! Log in")
            }
        })
    }

    waitForOpponent = () => {
        //set your login somewhere in ui
        this.ui.hide(this.ui.logingDialog)
        this.ui.show(this.ui.dialog)
        this.ui.dialog.innerText = "Waiting for an opponent..."

        let waitingInterval = setInterval(async () => {
            let response = await fetch("/waitingForOpponent", { method: "post" })
            await response.json().then(data => {
                if (data.success) {
                    this.preparePlayer()
                    clearInterval(waitingInterval)
                }
            })
        }, 200)
    }

    preparePlayer = () => {
        this.ui.hide(this.ui.logingDialog)
        this.ui.hide(this.ui.dialog)
        this.ui.removeMist()

        //uncomment to start timer at the begging 
        // if (this.game.player == 2) { 
        //     this.startTimer()
        //     //this.game.yourTurn = false;
        // }
        // else {
        //     //this.game.yourTurn = true;
        // }

        this.game.createBoard()
        //this.game.createBlocks() <- Debug Code
        this.ui.addBlocks(this.game.player)
        this.ui.show(this.ui.yourBlocks)
        this.ui.show(this.ui.opponentsBlocks)
        this.game.setPlayerPosition()

        this.audio.play()

        this.updateInterval = setInterval(this.update, 200)
    }

    update = async () => {
        // let response = await fetch("/somePost", { method: "post" }) //get last move

        // await response.json().then(async data => {
        //     console.log(data)
        // })
    }

    startTimer = () => {
        this.ui.addMist()
        this.ui.show(this.ui.dialog)
        this.ui.show(this.ui.counter)
        let secondsLeft = 30
        this.ui.counter.innerText = secondsLeft
        secondsLeft -= 1

        this.timerInterval = setInterval(async () => {
            if (secondsLeft == 0) {
                clearInterval(this.timerInterval)

                //declare win
                // const body = JSON.stringify({ player: this.game.player })
                // const headers = { "Content-Type": "application/json" }
                // await fetch("/win", { method: "post", headers, body })
            }
            else {
                this.ui.counter.textContent = secondsLeft
                secondsLeft -= 1
            }
        }, 1000)
    }

    gameEnd = (message) => {
        this.ui.hide(this.ui.yourBlocks)
        this.ui.hide(this.ui.opponentsBlocks)
        this.ui.hide(this.ui.dialog)
        this.ui.hide(this.ui.counter)
        this.ui.addMist()

        this.ui.dialog.innerText = message
        this.ui.show(this.ui.dialog)

        this.audio.pause()
    }
}

export default Net