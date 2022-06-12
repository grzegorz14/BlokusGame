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

        this.pickedBlock = null
        this.placementHelper = null
        this.placementCoords = { x: 0, z: 0, rot: 0 }
        // koordynaty x i y od lewego gornego rogu planszy, ulozone jak axes. 
        //Rot ma wartosc 0-3, gdzie zero to oryginalna, a za kazde +1 obraca sie o 90 w prawo

        // <DEBUG>
        const axesHelper = new THREE.AxesHelper(100);
        this.scene.add(axesHelper);
        // </DEBUG>

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

                }
            }
        });

        window.addEventListener("keydown", (e) => {
            if (this.placementHelper) {
                let w = this.placementHelper.w
                let h = this.placementHelper.h
                // Movement Code
                if (e.keyCode == 81) {
                    // Rotate Helper Left
                    this.placementCoords.rot += 1
                    this.placementCoords.rot = this.placementCoords.rot % 4

                    this.placementHelper.fullRotate(true)


                } else if (e.keyCode == 69) {
                    // Rotate Helper Right
                    this.placementCoords.rot -= 1
                    this.placementCoords.rot = this.placementCoords.rot % 4

                    this.placementHelper.fullRotate(false)
                }

                if (e.keyCode == 87 && this.placementCoords.z > 0) {
                    // Move helper up
                    this.placementHelper.position.z += 10
                    this.placementCoords.z -= 1
                } else if (e.keyCode == 83 && this.placementCoords.z < (14 - ((this.placementHelper.rotationID % 2 == 0) ? h : w))) {
                    // Move helper down
                    this.placementHelper.position.z -= 10
                    this.placementCoords.z += 1
                }

                if (e.keyCode == 65 && this.placementCoords.x > 0) {
                    // Move helper left
                    this.placementHelper.position.x += 10
                    this.placementCoords.x -= 1
                } else if (e.keyCode == 68 && this.placementCoords.x < (14 - ((this.placementHelper.rotationID % 2 == 0) ? w : h))) {
                    // Move helper right
                    this.placementHelper.position.x -= 10
                    this.placementCoords.x += 1
                }

                // Prevent Clipping out of board
                let overflowX = this.placementCoords.x + ((this.placementHelper.rotationID % 2 == 0) ? w : h) - 14
                let overflowZ = this.placementCoords.z + ((this.placementHelper.rotationID % 2 == 0) ? h : w) - 14
                if (overflowX > 0) {
                    this.placementHelper.position.x += 10 * overflowX
                    this.placementCoords.x -= overflowX
                }

                if (overflowZ > 0) {
                    this.placementHelper.position.z += 10 * overflowZ
                    this.placementCoords.z -= overflowZ
                }

                console.log(this.placementCoords.x, this.placementCoords.z, overflowX, overflowZ)
            }
        })

        this.render()
    }

    selectBlock = (id) => {
        // safely delete old block
        if (this.placementHelper) {
            this.placementHelper.safeDelete(this.scene)
        }

        // make new block
        let block = new Block(Blocks.blocks[id], this.player, true)
        this.scene.add(block)

        // replace old helper
        if (this.placementHelper) {
            let rot = this.placementHelper.rotationID
            let x = this.placementHelper.position.x
            let z = this.placementHelper.position.z

            this.placementHelper = block

            // position in default rotation on current position
            this.placementHelper.position.set(
                70 - this.placementCoords.x * 10,
                0,
                70 - this.placementCoords.z * 10
            )

            // restore rotation
            this.placementHelper.setRotation(rot)

            // Prevent Clipping out of board
            let overflowX = this.placementCoords.x + ((this.placementHelper.rotationID % 2 == 0) ? w : h) - 14
            let overflowZ = this.placementCoords.z + ((this.placementHelper.rotationID % 2 == 0) ? h : w) - 14
            if (overflowX > 0) {
                this.placementHelper.position.x += 10 * overflowX
                this.placementCoords.x -= overflowX
            }

            if (overflowZ > 0) {
                this.placementHelper.position.z += 10 * overflowZ
                this.placementCoords.z -= overflowZ
            }
        }
        // make new helper
        else {
            this.placementHelper = block

            // position in default rotation on current position
            this.placementHelper.position.set(70, 0, 70)
        }

        console.log(`Added block with id ${id}`)
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

    blockButtonClick = (id) => this.selectBlock(id)

    render = () => {
        TWEEN.update()
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
    }
}

export default Game