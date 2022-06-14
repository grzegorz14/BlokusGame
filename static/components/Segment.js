class Segment extends THREE.Mesh {
    constructor(player, isHelper) {
        super()

        this.geometry = new THREE.CylinderGeometry(6, Math.sqrt(2) * 5, 4, 4)
        this.rotation.y = Math.PI / 4
        if (isHelper) {
            this.material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load('textures/texture3.png'),
                color: 0xff0000,
                opacity: 0.5,
                transparent: true,
            })
        }
        else {
            if (player == 1) {
                this.material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: new THREE.TextureLoader().load('textures/texture3.png'),
                    color: 0x2222cc
                })
            } else {
                this.material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: new THREE.TextureLoader().load('textures/texture3.png'),
                    color: 0x22cc22
                })
            }
        }
    }

    materialize(player) {
        this.material.opacity = 0.9

        if (player == 1) {
            this.material.color.setHex(0x22cc22)
        } else {
            this.material.color.setHex(0x2222cc)
        }
    }

    placable(isValid) {
        if (isValid) {
            this.material.color.setHex(0x00ffff)
        } else {
            this.material.color.setHex(0xff0000)
        }
    }
}

export default Segment
