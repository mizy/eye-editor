const THREE = window.THREE;
export default class Trigger {
  constructor(viewport) {
    this.pigeonMap = viewport.pigeonMap;
    this.initMesh();
    this.listenEvents();
  }

  initMesh() {
    this.geometry = new THREE.BufferGeometry();
    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xdd539a });
    this.lineHoverMaterial = new THREE.LineBasicMaterial({ color: 0xfaffeb });
    this.line = new THREE.Line(this.geometry, this.lineMaterial );
        
    this.pointMaterial = new THREE.MeshPhongMaterial({ color: 0xdd539a });
    this.pointHoverMaterial = new THREE.MeshPhongMaterial({ color: 0xfaffeb });
    this.point = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), this.pointMaterial);
  }

  //事件变化
  listenEvents() {
    window.globalState.addEventListener('addTriggerPoint', e => {
      const coord = e.coord;
      const object = e.object;
      this.addPoint({ coord, object });
      this.updateLine(object);
      this.updateSchema(object);
    });
   
    window.globalState.addEventListener('deselect', e => {
      this.leaveObject(this.selecting, true);//强制取消选中
      this.selecting = null;
    });
    window.globalState.addEventListener('deleteThing', e => {
      if (this.selecting) {
        this.deleteTrigger(this.selecting);
        this.selecting = null;
        window.globalState.dispatchEvent({ type: 'deselect' });
      }
    });
    window.globalState.addEventListener('triggerMousemove', e => {
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

  deleteTrigger(object) {
    delete window.globalState.schema.triggers[object.name];
    window.globalState.triggers.filter(item => item.uuid !== object.uuid);
    object.points.map(item => {
      item.removeEventListener();
      this.pigeonMap.remove(item);
    });
    object.points = null;
    object.removeEventListener();
    this.pigeonMap.remove(object);
  }

  //新增新trigger
  addNewTrigger(trigger) {
    const triggerObject = this.line.clone();
    triggerObject.geometry = this.line.geometry.clone();
    triggerObject.points = [];
    triggerObject.name = 'trigger_' + new Date().getTime();
    const schema = trigger;
    schema.name = triggerObject.name;
    triggerObject.userData = trigger;
    window.globalState.history.modifyTrigger(schema);//添加schema到全局变量
    return triggerObject;
  }

  //还原trigger
  addTrigger(data) {
    const triggerObject = this.line.clone();
    triggerObject.geometry = this.line.geometry.clone();
    triggerObject.points = [];
    triggerObject.userData = data;
    triggerObject.name = data.name;
    return triggerObject;
  }

  //添加点 
  addPoint({ coord, object }) {
    const point = this.point.clone();
    point.name = 'triggerAreaPoint';
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
    point.name = 'triggerAreaPoint';
    this.pigeonMap.addAtCoordinate(point, [coord.x, coord.y, 0.5]);
    point.line = object;
    return point;
  }

  //选中事件
  addSelectEvents(object) {
    object.addEventListener('click', e => {
      this.selectObject(object);
    });
    object.addEventListener('mouseover', e => {
      if (!this.hoverPoint)
        this.hoverObject(object);
    });
    object.addEventListener('mouseout', e => {
      this.leaveObject(object);
    });
    window.globalState.triggers.push(object);
  }

  //点的事件处理
  addPointSelectEvents(object) {
    object.addEventListener('click', e => {
      if (object.line.hoverPoint && object.line.hoverPoint.visible) return;//这种情况不要选中
      this.selectObject(object.line);
    });
    object.addEventListener('mouseover', e => {
      this.hoverObject(object.line);
    });
    object.addEventListener('mouseout', e => {
      this.leaveObject(object.line);
    });
    object.addEventListener('dragover', e => {
      const coord = e.coord;
      this.pigeonMap.addAtCoordinate(object, [coord.x, coord.y, 0.5]);
      this.updateLine(object.line);
      this.updateSchema(object.line);
    });
  }

  selectObject(object) {
    window.globalState.dispatchEvent({
      type: 'deselect',
      object: object
    });
    window.globalState.dispatchEvent({
      type: 'selectTriggerArea',
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
  }

  //恢复原样，选中态不恢复
  leaveObject(line, force) {
    if (!force && line === this.selecting) return;//强行离开
    if (!line) return;//没有选中
    line.material = this.lineMaterial;
    line.points.map(item => {
      item.material = this.pointMaterial;
    });
  }

  //更新线
  updateLine(object) {
    this.baseXYZ = object.points[0].parent.position.clone();//更新基准位置
    const points = this.updatePoints(object);
    object.geometry.addAttribute('position', new THREE.BufferAttribute(points, 3));
    object.geometry.computeBoundingSphere();
    this.pigeonMap.addAtCoordinate(object, [this.baseXYZ.x, this.baseXYZ.y, this.baseXYZ.z]);
  }

  //更新schema todo:
  updateSchema(object) {
    const trigger = window.globalState.schema.triggers[object.name];
    const points = [];
    object.points.map(item => {
      points.push(item.parent.position);
    });
    trigger.points = points;
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
    return new Float32Array(points);
  }
}