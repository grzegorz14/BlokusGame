import Segment from "./Segment.js"

// zmienilem block na nie-zjebany
class Block extends THREE.Group {
    constructor(shape, player, isHelper) {
        super()
        this.shape = shape
        this.player = player
        this.rotationID = 0
        this.isHelper = isHelper
        this.w = this.shape[0].length
        this.h = this.shape.length
        this.xSize = this.shape[0].length
        this.zSize = this.shape.length
        this.segments = []
        this.filpped = false

        this.init()
    }

    init = () => {
        // <DEBUG>
        const axesHelper = new THREE.AxesHelper(5);
        this.add(axesHelper);
        // </DEBUG>

        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] == 1) {
                    let segment = new Segment(this.player, this.isHelper)
                    segment.position.set(-10 * j - 5, 0, -10 * i - 5)
                    this.segments.push(segment)
                    this.add(segment)
                }
            }
        }
    }

    flip() {
        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                //poggers
            }
        }
    }

    fullRotate(left) {
        if (left) {
            this.rotation.y += Math.PI / 2
            this.rotationID = (this.rotationID + 3) % 4

            if (this.rotationID == 0) {
                this.position.x += this.zSize * 10
                //this.position.x += -(this.h - this.w) * 10
            }
            if (this.rotationID == 1) {
                this.position.z += this.zSize * 10
                this.position.x -= (this.zSize - this.xSize) * 10
            }
            if (this.rotationID == 2) {
                this.position.x -= this.xSize * 10
                this.position.z -= (this.zSize - this.xSize) * 10
            }
            if (this.rotationID == 3) {
                this.position.z -= this.xSize * 10
            }
        } else {
            this.rotation.y -= Math.PI / 2
            this.rotationID = (this.rotationID + 5) % 4

            if (this.rotationID == 0) {
                this.position.z += this.xSize * 10
            }
            if (this.rotationID == 1) {
                this.position.x -= this.zSize * 10
                //this.position.x += -(this.h - this.w) * 10
            }
            if (this.rotationID == 2) {
                this.position.z -= this.zSize * 10
                this.position.x += (this.zSize - this.xSize) * 10
            }
            if (this.rotationID == 3) {
                this.position.x += this.xSize * 10
                this.position.z += (this.zSize - this.xSize) * 10
            }
        }
        this.rotateShape(left)

        let storew = this.w
        this.w = this.h
        this.h = storew

        //console.log(this.shape)

        // if (this.w % 2 == 0 != this.h % 2 ==   0) {
        //     if (this.rotationID % 2 == 0) {
        //         //this.position.x += 5 * this.w - 5
        //         //this.position.z += 5 * this.h - 5
        //         if (this.w > this.h)
        //             return Math.floor(this.w / 2)
        //         else
        //             return Math.floor(this.h / 2)
        //     } else {
        //         //this.position.x -= 5 * this.w - 5
        //         //this.position.z -= 5 * this.h - 5
        //         if (this.w > this.h)
        //             return Math.floor(this.w / 2)
        //         else
        //             return Math.floor(this.h / 2)
        //     }
        // }
        return 0
    }

    setRotation(rot) {
        for (let i = 0; i < rot; i++) {
            this.fullRotate(false)
        }
    }

    safeDelete(scene) {
        this.position.x = 1000
        this.position.y = 1000
        this.position.z = 1000
        // this.geometry.dispose()
        // this.material.dispose()
        scene.remove(this)
    }

    rotateShape(left) {
        let res = []
        if (left) {
            for (let i = 0; i < this.w; i++) {
                let r = []
                for (let j = 0; j < this.h; j++) {
                    r.push(this.shape[j][this.w - i - 1])
                }
                res.push(r)
            }
        } else {
            for (let i = 0; i < this.w; i++) {
                let r = []
                for (let j = 0; j < this.h; j++) {
                    r.push(this.shape[this.h - j - 1][i])
                }
                res.push(r)
            }
        }

        this.shape = res
    }

    materialize() {
        this.segments.forEach(s => s.materialize(this.player))
    }

    placable(valid) {
        this.segments.forEach(s => s.placable(valid))
    }
}

export default Block