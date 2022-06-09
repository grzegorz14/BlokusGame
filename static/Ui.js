import Block from "./Block.js"
import Blocks from "./blocks.js"

class Ui {
    constructor() {
        this.root = document.getElementById("root")

        this.logingDialog = document.getElementById("logingDialog")
        this.yourBlocks = document.getElementById("yourBlocks")
        this.opponentsBlocks = document.getElementById("opponentsBlocks")
        this.dialog = document.getElementById("dialog")
        this.counter = document.getElementById("counter")
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

    addBlocks = (player, clickEvent) => {
        console.log("Player: " + player)
        //your blocks
        Blocks.blocks.map((block, i) => {
            const button = document.createElement("button")
            button.addEventListener("click", () => clickEvent(block))
            button.classList.add("block")
            for (let i = 0; i < block.length; i++) {
                for (let j = 0; j < block[i].length; j++) {
                    button.innerHTML += block[i][j] == 1 ? (player == 1 ?  "🟩" : "🟦") : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                }
                button.innerHTML += "<br/>"
            }
            this.yourBlocks.appendChild(button)
        })
        
        //opponent's blocks
        Blocks.blocks.map((block, i) => { 
            const button = document.createElement("button")
            button.classList.add("block")
            for (let i = 0; i < block.length; i++) {
                for (let j = 0; j < block[i].length; j++) {
                    button.innerHTML += block[i][j] == 1 ? (player == 1 ?  "🟦" : "🟩") : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                }
                button.innerHTML += "<br/>"
            }
            this.opponentsBlocks.appendChild(button)
        })

        document.getElementById("yourBlocks").style.backgroundColor = player == 1 ?  "#285D34" : "#0B0B60";
        document.getElementById("opponentsBlocks").style.backgroundColor = player == 1 ?  "#0B0B60" : "#285D34";
    }
}

export default Ui