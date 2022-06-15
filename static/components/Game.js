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
        this.firstMove = true

        this.moved = false
        this.yourTurn = false

        this.blocks = { player: Block.blocks, opponent: Block.blocks }
        this.tiles = []
        this.board = []

        this.pickedBlockId = -1
        this.pickedBlock = null
        this.placementHelper = null
        this.placementCoords = { x: 0, z: -1, rot: 0, fl: false }
        // koordynaty x i y od lewego gornego rogu planszy, ulozone jak axes. 
        //Rot ma wartosc 0-3, gdzie zero to oryginalna, a za kazde +1 obraca sie o 90 w prawo

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
            // console.log(e.keyCode)
            if (e.keyCode == 49) this.camera.position.set(0, 120, -180)
            if (e.keyCode == 50) this.camera.position.set(160, 160, -180)
            if (e.keyCode == 51) this.camera.position.set(0, 240, -0.1)
            this.camera.lookAt(this.scene.position)

            if (this.placementHelper && this.yourTurn) {
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

                let w = this.placementHelper.w
                let h = this.placementHelper.h

                if (e.keyCode == 70) {
                    //console.log("flip")
                    //this.placementHelper.flip()
                }

                if (e.keyCode == 87 && this.placementCoords.z > 0) {
                    // Move helper up
                    this.placementHelper.position.z += 10
                    this.placementCoords.z -= 1
                } else if (e.keyCode == 83 && this.placementCoords.z < 14 - h) {
                    // Move helper down
                    this.placementHelper.position.z -= 10
                    this.placementCoords.z += 1
                }

                if (e.keyCode == 65 && this.placementCoords.x > 0) {
                    // Move helper left
                    this.placementHelper.position.x += 10
                    this.placementCoords.x -= 1
                } else if (e.keyCode == 68 && this.placementCoords.x < 14 - w) {
                    // Move helper right
                    this.placementHelper.position.x -= 10
                    this.placementCoords.x += 1
                }

                // Prevent Clipping out of board
                let overflowX = this.placementCoords.x + w - 14
                let overflowZ = this.placementCoords.z + h - 14
                if (overflowX > 0) {
                    this.placementHelper.position.x += 10 * overflowX
                    this.placementCoords.x -= overflowX
                }

                if (overflowZ > 0) {
                    this.placementHelper.position.z += 10 * overflowZ
                    this.placementCoords.z -= overflowZ
                }

                this.placementHelper.placable(this.validatePlacement())

                console.log(this.placementCoords, this.placementHelper.w, this.placementHelper.h, this.placementHelper.flipped)

                // place block
                if (e.keyCode == 32) {
                    this.yourTurn && this.placeBlock()
                }
            }
        })

        this.render()
    }

    placeBlock = async () => {
        // Place Block
        if (this.validatePlacement()) {
            this.firstMove = false
            this.placementCoords.rot = this.placementHelper.rotationID

            let pointsCounter = 0
            let w = this.placementHelper.w
            let h = this.placementHelper.h
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    if (this.placementHelper.shape[i][j] == 1) {
                        pointsCounter += 1
                        this.board[this.placementCoords.z + i][this.placementCoords.x + j] = this.placementHelper.shape[i][j] == 1 ? this.player : 0
                    }
                }
            }

            this.placementHelper.materialize()

            //console.log(this.board)

            this.placementCoords.fl = this.placementHelper.flipped

            this.placementHelper = null

            //removes block button from ui
            document.getElementById("your" + this.pickedBlockId)?.remove()
            document.getElementById("yourPoints").innerText = parseInt(document.getElementById("yourPoints").innerText) + pointsCounter

            this.moved = true

            //console.log(this.pickedBlockId)
            const headers = { "Content-Type": "application/json" }
            let body = JSON.stringify({
                blockId: this.pickedBlockId,
                coords: this.placementCoords,
                points: pointsCounter,
                player: this.player,
                board: this.board
            })
            await fetch("/placeBlock", { method: "post", headers, body })
            console.log("Block placed")
        }
    }

    placeEnemy(id, coords) {
        // make new block
        let block = new Block(Blocks.blocks[id], this.player, false)
        this.scene.add(block)

        // position in default rotation on current position
        //console.log(coords)

        let xMod = coords.rot % 2 == 0 ? block.w : block.h
        let yMod = coords.rot % 2 == 0 ? block.h : block.w

        block.position.set(
            -70 + (coords.x + xMod) * 10,
            0,
            -70 + (coords.z + yMod) * 10
        )

        block.setRotation(coords.rot + 2)

        if (coords.fl) block.flip()

        // block.position.set(
        //     65 - unrotx,
        //     0,
        //     65 - unrotz
        // )

        let w = block.w
        let h = block.h
        // add to array
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                if (block.shape[i][j] == 1) {
                    // not defined -> pointsCounter += 1
                    this.board[14 - h - coords.z + i][14 - w - coords.x + j] = block.shape[i][j] == 1 ? 3 - this.player : 0
                }
            }
        }

        console.log("Enemy move done")
    }

    validatePlacement = () => {
        let w = this.placementHelper.w
        let h = this.placementHelper.h

        // adjecancy grid
        let top = 1,
            bottom = 1,
            right = 1,
            left = 1
        let overflowX = this.placementCoords.x + w - 14
        let overflowZ = this.placementCoords.z + h - 14
        if (overflowX > -1) right = 0
        if (overflowZ > -1) bottom = 0
        if (this.placementCoords.x == 0) left = 0
        if (this.placementCoords.z == 0) top = 0

        let doesNotTouch = true
        let connected = false

        let adj = []
        for (let i = 0; i < h + bottom + top; i++) {
            let row = []

            for (let j = 0; j < w + right + left; j++) {

                let populate = false

                if (i < h + top - 1 && j != -1 + left && j != left + w) {
                    if (this.placementHelper.shape[i - top + 1][j - left] == 1)
                        populate = true
                }
                if (i > top && j != -1 + left && j != left + w) {
                    if (this.placementHelper.shape[i - top - 1][j - left] == 1)
                        populate = true
                }
                if (j < w + left - 1 && i != -1 + top && i != top + h) {
                    if (this.placementHelper.shape[i - top][j - left + 1] == 1)
                        populate = true
                }
                if (j > left && i != -1 + top && i != top + h) {
                    if (this.placementHelper.shape[i - top][j - left - 1] == 1)
                        populate = true
                }

                if (populate && this.board[this.placementCoords.z + i - top][this.placementCoords.x + j - left] == this.player) {
                    doesNotTouch = false
                }
                row.push(populate ? 1 : 0)
            }
            adj.push(row)
        }

        let isSpaceEmpty = true
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                if (this.placementHelper.shape[i][j] == 1) {
                    if (this.board[this.placementCoords.z + i][this.placementCoords.x + j] != 0) {
                        isSpaceEmpty = false
                    }
                }
            }
        }

        if (this.firstMove && this.placementCoords.x == 0 && this.placementCoords.z == 14 - h) {
            connected = true
        }
        else if (!this.firstMove) {
            for (let i = 0; i < h + bottom + top; i++) {
                for (let j = 0; j < w + right + left; j++) {
                    if (adj[i][j] == 0) {
                        let count = 0

                        if (i != 0 && adj[i - 1][j] == 1) count += 1
                        if (j != 0 && adj[i][j - 1] == 1) count += 1
                        if (i != h + bottom + top - 1 && adj[i + 1][j] == 1) count += 1
                        if (j != w + right + left - 1 && adj[i][j + 1] == 1) count += 1

                        if (count > 1) {
                            if (this.board[this.placementCoords.z + i - top][this.placementCoords.x + j - left] == this.player) {
                                //console.log(i, j)
                                connected = true
                            }
                        }
                    }
                }
            }
        }
        return isSpaceEmpty && doesNotTouch && connected
    }

    selectBlock = (id) => {
        //check if it's your turn
        if (!this.yourTurn) return

        this.pickedBlockId = id
        this.placementCoords.fl = false

        // safely delete old block
        if (this.placementHelper) {
            this.placementHelper.safeDelete(this.scene)
        }

        // make new block
        let block = new Block(Blocks.blocks[id], this.player, true)
        this.scene.add(block)

        if (this.placementCoords.z = -1) {
            this.placementCoords.z = 14 - block.h
        }

        // replace old helper
        if (this.placementHelper) {
            let rot = this.placementHelper.rotationID
            let x = this.placementHelper.position.x
            let z = this.placementHelper.position.z
            let w = this.placementHelper.w
            let h = this.placementHelper.h

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
            let overflowX = this.placementCoords.x + w - 14
            let overflowZ = this.placementCoords.z + h - 14
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
            this.placementHelper.position.set(
                70 - this.placementCoords.x * 10,
                0,
                70 - this.placementCoords.z * 10
            )
        }

        this.placementHelper.placable(this.validatePlacement())
    }

    createBoard = () => {
        let tile
        for (let i = 0; i < 14; i++) {
            let row = []
            for (let j = 0; j < 14; j++) {
                tile = new Tile(i, j)
                // jak chcesz dalej plansze, to oddal kamere
                tile.position.set(65 - j * 10, -4, 65 - i * 10)
                this.tiles.push(tile)
                this.scene.add(tile)
                row.push(0)
            }
            this.board.push(row)
        }
    }

    setPlayerPosition = () => {
        this.camera.position.set(0, 120, -180)
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