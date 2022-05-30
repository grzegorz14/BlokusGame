import Segment from "./Segment.js"

class Block extends THREE.Mesh {
    constructor(shape) {
        super() 
        this.geometry = new THREE.CylinderGeometry(20, 20, 10, 30)
        this.texture = 'https://i.imgur.com/o4zZcGW.png'
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(this.texture)
        })
    }
}

export default Block