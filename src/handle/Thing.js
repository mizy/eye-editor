import ObjLoader from './ObjLoader';
const THREE = window.THREE;
export default class Thing {
  constructor(viewport) {
    this.pigeonMap = viewport.pigeonMap;
    this.initMeshs();
    this.listenEvents();
    this.objLoader = new ObjLoader();
  }

  listenEvents() {
    //删除
    window.globalState.addEventListener('deleteThing', (e) => {
      if ( window.globalState.selectthing) {
        let thing = window.globalState.selectthing;
        window.globalState.dispatchEvent({
          type: 'deselect'
        });
        this.deleteThing(thing);
        thing = null;
        window.globalState.dispatchEvent({
          type: 'removeThing',
          data: e
        });
               
      }
    });
    window.globalState.addEventListener('deselect', (e) => {
      window.globalState.selectthing = null;
    });
  }

  //删除物体
  deleteThing(thing) {
    window.globalState.controls.thingControl.detach();
    window.globalState.controls.targetPointContorl.detach();
    const objectName = thing.userData.name;
    window.globalState.history.removeObject(objectName);
    //points
    thing.points && thing.points.map(item => {
      item.parent.parent && item.parent.parent.remove(item.parent);
    });
    thing.startPoints && thing.startPoints.map(item => {
      item.parent.parent.remove(item.parent);
    });
    //area
    if (thing.areas) {
      for (const x in thing.areas) {
        thing.areas[x].parent.remove(thing.areas[x]);
      }
    }
    //line
    thing.line && this.pigeonMap.remove(thing.line);
    delete thing.line;
    //thing
    thing.parent.parent.remove(thing.parent);
    window.globalState.things = window.globalState.things.filter(item => item.uuid !== thing.uuid);
    window.globalState.dispatchEvent({
      type: 'detachThing',
    });
    if (thing.userData.role.name === 'gplus') {
      delete window.globalState.history.XG;
    }
  }

  //初始化物体模型
  initMeshs() {
    this.meshs = [];
    this.meshs['thing'] = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshPhongMaterial({ color: 0x88aacc, opacity: 0.8, transparent: true }));
  }

  //添加对应的物体到地图中
  addThing(data, pos, callback) {
    if (data.role.name === 'gplus') {
      return this.addXG(data, pos, callback);
    }
    const appearance = data.role.appearance;
    let coord;
    if (!pos) {
      const obj = this.pigeonMap.inputHandler.getHoveredElement(true);
      if (!obj) {return}
      coord = obj.point.clone();
      coord.x -= this.pigeonMap.world.position.x;coord.y -= this.pigeonMap.world.position.y;
      coord.z = appearance.height / 2;
      data.initlocation = [coord];
      data.initorient = [0, 0, 0];
    } else {
      coord = pos;
    }
        
    const mesh = this.meshs['thing'].clone();
    mesh.geometry = new THREE.BoxGeometry(appearance.length, appearance.width, appearance.height);
    mesh.name = 'thing';
    mesh.aname = data.name;
    this.pigeonMap.addAtCoordinate(mesh, [coord.x, coord.y, appearance.height / 2]);
    mesh.userData = data;
    mesh.parent.rotation.z = data.initorient && (data.initorient[2] || 0);
    //添加了物体进入
    window.globalState.things.push(mesh);
    window.globalState.dispatchEvent({
      type: 'addThing'
    });
    window.globalState.history.addObject(data);
    callback && callback(mesh);
    return mesh;
  }

  addXG(data, pos, callback) {
    if (!window.globalState.models['xg']) {
      this.objLoader.loadXG().then((XG) => {
        this.addXG(data, pos, callback);
      });
      return false;
    }
    let coord;
    if (!pos) {
      const obj = this.pigeonMap.inputHandler.getHoveredElement(true);
      if (!obj) {return}
      coord = obj.point.clone();
      coord.x -= this.pigeonMap.world.position.x;coord.y -= this.pigeonMap.world.position.y;
      data.name = 'xg';//生成新的Data
      data.initlocation = [coord];
      data.initorient = [0, 0, 0];
    } else {
      coord = pos;
    }

    if ( window.globalState.history.XG) {
      this.deleteThing(window.globalState.history.XG);
    }
    const mesh = window.globalState.models['xg'].clone();
    mesh.name = 'thing';
    mesh.userData = data;
    window.globalState.history.XG = mesh;
    this.pigeonMap.addAtCoordinate(mesh, [coord.x, coord.y, coord.z]);
    mesh.parent.rotation.z = data.initorient && (data.initorient[2] || 0);
    window.globalState.history.addObject(data);
    callback && callback(mesh);
    return mesh;
  }
}