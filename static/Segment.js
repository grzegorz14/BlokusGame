class Segment extends THREE.Mesh {
    constructor() {
        super()

        this.geometry = new THREE.CylinderGeometry(4, 8, 4, 4)
        this.rotation.y = Math.PI / 4
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('https://i.imgur.com/7GJw4NQ.png')
        })
    }
}

export default Segment
