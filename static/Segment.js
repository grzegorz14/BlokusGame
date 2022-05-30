class Segment extends THREE.Mesh {
    constructor(row, column) {
        super()
        this.row = row
        this.column = column
        
        this.geometry = new THREE.BoxGeometry(50, 18, 50)
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('https://i.imgur.com/GBQ4ZZL.png')
        })
    }
}

export default Segment
