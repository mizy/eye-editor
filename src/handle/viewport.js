require('../lib/TransformControls');//方向拖拽
import Area from './Area.js';
import Point from './Point.js';
import Thing from './Thing.js';
import Line from './Line.js';
import TriggerArea from './TriggerArea.js';
import TrafficArea from './TrafficArea.js';

const THREE = window.THREE;

class Viewport {
  constructor(watchMap) {
    this.history = window.globalState.history;
    this.mapControl = watchMap.pigeonMap.mapControl;//cameraControl
    this.pigeonMap = watchMap.pigeonMap;
    this.watchMap = watchMap;
    this.points = [];
    this.point = new Point(this);
    this.thing = new Thing(this);
    this.area = new Area(this);
    this.line = new Line(this);
    this.trigger = new TriggerArea(this);
    this.trafficArea = new TrafficArea(this);
    this.initControls();
    this.listenDomEvents();
    this.listenSelectedChange();//选中事件
    this.initContorlEvents();//控制改变事件
    this.addDragEvents();
  }

  //初始化拖动工具
  initControls() {
    const thingControl = new THREE.TransformControls(this.pigeonMap.camera, document.querySelector('#map'));
    this.pigeonMap.world.add(thingControl);
    this.domElement = document.querySelector('#map');
    thingControl.setSize(3);
    thingControl.setSpace('local');
    this.pigeonMap.inputHandler.raycaster.linePrecision = 2;
    window.globalState.controls = {};
    window.globalState.controls.thingControl = thingControl;
    //targetControl
    const targetPointContorl = new THREE.TransformControls(this.pigeonMap.camera, document.querySelector('#map'));
    this.pigeonMap.world.add(targetPointContorl);
    targetPointContorl.setSize(3);
    targetPointContorl.setSpace('local');
    window.globalState.controls.targetPointContorl = targetPointContorl;
    this.controls = {thingControl, targetPointContorl};
  }


  //监听viewportdrop的事件
  listenDomEvents() {
    this.domElement.addEventListener('dragover', (e) => {
      //获取鼠标当前位置，更新射线位置
      e.preventDefault();
      const rect = this.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.pigeonMap.inputHandler.mouse.set(x, y);
    });
    this.domElement.addEventListener('drop', (e) => {
      //添加物体
      e.preventDefault();
      if (window.globalState._dragItem) {
        this.thing.addThing(window.globalState._dragItem);
        delete window.globalState._dragItem;
      }
    });
  }

  //监听物体被选中相关逻辑
  listenSelectedChange() {
    const thingControl = this.controls.thingControl;
    const targetPointContorl = this.controls.targetPointContorl;

    this.domElement.addEventListener('contextmenu', e => {
      window.globalState.dispatchEvent({type: 'deselect', source: 'mouse'});
    });
    this.pigeonMap.inputHandler.addEventListener('click', e => {
      const data = this.testThing(e.data);//针对两种控制器的选中不必每个都绑定事件,特例
      if (data.object && data.coord) {
        data.object.coord = data.coord;
        if (this.binding) {//绑定状态下支架返回点击的ID
          window.globalState.dispatchEvent({
            type: 'chooseThing',
            object: data.object,
          });
          return;
        }
        //目标点被选中不触发
        if (data.object.name === 'targetPoint') {
          this.selectTargetPoint(data);
        }
        if (data.object.name === 'thing') {//没选中，或者已经选中同一物体
          this.selectThing(data);
        }
      } else {
        window.globalState.dispatchEvent({//触发点击事件
          type: 'click',
          coord: data.coord,
          object: data.object
        });
      }
    });
    //监听选中事件
    window.globalState.addEventListener('selectchange', (e) => {
      const thing = e.mesh;
      thingControl.detach();
      targetPointContorl.detach();
      thingControl.attach(thing.coordinates ? thing.parent : thing);
      this.toggleThing(e.mesh, e.pre);
      window.globalState.selectthing = thing;
    });
    //监听选中事件
    window.globalState.addEventListener('selectTargetPoint', (e) => {
      const thing = e.mesh;
      targetPointContorl.detach();
      targetPointContorl.attach(thing.coordinates ? thing.parent : thing);
    });
    //监听取消选中事件
    window.globalState.addEventListener('deselect', (e) => {
      targetPointContorl.detach();
      thingControl.detach();
    });
  }

