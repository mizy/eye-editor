import React from 'react';
import Select from 'antd/lib/select';
import Tab from 'antd/lib/tabs';
import Button from 'antd/lib/button';
// import NumberPicker from 'antd/lib/number-picker';
import Icon from 'antd/lib/icon';

/**
 * schema
 *
 * object:{
 *     initlocation:{x,y,z},
 *     initlocation:[{},{}],
 *     initlocation:{left:{},right:{}},
 * }
 *
 */
export default class StartGoal extends React.Component {
  constructor(cfg) {
    super(cfg);
    this.dotOptions = [
      {label: '单点', value: 'single'},
      {label: '区域随机', value: 'area'},
      {label: '多点随机', value: 'multi'}
    ];
    this.state = {
      startFuzzing: false,
      points: [{x: 0, y: 0, z: 0}],
    };
  }

  componentDidMount() {
    this.listenStartPositionChange();
  }

  listenStartPositionChange() {
    //改变初始位置或者位姿
    window.globalState.addEventListener('changething', (e) => {
      if (this.object.name !== e.mesh.userData.name) return;
      if (e.mode === 'translate') {//确认是当前选中的物体发生变化
        const name = this.props.object.name;
        const data = window.globalState.schema.objects[name];
        const position = e.mesh.parent.position;//父元素的位姿
        data.initlocation[0] = position;
        if (this.object.startPointType === 'area') {
          window.globalState.dispatchEvent({//改变区域
            type: 'addArea',
            data: {
              thing: this.props.thing,
              index: 'start',
              location: data.initlocation,
            }
          });
        }
        this.props.onChange(data);
      } else if (e.mode === 'rotate') {
        const z = e.mesh.parent.rotation.z;
        this.object.initorient = [0, 0, z || 0];
        this.props.onChange(this.object);
      }
    });
    //添加点
    window.globalState.addEventListener('click', (e) => {
      const coord = e.coord;
      const object = this.object;
      if (this.selecting) {
        if (this.object.startPointType === 'area') {//区域
          object.initlocation[1] = coord;
          window.globalState.dispatchEvent({//添加或者重回区域
            type: 'addArea',
            data: {
              thing: this.props.thing,
              index: 'start',
              location: object.initlocation,
            }
          });
        } else {//多点
          object.initlocation[this.selecting] = coord;
        }
        window.globalState.dispatchEvent({
          type: 'addStartPoint',
          data: {
            thing: this.props.thing,
            pointIndex: this.selecting,
            location: coord,
          }
        });
        this.props.onChange(object);
        this.toggleCrossMouse();
        this.selecting = false;
      }
    });

  }

  /**
   * 更改点的类型
   */
  changeDotType(type) {
    this.object.startPointType = type;
    const nowLocation = this.props.thing.parent.position;
    const initlocation = [nowLocation];
    this.object.initlocation = initlocation;
    this.clearMeshs();
    this.props.onChange(this.object);
  }

  changeNumbers(num) {
    this.object.numbers = num;
    this.props.onChange(this.object);
  }

  //清除视图无用的mesh
  clearMeshs() {
    const {thing} = this.props;
    const pigeonMap = window.globalState.watchMap.pigeonMap;
    //清除原先所有的点
    if (thing.startPoints) {
      thing.startPoints.map(item => pigeonMap.remove(item.parent));
      thing.startPoints = [];
    }
    //清除原先的area
    if (thing.areas && thing.areas['startArea']) {
      thing.areas['startArea'].geometry.dispose();
      pigeonMap.remove(thing.areas['startArea']);
      thing.areas['startArea'] = null;
    }
  }

  /**
   * 选择点
   */
  selectPoint(t) {
    this.selecting = t;
    this.toggleCrossMouse();
  }

  //渲染选点区域
  renderDot() {
    const {object} = this.props;
    const type = object.startPointType;
    switch (type) {
      case 'single':
        return <div className="position-info">
          <div><span>X</span> {object.initlocation[0].x.toFixed(2)}</div>
          <div><span>Y</span> {object.initlocation[0].y.toFixed(2)}</div>
          <div><span>Z</span> {object.initlocation[0].z.toFixed(2)} </div>
        </div>;
      case 'area':
        return this.renderAreaDot();
      case 'multi':
        return this.renderMultiDot();
      default :

    }
  }

