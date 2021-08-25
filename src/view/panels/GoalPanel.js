import React from 'react';
import Select from 'antd/lib/select';
import Tab from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import Speed from '../component/speed.js';

export default class GoalPanel extends React.Component {
  constructor(cfg) {
    super(cfg);
    this.state = {
      dotTypes: [
        {label: '单点', value: 'single'},
        {label: '区域', value: 'area'},
        {label: '多点', value: 'multi'}
      ],
      startPoint: [],
      startFuzzing: false,
      dotType: 'single',
      points: [{x: 0, y: 0, z: 0}],
    };
    this.selecting = false;//是否正在选点
    this.listenChange();
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      startFuzzing: false
    });
  }

  /**
   * 监听事件
   */
  listenChange() {
    window.globalState.addEventListener('click', (e) => {
      const location = e.coord;
      if (this.selecting !== false) {
        window.globalState.controls.targetPointContorl.detach();
        const pointIndex = this.selecting;
        //更新schema
        this.goal.location[pointIndex] = location;
        this.props.onChange(this.goal);

        //添加点
        window.globalState.dispatchEvent({
          type: 'addPoint',
          data: {
            thing: this.props.thing,
            pointIndex: pointIndex, //goal的第几个点
            goalIndex: this.props.goalIndex, //第几个goal
            location: location
          }
        });

        //更新区域
        if (this.goal.type === 'area') {
          this.updateArea();
        }
        this.selecting = false;
        //鼠标回去
        this.removeCrossMouse();
      }
    });
    //更改目标点的位置或者朝向
    window.globalState.addEventListener('changeTargetPoint', (e) => {
      const {mesh} = e;
      const orientation = [0, 0, mesh.parent.rotation.z];
      this.goal.orientation = orientation;
      this.goal.location[mesh.userData.pointIndex] = mesh.parent.position;

      this.props.onChange(this.goal);
      if (this.goal.type === 'area') {//区域的话要重新绘制点
        this.updateArea();
      }
    });
  }

  //触发区域重绘事件
  updateArea() {
    window.globalState.dispatchEvent({
      type: 'addArea',
      data: {
        thing: this.props.thing,
        index: this.props.goalIndex,
        location: this.goal.location
      }
    });
  }

  /**
   * 改变类型
   */
  changeDotType(value) {
    const nowLocation = this.goal.location;
    this.goal.location = [nowLocation[0]];
    this.goal.type = value;
    this.clearMeshs();
    this.props.onChange(this.goal);
  }

  /**
   * 清除冗余的Mesh
   */
  clearMeshs() {
    const {thing, goalIndex} = this.props;
    const pigeonMap = window.globalState.watchMap.pigeonMap;
    //清除原先所有的点
    if (thing.points) {
      thing.points.map((item) => {
        if (item.userData.pointIndex !== 0 && item.userData.goalIndex === goalIndex) pigeonMap.remove(item.parent);
      });
      //  thing.points = [thing.points[0]];
    }
    //清除原先的area
    if (thing.areas && thing.areas[goalIndex]) {
      thing.areas[goalIndex].geometry.dispose();
      pigeonMap.remove(thing.areas[goalIndex]);
      thing.areas[goalIndex] = null;
    }
  }

  /**
   * 更改点的类型
   */
  changeNumbers(value) {
    this.goal.numbers = value;
    this.props.onChange(this.goal);
  }

  renderDot() {
    const goal = this.goal;
    switch (goal.type) {
      case 'single':
        return <div className="choose-position">
          <i onClick={() => {
            this.selectPoint(0)
          }} className="et-icon icon-view">
          </i>
          <div className="position-info">
            <div><span>X</span> {goal.location[0].x.toFixed(2)}</div>
            <div><span>Y</span> {goal.location[0].y.toFixed(2)}</div>
            <div><span>Z</span> {goal.location[0].z.toFixed(2)} </div>
          </div>
        </div>;
      case 'area':
        return this.renderAreaDot();
      case 'multi':
        return this.renderMultiDot();
      default:
    }
  }

  renderAreaDot() {
    const goal = this.goal;
    const left = goal.location[0] || {x: 0, y: 0, z: 0};
    const right = goal.location[1] || {x: 0, y: 0, z: 0};
    return <React.Fragment>
      <div className="choose-position">
        <i onClick={() => {
          this.selectPoint(0)
        }} className="et-icon icon-view">
        </i>
        <div className="position-info">
          <div><span>X</span> {left.x.toFixed(2)}</div>
          <div><span>Y</span> {left.y.toFixed(2)}</div>
          <div><span>Z</span> {left.z.toFixed(2)} </div>
        </div>
      </div>
      <div className="choose-position">
        <i onClick={() => {
          this.selectPoint(1)
        }} className="et-icon icon-view">
        </i>
        <div className="position-info">
          <div><span>X</span> {right.x.toFixed(2)}</div>
          <div><span>Y</span> {right.y.toFixed(2)}</div>
          <div><span>Z</span> {right.z.toFixed(2)} </div>
        </div>
      </div>
    </React.Fragment>;
  }

  renderMultiDot() {
    const goal = this.goal;
    return <React.Fragment>
      <Button size="small" type="primary" onClick={() => {
        this.selectPoint(goal.location.length)
      }} style={{fontSize: '24px'}}>+</Button>
      {
        goal.location.map((item, index) => {
          return <div key={index} className="choose-position">
            <i onClick={() => {
              this.selectPoint(index)
            }} className="et-icon icon-view"/>
            <div className="position-info">
              <div><span>X</span> {item.x.toFixed(2)}</div>
              <div><span>Y</span> {item.y.toFixed(2)}</div>
              <div><span>Z</span> {item.z.toFixed(2)} </div>
            </div>
          </div>;
        })
      }
    </React.Fragment>;
  }

  /**
   * 地图选点
   */
  selectPoint(key) {
    this.addCrossMouse();
    this.selecting = key;
  }

  addCrossMouse() {
    const studio = document.querySelector('.m-studio');
    studio.className = 'm-studio crosshair';
  }

  removeCrossMouse() {
    const studio = document.querySelector('.m-studio');
    studio.className = 'm-studio ';
  }

  onSpeedChange(v, type) {
    this.goal.speed = v;
    this.props.onChange(this.goal);
  }

  render() {
    const {goalIndex, object} = this.props;//输入属性
    let goal = object.goal.script[goalIndex];
    if (!goal) goal = {//初始化么有goal
      type: 'single',
      orientation: [0, 0, 0],
      location: [{x: 0, y: 0, z: 0}]
    };
    this.goal = goal;//保存最新的goal用
    const visible = this.props.visible;
    return <div className="startGoalConfig" style={{display: !visible ? 'none' : 'block'}}>
      <Tab>
        <Tab.Item title="终">
          <div className="goal-content">
            {goal.type === 'single' && this.state.startFuzzing === false ?
              (<React.Fragment>
                <div className="goal-title">终点{goalIndex}</div>
                <div className="goal-angle">
                  <span>角度</span>
                  {goal.orientation && goal.orientation[2]}
                </div>
                <div className="choose-position">
                  <Button text onClick={() => {
                    this.selectPoint(0)
                  }}>
                    <i className="et-icon icon-view"/>
                  </Button>
                  <div className="position-info">
                    <div><span>X</span> {goal.location[0].x.toFixed(2)}</div>
                    <div><span>Y</span> {goal.location[0].y.toFixed(2)}</div>
                    <div><span>Z</span> {goal.location[0].z.toFixed(2)} </div>
                  </div>
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
                <div className="type-select"><span>类型</span> &nbsp;
                  <Select onChange={this.changeDotType.bind(this)} value={goal.type} dataSource={this.state.dotTypes}/>
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
        <Tab.Item title="行">
          <div className="speed-select">
            <Speed speed={this.goal.speed} onChange={this.onSpeedChange.bind(this)}/>
          </div>
        </Tab.Item>
      </Tab>
    </div>;
  }
}