  //选中目标点的时候
  selectTargetPoint(data) {
    const thingControl = this.controls.thingControl;

    //先选中对应的object
    window.globalState.dispatchEvent({type: 'deselect', object: data.object});//选择目标点同时也取消
    window.globalState.dispatchEvent({
      type: 'selectchange',
      pre: window.globalState.selectthing,
      mesh: data.object.thing,
      name: data.object.thing.name
    });
    //选中物体事件
    if (thingControl.object && data.object.parent === thingControl.object) return;//已经选中了物体
    window.globalState.dispatchEvent({
      type: 'selectTargetPoint',
      mesh: data.object,
      name: data.object.name
    });
    return false;
  }

  //选中物体
  selectThing(data) {
    const thingControl = this.controls.thingControl;
    if (thingControl.object && data.object.parent === thingControl.object) return;
    //agent对象被选中，没有绑定对象或者已经选中
    //选中物体事件
    window.globalState.dispatchEvent({type: 'deselect', object: data.object});
    window.globalState.dispatchEvent({
      type: 'selectchange',
      pre: window.globalState.selectthing,
      mesh: data.object,
      name: data.object.name
    });
  }

  //切换物体显影
  toggleThing(now, pre) {

  }

  //测试
  testThing(data) {
    if (!data.object) {
      return {
        coord: data.coord,
      };
    }
    if (data.object.name === 'targetPoint' || data.object.name === 'thing') {
      return data;
    } else if (data.coord) {
      return this.testThing({
        object: data.object.parent,
        coord: data.coord,
      });
    }
  }

  /**
   * 监听控制事件
   */
  initContorlEvents() {
    const thingControl = this.controls.thingControl;
    const targetPointContorl = this.controls.targetPointContorl;
    thingControl.addEventListener('change', (e) => {
      thingControl.update();
      if (!e.target.object) return;//没有绑定就触发change
      window.globalState.dispatchEvent({
        type: 'changething',
        mode: e.target.getMode(),
        name: e.target.object.children[0].userData.name,
        mesh: e.target.object.children[0]
      });
    });
    targetPointContorl.addEventListener('change', (e) => {
      targetPointContorl.update();
      if (!e.target.object) return;//没有绑定就触发change
      window.globalState.dispatchEvent({
        type: 'changeTargetPoint',
        mode: e.target.getMode(),
        name: e.target.object.children[0].userData.name,
        mesh: e.target.object.children[0]
      });
    });
    //控制地图在拖动时不动
    thingControl.addEventListener('mouseDown', (e) => {
      this.mapControl.disable = true;
      this.mapControl.mouseStatus = null;//不在各种鼠标状态下
    });
    thingControl.addEventListener('mouseUp', (e) => {
      setTimeout(() => {
        this.mapControl.disable = false;
      }, 10);
    });
    targetPointContorl.addEventListener('mouseDown', (e) => {
      this.mapControl.disable = true;
      this.mapControl.mouseStatus = null;//不在各种鼠标状态下
    });
    targetPointContorl.addEventListener('mouseUp', (e) => {
      setTimeout(() => {
        this.mapControl.disable = false;
      }, 10);
    });
  }

  //拖拽事件
  addDragEvents() {
    this.pigeonMap.inputHandler.addEventListener('mousedown', e => {
      let {data} = e || {};
      let {object} = data || {}
      if (object && this.testDragObject(object)) {
        this.mapControl.disable = true;
        this.draggingItem = e.data.object;
        this.mapControl.disable = true; //控制地图控制器
      }
    });
    this.pigeonMap.inputHandler.addEventListener('mouseup', e => {
      if (this.draggingItem) {
        this.draggingItem = null;
        setTimeout(() => {
          this.mapControl.disable = false;
        }, 10);
      }
    });
    this.pigeonMap.inputHandler.addEventListener('mouseover', e => {
      window.globalState.dispatchEvent({
        type: 'mouseover',
        coord: e.coord
      });
    });
  }

  //测试是否是支持直接拖拽的类型
  testDragObject(object) {
    return object._listeners && object._listeners['dragover'];
  }

}

export default Viewport;