  //区域选择
  renderAreaDot() {
    const {object} = this.props;
    const left = object.initlocation[0] || {};
    const right = object.initlocation[1] || {x: 0, y: 0, z: 0};
    return <React.Fragment>
      <div className="position-info">
        <div><span>X</span> {left.x.toFixed(2)}</div>
        <div><span>Y</span> {left.y.toFixed(2)}</div>
        <div><span>Z</span> {left.z.toFixed(2)} </div>
      </div>
      <div className="choose-position">
        <i onClick={() => {
          this.selectPoint(1)
        }} className="et-icon icon-view"></i>
        <div className="position-info">
          <div><span>X</span> {right.x.toFixed(2)}</div>
          <div><span>Y</span> {right.y.toFixed(2)}</div>
          <div><span>Z</span> {right.z.toFixed(2)} </div>
        </div>
      </div>
    </React.Fragment>;
  }

  //多点选择
  renderMultiDot() {
    const {object} = this.props;
    const initlocation = object.initlocation;
    return <React.Fragment>
      <div className="icon-bar"><Icon size="small" type="add" onClick={() => {
        this.selectPoint(initlocation.length)
      }} style={{fontSize: '24px'}}/></div>
      {
        initlocation.map((item, index) => {
          let res;
          if (index === 0) {
            res = <div className="position-info" key={index}>
              <div><span>X</span> {item.x.toFixed(2)}</div>
              <div><span>Y</span> {item.y.toFixed(2)}</div>
              <div><span>Z</span> {item.z.toFixed(2)} </div>
            </div>;
          } else {
            res = <div className="choose-position" key={index}>
              <i onClick={() => {
                this.selectPoint(index)
              }} className="et-icon icon-view"/>
              <div className="position-info">
                <div><span>X</span> {item.x.toFixed(2)}</div>
                <div><span>Y</span> {item.y.toFixed(2)}</div>
                <div><span>Z</span> {item.z.toFixed(2)} </div>
              </div>
            </div>;
          }
          return res;
        })
      }
    </React.Fragment>;
  }

  /**
   * 切换鼠标样式
   */
  toggleCrossMouse() {
    const studio = document.querySelector('.m-studio');
    if (studio.className !== 'm-studio crosshair') {
      studio.className = 'm-studio crosshair';
    } else {
      studio.className = 'm-studio';
    }
  }

  //渲染
  render() {
    const {object, visible} = this.props;
    this.object = this.props.object;//记录当前的object
    return <div className="startGoalConfig" style={{display: !visible ? 'none' : 'block'}}>
      <Tab>
        <Tab.Item title="起">
          <div className="goal-content">
            {!this.state.startFuzzing && this.object.startPointType === 'single' ?
              (<React.Fragment>
                <div className="goal-angle"><span>角度</span>{this.object.initorient[2]}</div>
                <div className="position-info">
                  <div><span>X</span> {object.initlocation[0].x.toFixed(2)}</div>
                  <div><span>Y</span> {object.initlocation[0].y.toFixed(2)}</div>
                  <div><span>Z</span> {object.initlocation[0].z.toFixed(2)} </div>
                </div>
                {/*<div className="fuzzing-button">*/}
                  {/*<Button*/}
                    {/*type="primary"*/}
                    {/*onClick={() => this.setState({startFuzzing: true})}>*/}
                    {/*万向设置*/}
                  {/*</Button>*/}
                {/*</div>*/}
              </React.Fragment>) :
              (<React.Fragment>
                <div className="goal-title">模型位置起点</div>
                <div className="goal-angle"><span>角度</span>{this.object.initorient[2]}</div>
                <div className="type-select"><span>类型</span> &nbsp;
                  <Select
                    onChange={this.changeDotType.bind(this)}
                    dataSource={this.dotOptions}
                    value={object.startPointType}/>
                </div>
                <div className="goal-points">
                  {this.renderDot()}
                </div>
                <div className="fuzzing-button active">
                  <Button onClick={() => {
                    this.setState({startFuzzing: false})
                  }}>返回模型位置起点 </Button>
                </div>
              </React.Fragment>)}
          </div>
        </Tab.Item>
        {/*<Tab.Item title="策">*/}
        {/*<div className="fuzzing-numbers">*/}
        {/*<label>次数：</label><NumberPicker style={{ width: 100 }} value={object.numbers} onChange={this.changeNumbers.bind(this)} />*/}
        {/*</div>*/}
        {/*</Tab.Item>*/}
      </Tab>
    </div>;
  }
}
