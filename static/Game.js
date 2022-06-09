import Tile from "./Tile.js"
import Block from "./Block.js"
import Blocks from "./blocks.js"

class Game {
    constructor() {
        this.scene = new THREE.Scene()
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
        this.camera.position.set(0, 240, 140)
        this.camera.lookAt(this.scene.position)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor(0x000000)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        document.getElementById("root").append(this.renderer.domElement)

        this.player = null
        this.opponent = null

        this.blocks = { player: Block.blocks, opponent: Block.blocks }
        this.tiles = []

        // onClick on object
        let object = null
        window.addEventListener("mousedown", async (e) => {
            this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1
            this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1
            this.raycaster.setFromCamera(this.mouseVector, this.camera)
            const intersects = this.raycaster.intersectObjects(this.scene.children)

            if (intersects.length > 0) {
                object = intersects[0].object
                if (object instanceof Tile) {
                    console.log("made Block")

                }
            }
        });

        window.addEventListener("keydown", (e) => {
            //console.log(e.keyCode)
            let h = this.placementHelper.shape[1].length
            let w = this.placementHelper.shape.length
            // Movement Code
            if (e.keyCode == 81) {
                // Rotate Helper Left
                this.placementCoords.z += this.placementHelper.fullRotate(true)
                this.placementCoords.rot += 1
                this.placementCoords.rot = this.placementCoords.rot % 4
            } else if (e.keyCode == 69) {
                // Rotate Helper Right
                this.placementCoords.z += this.placementHelper.fullRotate(false)
                this.placementCoords.rot -= 1
                this.placementCoords.rot = this.placementCoords.rot % 4
            }
            // check for out of bounds
            if ((this.placementHelper.rotationID % 2 == 0 ? h : w) + this.placementCoords.z >= 14) {
                this.placementCoords.z -= 1
                this.placementHelper.z += 10
            }

            if (e.keyCode == 87 && this.placementCoords.z > 0) {
                // Move helper up
                this.placementHelper.position.z += 10
                this.placementCoords.z -= 1
            } else if (e.keyCode == 83 && this.placementCoords.z < (14 - (this.placementHelper.rotationID % 2 == 0 ? h : w))) {
                // Move helper down
                this.placementHelper.position.z -= 10
                this.placementCoords.z += 1
            }

            if (e.keyCode == 65 && this.placementCoords.x > 0) {
                // Move helper left
                this.placementHelper.position.x += 10
                this.placementCoords.x -= 1
            } else if (e.keyCode == 68 && this.placementCoords.x < (14 - (this.placementHelper.rotationID % 2 == 1 ? h : w))) {
                // Move helper right
                this.placementHelper.position.x -= 10
                this.placementCoords.x += 1
            }
            //console.log(this.placementCoords)
            // use e.keyCode
        })

        let block = new Block(Blocks.blocks[13], this.player)
        block.position.set(60, 0, 55)
        this.scene.add(block)

        this.placementHelper = block
        this.placementCoords = { x: 0, z: 0, rot: 0 }
        // koordynaty x i y od lewego gornego rogu planszy, ulozone jak axes. 
        //Rot ma wartosc 0-3, gdzie zero to oryginalna, a za kazde +1 obraca sie o 90 w prawo

        this.pickedBlock = null
        this.render()
    }

    createBoard = () => {
        let tile
        for (let i = 0; i < 14; i++) {
            for (let j = 0; j < 14; j++) {
                tile = new Tile(i, j)
                // jak chcesz dalej plansze, to oddal kamere
                tile.position.set(65 - j * 10, -4, 65 - i * 10)
                this.tiles.push(tile)
                this.scene.add(tile)
            }
        }
    }

    setPlayerPosition = () => {
        this.camera.position.set(0, 120, this.player == 2 ? 180 : -180)
        this.camera.lookAt(this.scene.position)
    }

    blockButtonClick = (shape) => {
        console.log(shape)
    }

    render = () => {
        TWEEN.update()
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
    }
}

export default Game