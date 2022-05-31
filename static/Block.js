import Segment from "./Segment.js"

class Block {
    constructor(shape, player) {
        this.shape = shape
        this.player = player
        this.container = new THREE.Object3D()

        this.init()
    }

    init = () => {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] == 1) {
                    let segment = new Segment()
                    segment.position.set(10 * i, 10, 10 * j)
                    this.container.add(segment)
                }
            }
        }
    }

    getBlock = () => {
        return this.container
    }
}

export default Block