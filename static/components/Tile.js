class Tile extends THREE.Mesh {
    constructor(row, column) {
        super()
        this.row = row
        this.column = column

        this.geometry = new THREE.CylinderGeometry(6, Math.sqrt(2) * 5, 4, 4)
        this.rotation.y = Math.PI / 4
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            //map: new THREE.TextureLoader().load('https://i.imgur.com/GBQ4ZZL.png')
            map: new THREE.TextureLoader().load('https://i.imgur.com/o4zZcGW.png')
        })
    }

    //changes color of the Tile
    highlighted = (bool) => {
        this.material = new THREE.MeshBasicMaterial({
            color: bool ? 0xaaffff : 0xffffff,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('https://i.imgur.com/GBQ4ZZL.png')
        })
    }
}

export default Tile
