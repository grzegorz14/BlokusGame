import Segment from "./Segment.js"

// zmienilem block na nie-zjebany
class Block extends THREE.Object3D {
    constructor(shape, player) {
        super()
        this.shape = shape
        this.player = player
        this.rotationID = 0

        this.init()
    }

    init = () => {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] == 1) {
                    let segment = new Segment()
                    segment.position.set(10 * i - 5 * this.shape.length + 5, 0, 10 * j - 5 * this.shape[i].length + 5)
                    this.add(segment)
                }
            }
        }
    }

    fullRotate(left) {
        if (left) {
            this.rotation.y += Math.PI / 2
            this.rotationID = (this.rotationID + 1) % 4
        } else {
            this.rotation.y -= Math.PI / 2
            this.rotationID = (this.rotationID - 1) % 4
        }

        console.log(this.rotationID)

        if (this.shape.length % 2 == 0 != this.shape[0].length % 2 == 0) {
            if (this.rotationID % 2 == 0) {
                this.position.x += 5
                this.position.z += 5
                return -1
            } else {
                this.position.x -= 5
                this.position.z -= 5
                return 1
            }
        }
        return 0
    }
}

export default Block