const THREE = window.THREE;
export default class Line {
  constructor(viewport) {
    this.pigeonMap = viewport.pigeonMap;
    this.initMesh();
    this.listenEvents();
  }

  listenEvents() {
    window.globalState.addEventListener('addArea', e => {
      const { thing } = e.data;
      this.update(thing);
    });
    window.globalState.addEventListener('addPoint', e => {
      const { thing } = e.data;
      this.update(thing);
    });
    window.globalState.addEventListener('changething', e => {
      const thing = e.mesh;
      this.update(thing);
    });
    window.globalState.addEventListener('updateLine', e => {
      const thing = e.mesh;
      this.update(thing);
    });
  }

  initMesh() {
    this.material = new THREE.LineBasicMaterial( {
      transparent: true,
      opacity: 0.3, color: 0xf0ff05 });
    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, -0.1, 0.1, 0.1, -0.1]), 3));
    this.line = new THREE.Line(this.geometry, this.material );
  }

  /**
     * 还原物体所有的区域
     */
  update(thing) {
    if (thing.userData.role.name === 'gplus') return;
    const object = window.globalState.schema.objects[thing.userData.name];
    if (!thing.line) {//没有线添加线
      this.addLine(thing);
    }
    const line = thing.line;
    const goals = object.goal.script;
    const positions = [];
    if (goals.length < 1) return false;
    const baseXYZ = object.initlocation[0];
    positions.push(0, 0, 0);
    for (const x in goals) {
      const location = goals[x].location[0];
      positions.push(
        location.x - baseXYZ.x,
        location.y - baseXYZ.y,
        0);
    }
    line.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    line.geometry.computeBoundingBox();
    this.pigeonMap.moveToCoordinate(line, [baseXYZ.x, baseXYZ.y, 0.5]);
  }

  addLine(thing) {
    thing.line = this.line.clone();
    thing.line.geometry = this.geometry.clone();
    this.pigeonMap.addAtCoordinate(thing.line, [0, 0]);
  }

}