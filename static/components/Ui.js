import Block from "./Block.js"
import Blocks from "./blocks.js"

class Ui {
    constructor() {
        this.root = document.getElementById("root")

        this.logingDialog = document.getElementById("logingDialog")
        this.isOnLeft = true
        this.moveBox = document.getElementById("moveBox")
        this.yourBlocks = document.getElementById("yourBlocks")
        this.opponentsBlocks = document.getElementById("opponentsBlocks")
        this.dialog = document.getElementById("dialog")
        this.counter = document.getElementById("counter")
        this.yourCounter = document.getElementById("yourCounter")
        this.info = document.getElementById("info")
    }

    addMist = () => {
        root.classList.add("mist")
    }

    removeMist = () => {
        root.classList.remove("mist")
    }

    show = (element) => {
        element.classList.remove("invisible")
    }

    hide = (element) => {
        element.classList.add("invisible")
    }

    addBlocks = (player, clickEvent, finishEvent, login) => {
        console.log("Player: " + player)

        const yourLogin = document.createElement("p")
        yourLogin.classList.add("login")
        yourLogin.innerText = login
        this.yourBlocks.appendChild(yourLogin)

        const opponentLogin = document.createElement("p")
        opponentLogin.classList.add("login")
        opponentLogin.id = "opponentLogin"
        opponentLogin.innerText = "Opponent"
        this.opponentsBlocks.appendChild(opponentLogin)

        const yourPoints = document.createElement("p")
        yourPoints.classList.add("points")
        yourPoints.id = "yourPoints"
        yourPoints.textContent = "0"
        this.yourBlocks.appendChild(yourPoints)

        const opponentPoints = document.createElement("p")
        opponentPoints.classList.add("points")
        opponentPoints.id = "opponentPoints"
        opponentPoints.textContent = "0"
        this.opponentsBlocks.appendChild(opponentPoints)

        //your blocks
        Blocks.blocks.map((block, i) => {
            const button = document.createElement("button")
            button.addEventListener("click", () => clickEvent(i))
            button.id = "your" + i
            button.classList.add("block")
            button.classList.add("blockButton")
            for (let i = 0; i < block.length; i++) {
                for (let j = 0; j < block[i].length; j++) {
                    button.innerHTML += block[i][j] == 1 ? (player == 1 ? "🟩" : "🟦") : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                }
                button.innerHTML += "<br/>"
            }
            this.yourBlocks.appendChild(button)
        })

        //opponent's blocks
        Blocks.blocks.map((block, i) => {
            const button = document.createElement("button")
            button.id = "opponent" + i
            button.classList.add("block")
            button.disabled = true
            for (let i = 0; i < block.length; i++) {
                for (let j = 0; j < block[i].length; j++) {
                    button.innerHTML += block[i][j] == 1 ? (player == 1 ? "🟦" : "🟩") : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                }
                button.innerHTML += "<br/>"
            }
            this.opponentsBlocks.appendChild(button)
        })

        this.yourBlocks.style.backgroundColor = player == 1 ? "#285D34" : "#0B0B60";
        this.opponentsBlocks.style.backgroundColor = player == 1 ? "#0B0B60" : "#285D34";

        const finishButton = document.createElement("button")
        finishButton.classList.add("block")
        finishButton.classList.add("finishButton")
        finishButton.textContent = "Finish game"
        finishButton.addEventListener("click", () => finishEvent(player))
        this.yourBlocks.appendChild(finishButton)
    }

    moveTurnTile = () => {
        if (this.isOnLeft) {
            this.moveBox.classList.remove("buttonLeft")
            this.moveBox.classList.add("buttonRight")
            this.moveBox.innerText = "Opponent's turn"
        }
        else {
            this.moveBox.classList.remove("buttonRight")
            this.moveBox.classList.add("buttonLeft")
            this.moveBox.innerText = "Your turn"
        }
        this.isOnLeft = !this.isOnLeft
    }
}

export default Ui