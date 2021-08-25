const THREE = window.THREE;
export default class Point {
  constructor(viewport) {
    this.pigeonMap = viewport.pigeonMap;
    this.initMesh();
    this.listenAddPoint();
  }

  initMesh() {
    this.meshs = {};
    this.meshs['point'] = new THREE.Mesh( new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshPhongMaterial( { color: 0xffff00 } ) );
    this.meshs['startPoint'] = new THREE.Mesh( new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshPhongMaterial( { color: 0xf0ff50 } ) );
    this.meshs['targetPoint'] = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry( 1.7, 0.8, 1.2 ), new THREE.MeshPhongMaterial( { color: 0xff0fff } ) );
    const arrowGeometry = new THREE.Geometry();
    arrowGeometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 2, 0, 0 ),
      new THREE.Vector3( 2, 0, 0 ),
      new THREE.Vector3( 1.7, 0.4, 0 ),
      new THREE.Vector3( 2, 0, 0 ),
      new THREE.Vector3( 1.7, -0.4, 0 )
    );
    const arrow = new THREE.LineSegments(arrowGeometry, new THREE.MeshPhongMaterial( { color: 0xff0fff } ) );
    this.meshs['targetPoint'].box = box;
    this.meshs['targetPoint'].arrow = arrow;
    this.meshs['targetPoint'].add(box);
    this.meshs['targetPoint'].add(arrow);
  }

  //监听添加点事件  
  listenAddPoint() {
    window.globalState.addEventListener('addPoint', e => {
      this.addPoint(e.data, e.data.thing);
    });
    window.globalState.addEventListener('addStartPoint', e => {
      this.addStartPoint(e.data, e.data.thing);
    });
  }

  /**
     * 还原object 本身所有的点
     */
  addPoints(object, thing) {
    const goals = object.goal.script;
    for (const x in goals) {
      const goal = goals[x];
      goal.location.map((item, index) => {
        this.addPoint({
          pointIndex: index,
          goalIndex: x,
          orientation: goal.orientation,
          location: item }, thing);
      });
    }
    //还原起点的点
    const initlocation = object.initlocation;
    initlocation.map((item, index) => {
      if (index !== 0) {//模型起点不需要点
        this.addStartPoint({
          pointIndex: index,
          location: item,
        }, thing);
      }
    });
  }

  /**
     * 更改点的位置，关联的agent，第几个点
     */
  addPoint(data, thing) {
    if (!thing.points)thing.points = [];
    let mesh = this.getPointFromMesh(thing.points, data);
    if (!mesh) {
      mesh = this.addNewPoint(data, thing);
    } else {
      this.pigeonMap.addAtCoordinate(mesh, [data.location.x, data.location.y, 0.5]);
    }
    mesh.userData.pointIndex = data.pointIndex;
    mesh.userData.thing = thing;
    mesh.userData.goalIndex = parseInt(data.goalIndex);
    return mesh;
  }

  addPointEvents(point) {
    point.addEventListener('dragover', (e) => {
      const coord = e.coord;
      this.pigeonMap.addAtCoordinate(point, [coord.x, coord.y, 0.5]);
      window.globalState.dispatchEvent({
        type: 'changePoint',
        coord: coord,
        point: point
      });
    });
  }

  /**
     * 新生产的点
     */
  addNewPoint(data, thing) {
    const object = window.globalState.schema.objects[thing.userData.name];
    let mesh;
    if (object.role.name === 'gplus') {
      mesh = this.meshs['targetPoint'].clone();
      mesh.name = 'targetPoint';
      mesh.thing = thing;
    } else {
      mesh = this.meshs['point'].clone();
      mesh.name = 'point';
      mesh.geometry = mesh.geometry.clone();
      this.addPointEvents(mesh);
    }
    thing.points.push(mesh);
    this.pigeonMap.addAtCoordinate(mesh, [data.location.x, data.location.y, 0.5]);
    mesh.parent.rotation.z = data.orientation && data.orientation[2] || 0;
        
    return mesh;
  }

  /**
     * 添加起点 位置，关联的agent，第几个点
     */
  addStartPoint(data, thing) {
    if (!thing.startPoints)thing.startPoints = [];
    let mesh = this.getPointFromMesh(thing.startPoints, data);
    if (!mesh) {
      mesh = this.meshs['startPoint'].clone();
      thing.startPoints.push(mesh);
      mesh.userData.thing = thing;
      this.addPointEvents(mesh);
      this.pigeonMap.addAtCoordinate(mesh, [data.location.x, data.location.y, 0.5]);
    } else {
      this.pigeonMap.moveToCoordinate(mesh, [data.location.x, data.location.y, 0.5]);
    }

    mesh.name = 'point';
    mesh.userData.pointIndex = data.pointIndex;
    mesh.userData.goalIndex = 'start';
    return mesh;
  }

  /**
     * 获取已经存在的点
     */
  getPointFromMesh(points, data) {
    for (const x in points) {
      if (points[x].userData.pointIndex === data.pointIndex &&
             points[x].userData.goalIndex === data.goalIndex) {
        return points[x];
      }
    }
    return false;
  }

}