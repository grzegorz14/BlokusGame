class Segment extends THREE.Mesh {
    constructor(isHelper) {
        super()

        this.geometry = new THREE.CylinderGeometry(6, Math.sqrt(2) * 5, 4, 4)
        this.rotation.y = Math.PI / 4
        console.log(isHelper)
        if (isHelper) {
            this.material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load('https://i.imgur.com/7GJw4NQ.png'),
                opacity: 0.5,
                transparent: true,
            })
        }
        else {
            this.material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load('https://i.imgur.com/7GJw4NQ.png')
            })
        }
    }
}

export default Segment
