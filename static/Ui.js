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

    addBlocks = () => {
        let blocksText = ""
        Blocks.blocks.map((block, i) => {
            let blockText = ""
            for (let i = 0; i < block.length; i++) {
                for (let j = 0; j < block[i].length; j++) {
                    blockText += block[i][j] == 1 ? "🟩" : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                }
                blockText += "<br/>"
            }
            blocksText += "<button class=\"block\">" + blockText + "</button>"
        })
        this.yourBlocks.innerHTML += blocksText
        this.opponentsBlocks.innerHTML += blocksText
    }
}

export default Ui