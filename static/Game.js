import Tile from "./Tile.js"
import Block from "./Block.js"
import Blocks from "./blocks.js"

class Game {
    constructor() {
        this.scene = new THREE.Scene()
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()
    
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
        this.camera.position.set(0, 400, 500)
        this.camera.lookAt(this.scene.position)
    
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor(0x000000)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    
        document.getElementById("root").append(this.renderer.domElement)

        this.player = null
        this.opponent = null

        this.blocks = []
        this.tiles = []

        this.createBoard()
    
        // onClick on object
        let object = null
        window.addEventListener("mousedown", async (e) => {
            this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1
            this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1
            this.raycaster.setFromCamera(this.mouseVector, this.camera)
            const intersects = this.raycaster.intersectObjects(this.scene.children)
    
            if (intersects.length > 0) {
                object = intersects[0].object
    
                //check if object is a block
            }
        });
    
        this.render()
    }

    createBoard = () => {
        let tile
        for (let i = 0; i < 14; i++) {
            for (let j = 0; j < 14; j++) {
                tile = new Tile(i ,j)
                tile.position.set(325 - j * 50, -10, 325 - i * 50)
                this.tiles.push(tile)
                this.scene.add(tile)
            }
        }
    }

    createBlocks = () => {
        let block
        Blocks.blocks.map(shape => {
            block = new Block(shape, this.player)
            this.scene.add(block)
            this.blocks.push(block)
        })
    }

    setPlayerPosition = () => {
        this.camera.position.set(0, 400, this.player == 2 ? 500 : -500)
        this.camera.lookAt(this.scene.position)
    }

    render = () => {
        TWEEN.update()
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
    }
}

export default Game