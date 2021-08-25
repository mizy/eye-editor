const THREE = window.THREE;
export default class TrafficArea {
  constructor(viewport) {
    this.pigeonMap = viewport.pigeonMap;
    this.initMesh();
    this.listenEvents();
  }

  initMesh() {
    this.geometry = new THREE.BufferGeometry();
    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x82a6f5 });
    this.lineHoverMaterial = new THREE.LineBasicMaterial({ color: 0xfadaff });
    this.line = new THREE.Line(this.geometry, this.lineMaterial );
    this.pointMaterial = new THREE.MeshPhongMaterial({ color: 0x82a6f5 });
    this.pointHoverMaterial = new THREE.MeshPhongMaterial({ color: 0xfadaff });
    this.point = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), this.pointMaterial);
    this.areaMaterial = new THREE.MeshBasicMaterial({ color: 0x82a6f5, transparent: true, opacity: 0.2 });
    this.areaHoverMaterial = new THREE.MeshBasicMaterial({ color: 0xfadaff, transparent: true, opacity: 0.6 });
    this.area = new THREE.Mesh(new THREE.BufferGeometry(), this.areaMaterial);
  }

  //事件变化
  listenEvents() {
    window.globalState.addEventListener('addTrafficPoint', e => {
      const coord = e.coord;
      const object = e.object;
      // this.selectObject(object)
      this.addPoint({ coord, object });
      this.updateLine(object);
    });
    window.globalState.addEventListener('deselect', e => {
      this.leaveObject(this.selecting, true);//强制取消选中
      this.selecting = null;
    });
    window.globalState.addEventListener('deleteThing', e => {
      if (this.selecting) {
        this.deleteTraffic(this.selecting);
        this.selecting = null;
        window.globalState.dispatchEvent({ type: 'deselect' });
      }
    });
    window.globalState.addEventListener('trafficMousemove', e => {
      const coord = e.coord;
      const object = e.object;
      if (!object.hoverPoint) {//跟随鼠标移动的点
        object.hoverPoint = this.addHoverPoint({ coord, object });
      } else {
        this.pigeonMap.addAtCoordinate(object.hoverPoint, [coord.x, coord.y]);
      }
      this.updateLine(object);
    });
  }

  deleteTraffic(object) {
    window.globalState.trafficAreas.filter(item => item.uuid !== object.uuid);
    object.points.map(item => {
      item.removeEventListener();
      this.pigeonMap.remove(item);
    });
    object.points = null;
    object.removeEventListener();
    this.pigeonMap.remove(object);
  }

  //新增新traffic
  addNewTraffic(item) {
    const trafficObject = this.line.clone();
    trafficObject.geometry = this.line.geometry.clone();
    trafficObject.points = [];
    const trafficArea = this.area.clone();
    trafficArea.geometry = trafficArea.geometry.clone();
    trafficObject.add(trafficArea);
    trafficObject.area = trafficArea;
    trafficObject.name = item.name;
    trafficObject.userData = item;
    return trafficObject;
  }

  //还原traffic
  addTraffic(data) {
    const trafficObject = this.line.clone();
    trafficObject.geometry = this.line.geometry.clone();
    trafficObject.points = [];
    trafficObject.userData = data;
    trafficObject.name = data.name;
    return trafficObject;
  }

  //添加点 设计失误，此处应该只做数据模型管理
  addPoint({ coord, object }) {
    const point = this.point.clone();
    point.name = 'trafficAreaPoint';
    this.pigeonMap.addAtCoordinate(point, [coord.x, coord.y, 0.5]);
    object.points || (object.points = []);
    if (object.points.length < 1) this.addSelectEvents(object);
    this.addPointSelectEvents(point);
    point.line = object;
    object.points.push(point);
  }

  //添加点 
  addHoverPoint({ coord, object }) {
    const point = this.point.clone();
    point.name = 'trafficAreaPoint';
    this.pigeonMap.addAtCoordinate(point, [coord.x, coord.y, 0.5]);
    point.line = object;
    return point;
  }

  //选中事件
  addSelectEvents(object) {
    
  }

  //点的事件处理
  addPointSelectEvents(object) {
     
    object.addEventListener('dragover', e => {
      const coord = e.coord;
      this.pigeonMap.addAtCoordinate(object, [coord.x, coord.y, 0.5]);
      this.updateLine(object.line);
      window.globalState.dispatchEvent({
        type: 'modifyTrafficArea',
        object: object.line,
        data: object.line.userData
      });
    });
  }

  selectObject(object) {
    window.globalState.dispatchEvent({
      type: 'deselect'
    });
    window.globalState.dispatchEvent({
      type: 'selectTrafficArea',
      object: object,
    });
    this.selecting = object;
    this.hoverObject(object);
  }

  hoverObject(line) {
    line.material = this.lineHoverMaterial;
    line.points.map(item => {
      item.material = this.pointHoverMaterial;
    });
    line.area.material = this.areaHoverMaterial;
  }

  //恢复原样，选中态不恢复
  leaveObject(line, force) {
    if (!force && line === this.selecting) return;//强行离开
    if (!line) return;//没有选中
    line.material = this.lineMaterial;
    line.points.map(item => {
      item.material = this.pointMaterial;
    });
    line.area.material = this.areaMaterial;
  }

  //更新线
  updateLine(object) {
    if (object.points.length < 1) return;
    this.baseXYZ = object.points[0].parent.position.clone();//更新基准位置
    const points = this.updatePoints(object);
    this.updateArea(object, points);
    object.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
    object.geometry.computeBoundingSphere();
    this.pigeonMap.addAtCoordinate(object, [this.baseXYZ.x, this.baseXYZ.y, this.baseXYZ.z]);
  }

  //更新区域
  updateArea(object, points) {
    const { area } = object;
    const earcut = window.WatchMap.earcut;
    const indexs = earcut(points, false, 3);
    const res = [];
    indexs.map((index) => {
      res.push(points[3 * index + 0], points[3 * index + 1], points[3 * index + 2]);
    });
    area.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(res), 3) );
    area.geometry.computeBoundingSphere();
  }

  //更新点数
  updatePoints(object) {
    const items = object.points;
    const points = [];
    items.map(item => {
      const position = item.parent.position;
      points.push(
        position.x - this.baseXYZ.x,
        position.y - this.baseXYZ.y,
        position.z - this.baseXYZ.z
      );
    });
    if (object.hoverPoint && object.hoverPoint.visible) {
      const hoverPosition = object.hoverPoint.parent.position;
      points.push(
        hoverPosition.x - this.baseXYZ.x,
        hoverPosition.y - this.baseXYZ.y,
        hoverPosition.z - this.baseXYZ.z
      );
    }
    points.push(
      points[0], points[1], points[2]
    );
    return (points);
  }
}