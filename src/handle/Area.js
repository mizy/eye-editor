const THREE = window.THREE;
export default class Area {
  constructor(viewport) {
    this.pigeonMap = viewport.pigeonMap;
    this.initMesh();
    this.listenEvents();
  }

  listenEvents() {
    window.globalState.addEventListener('addArea', e => {
      const { thing, location, index } = e.data;
      this.addArea(location, index, thing);
    });
      
  }

  initMesh() {
    this.meshs = {};
    const material = new THREE.MeshBasicMaterial( {
      transparent: true, side: THREE.DoubleSide,
      opacity: 0.3, color: 0xf0fff5 } ) ;
    this.meshs['area'] = new THREE.Mesh( new THREE.BufferGeometry(), material );
  }

  /**
     * 还原物体所有的区域
     */
  addAreas(data, thing) {
    const { initlocation, startPointType, goal } = data;
    if (startPointType === 'area') {//起点区域重绘
      this.addArea(initlocation, 'start', thing);
    }
    goal.script.map((item, index) => {
      if (item.type === 'area') {
        this.addArea(item.location, index, thing);
      }
    });
  }
    
  /**
     * 添加区域的数据 key当前区域的ID或者index
     */
  addArea(location, index, thing) {
    if (!location[1] || !location[0]) return;
    thing.areas = thing.areas || [];
    let area;
    if (thing.areas[index]) {
      area = thing.areas[index];
    } else {
      area = this.meshs['area'].clone();
      area.geometry = area.geometry.clone();
      area.geometry.verticesNeedUpdate = true;
      area.drawMode = THREE.TriangleStripDrawMode;
    }
    const points = this.generatePoints(location[0], location[1]);
    area.geometry.addAttribute('position', new THREE.BufferAttribute(points, 3));
    area.geometry.computeBoundingBox();
    this.pigeonMap.addAtCoordinate(area, [location[0].x, location[0].y, 0.2]);
    thing.areas[index] = area;
  }

  generatePoints(left, right) {
    if (!left || !right) return new Float32Array([]);
    return new Float32Array([
      0, 0, 0.2,
      right.x - left.x, 0, 0,
      0, right.y - left.y, 0,
      right.x - left.x, right.y - left.y, 0
    ]);
  }
}