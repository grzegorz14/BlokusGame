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

        this.blocks = {player: Block.blocks, opponent: Block.blocks}
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
                if ( object instanceof Tile){
                    console.log("made Block")
                    
                }
            }
        });

        window.addEventListener("keydown", (e) => {
            console.log(e.keyCode)
            if (e.keyCode == 81) {
                console.log("left")
                this.placementHelper.fullRotate(true)
                this.placementCoords.rot += 1
                this.placementCoords.rot = this.placementCoords.rot % 4
            } else if (e.keyCode == 69) {
                console.log("right")
                this.placementHelper.fullRotate(false)
                this.placementCoords.rot += 1
                this.placementCoords.rot = this.placementCoords.rot % 4
            }
            
            if (e.keyCode == 87) {
                this.placementHelper.position.z += 10
                this.placementCoords.z -= 1
            } else if (e.keyCode == 83) {
                this.placementHelper.position.z -= 10
                this.placementCoords.z += 1
            } 
            
            if (e.keyCode == 65) {
                this.placementHelper.position.x += 10
                this.placementCoords.x -= 1
            } else if (e.keyCode == 68) {
                this.placementHelper.position.x -= 10
                this.placementCoords.x += 1
            }
            console.log(this.placementCoords)
            // use e.keyCode
        })

        //debug
        this.x = 0.78
        this.y = 1
        this.z = 0.78

        this.moveXUp = false
        this.moveXDown = false
        this.moveYUp = false
        this.moveYDown = false
        this.moveZUp = false
        this.moveZDown = false

        this.setPosition = false
        this.nextDirection = false

        let block = new Block(Blocks.blocks[0], this.player)
        block.position.set(55, 0, 55)
        this.scene.add(block)

        this.placementHelper = block
        this.placementCoords = {x: 0, z: 0, rot: 0}

        // document.addEventListener("keydown", (e) => {
        //     this.moveXUp = false
        //     this.moveXDown = false
        //     this.moveYUp = false
        //     this.moveYDown = false
        //     this.moveZDown = false
        //     this.moveZUp = false
        //     switch (e.keyCode) {
        //         case 39:
        //         case 68:
        //             this.moveXUp = true
        //             this.moveZUp = true
        //             break
        //         case 37:
        //         case 65:
        //             this.moveXDown = true
        //             this.moveZDown = true
        //             break
        //         case 38:
        //         case 87:
        //             this.moveYUp = true
        //             break
        //         case 40:
        //         case 83:
        //             this.moveYDown = true
        //             break
        //     }
        //     if (this.setPosition) {
        //         this.nextDirection = true
        //     }
        //     this.setPosition = true
        // })

        // document.addEventListener("keyup", (e) => {
        //     switch (e.keyCode) {
        //         case 39:
        //         case 68:
        //             this.moveXUp = false
        //             this.moveZUp = false
        //             break
        //         case 37:
        //         case 65:
        //             this.moveXDown = false
        //             this.moveZDown = false
        //             break
        //         case 38:
        //         case 87:
        //             this.moveYUp = false
        //             break
        //         case 40:
        //         case 83:
        //             this.moveYDown = false
        //             break
        //     }
        //     if (!this.nextDirection) {
        //         this.setPosition = false
        //     }
        // })

        //this.pickedBlock = null;
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

    // testcode
    // createBlocks = () => {
    //     console.log("block")
    //     let block
    //     Blocks.blocks.map((shape, i) => {
    //         block = new Block(shape, this.player)
    //         // block.position.set(160 + (i % 4) * 40, 100, 40 )
    //         block.position.set(-300 + 30 * i, 0, 0)
    //         block.fullRotate(false)
    //         this.scene.add(block)
    //         this.blocks.push(block)
    //     })
    // }

    setPlayerPosition = () => {
        this.camera.position.set(0, 90, this.player == 2 ? 140 : -140)
        this.camera.lookAt(this.scene.position)
    }

    render = () => {
        TWEEN.update()
        requestAnimationFrame(this.render)

        // if (this.setPosition) {
        //     if (this.moveXUp) {
        //         this.x += 0.02
        //     }
        //     else if (this.moveXDown) {
        //         this.x -= 0.02
        //     }

        //     if (this.moveYUp) {
        //         if (this.y < 4) {
        //             this.y += 0.03
        //         }
        //     }
        //     else if (this.moveYDown) {
        //         if (this.y > -4) {
        //             this.y -= 0.03
        //         }
        //     }

        //     if (this.moveZUp) {
        //         this.z += 0.02
        //     }
        //     else if (this.moveZDown) {
        //         this.z -= 0.02
        //     }

        //     this.camera.position.x = 282 * Math.sin(this.x)
        //     this.camera.position.y = 200 * this.y
        //     this.camera.position.z = 282 * Math.cos(this.z)
        //     this.camera.lookAt(this.scene.position)
        // }

        this.renderer.render(this.scene, this.camera)
    }
}

export default Game