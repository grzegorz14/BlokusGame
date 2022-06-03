import Segment from "./Segment.js"

// zmienilem block na nie-zjebany
class Block extends THREE.Object3D{
    constructor(shape, player) {
        super()
        this.shape = shape
        this.player = player
        // this.container = new THREE.Object3D()

        this.init()
    }

    init = () => {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] == 1) {
                    let segment = new Segment()
                    segment.position.set(10 * i -  5 * this.shape.length + 5, 0, 10 * j - 5 * this.shape[i].length + 5)
                    this.add(segment)
                }
            }
        }
    }

    fullRotate(left){
        if(left){
            this.rotation.y += Math.PI / 2
        }else{
            this.rotation.y -= Math.PI / 2
        }
    }
}

export default Block