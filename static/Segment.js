class Segment extends THREE.Mesh {
    constructor(player, isHelper) {
        super()

        this.geometry = new THREE.CylinderGeometry(6, Math.sqrt(2) * 5, 4, 4)
        this.rotation.y = Math.PI / 4
        if (isHelper) {
            this.material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load('textures/placeholder.png'),
                color: 0xffff00,
                opacity: 0.5,
                transparent: true,
            })
        }
        else {
            if (player == 1) {
                this.material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: new THREE.TextureLoader().load('textures/placeholder.png'),
                    color: 0x0000ff
                })
            } else {
                this.material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: new THREE.TextureLoader().load('textures/placeholder.png'),
                    color: 0x00ff00
                })
            }

        }
    }
}

export default Segment
