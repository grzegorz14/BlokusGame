import Segment from "./Segment.js"

// zmienilem block na nie-zjebany
class Block extends THREE.Group {
    constructor(shape, player, isHelper) {
        super()
        this.shape = shape
        this.player = player
        this.rotationID = 0
        this.w = this.shape.length
        this.h = this.shape[0].length

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
                    let segment = new Segment(this.isHelper)
                    segment.position.set(-10 * this.shape[i].length + 10 * j + 5, 0, -10 * i - 5)
                    this.add(segment)
                }
            }
        }
    }

    fullRotate(left) {
        if (left) {
            this.rotation.y += Math.PI / 2
            this.rotationID = (this.rotationID + 3) % 4

            if (this.rotationID == 0) {
                this.position.x += this.h * 10
                //this.position.x += -(this.h - this.w) * 10
            }
            if (this.rotationID == 1) {
                this.position.z += this.h * 10
                this.position.x -= (this.h - this.w) * 10
            }
            if (this.rotationID == 2) {
                this.position.x -= this.w * 10
                this.position.z -= (this.h - this.w) * 10
            }
            if (this.rotationID == 3) {
                this.position.z -= this.w * 10
            }
        } else {
            this.rotation.y -= Math.PI / 2
            this.rotationID = (this.rotationID + 5) % 4

            if (this.rotationID == 0) {
                this.position.z += this.w * 10
            }
            if (this.rotationID == 1) {
                this.position.x -= this.h * 10
                //this.position.x += -(this.h - this.w) * 10
            }
            if (this.rotationID == 2) {
                this.position.z -= this.h * 10
                this.position.x += (this.h - this.w) * 10
            }
            if (this.rotationID == 3) {
                this.position.x += this.w * 10
                this.position.z += (this.h - this.w) * 10
            }
        }
        this.rotateShape(left)

        console.log(this.shape)

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
        let c = this.rotationID - rot

        for (let i = 0; i < Math.abs(c); i++) {
            if (c < 0) {
                this.fullRotate(true)
            }
            else {
                this.fullRotate(false)
            }
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
        let xLen = this.shape.length
        let zLen = this.shape[0].length

        if (left) {
            for (let i = 0; i < zLen; i++) {
                let r = []
                for (let j = 0; j < xLen; j++) {
                    r.push(this.shape[j][this.h - i - 1])
                }
                res.push(r)
            }
        } else {
            for (let i = 0; i < zLen; i++) {
                let r = []
                for (let j = 0; j < xLen; j++) {
                    r.push(this.shape[this.w - j - 1][i])
                }
                res.push(r)
            }
        }

        this.shape = res
    }
}

export default Block