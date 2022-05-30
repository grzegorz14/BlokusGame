class Ui {
    constructor() {
        this.root = document.getElementById("root")

        this.logingDialog = document.getElementById("logingDialog")
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
}

export default Ui