import React from 'react';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import StartGoalPanel from './StartGoalPanel';
import GoalPanel from './GoalPanel';

export default class MovePanel extends React.Component {
  constructor(cfg) {
    super(cfg);
    this.state = {
      thing: {},
      goal: {},
      goalIndex: 0
    };
  }

  componentDidMount() {
    window.globalState.addEventListener('selectchange', (e) => {//切换选择
      const mesh = e.mesh;
      const schema = window.globalState.schema.objects[mesh.userData.name];
      const goal = schema.goal;
      this.setState({
        object: schema,
        goalIndex: 'start',
        thing: mesh,
        goal: goal
      });
    });
    window.globalState.addEventListener('selectTargetPoint', (e) => {//xg目标点选中
      const point = e.mesh;
      const {goalIndex, pointIndex} = point.userData;
      this.setState({goalIndex, pointIndex});
    });
    window.globalState.addEventListener('changePoint', e => {//点的位置发生改变
      this.updatePointPosition(e);
    });
  }

  //点的位置更新时，更新视图
  updatePointPosition(e) {
    const point = e.point;
    const thing = point.userData.thing;
    const object = window.globalState.schema.objects[thing.userData.name];
    const goalIndex = point.userData.goalIndex;
    const pointIndex = point.userData.pointIndex;
    if (goalIndex === 'start') {//起点
      if (object.startPointType === 'area') {
        object.initlocation[1] = e.coord;
        window.globalState.dispatchEvent({//改变区域
          type: 'addArea',
          data: {
            thing: thing,
            index: 'start',
            location: object.initlocation,
          }
        });
      } else if (object.startPointType === 'multi') {
        object.initlocation[pointIndex] = e.coord;
      }
    } else {//目标点
      object.goal.script[goalIndex].location[pointIndex] = e.coord;
      if (object.type === 'area') {
        window.globalState.dispatchEvent({//改变区域
          type: 'addArea',
          data: {
            thing: thing,
            key: goalIndex,
            location: object.goal.script[goalIndex].location,
          }
        });
      } else {
        window.globalState.dispatchEvent({//重绘线
          type: 'updateLine',
          mesh: thing
        });
      }
    }

    window.globalState.history.modifyObject(object);
    if (this.state.object && (this.state.object.name === object.name)) {//更新panel
      this.setState({
        object: object
      });
    }
  }

  //改变goal的值
  onGoalChange(goal) {
    const {thing, goalIndex} = this.state;
    //修改schema
    const object = window.globalState.schema.objects[thing.userData.name];
    object.goal.script[goalIndex] = goal;
    window.globalState.history.modifyObject(object);
    this.setState({
      object: object,
    });
  }

  /**
   * 初始点变化
   */
  onStartPointChange(object) {
    window.globalState.history.modifyObject(object);
    this.setState({
      object: object
    });
  }

  /**
   * 新增目标
   */
  addGoal() {
    const {object} = this.state;
    const goalIndex = this.state.object.goal.script.length;
    object.goal.script[goalIndex] = {location: [{x: 0, y: 0, z: 0}], type: 'single'};
    this.setState({
      object,
      goalIndex: goalIndex
    });
  }

  delGoal(index) {
    delete this.state.object.goal.script[index];
    this.clearMeshs(index);
    this.setState({
      goalIndex: 'start'
    });
  }

  /**
   * 清除冗余的Mesh
   */
  clearMeshs(goalIndex) {
    const thing = this.state.thing;
    const pigeonMap = window.globalState.watchMap.pigeonMap;
    //清除原先所有的点
    if (thing.points) {
      thing.points.map((item) => {
        if (item.userData.goalIndex === goalIndex) {
          pigeonMap.remove(item.parent);
        }
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

  changeGoal(index) {
    this.setState({
      goalIndex: index
    });
  }

  //渲染tab
  renderTab() {
    const {object, thing, goalIndex} = this.state;
    return <React.Fragment>
      <div className="goal-list">
        <ul>
          <li className={goalIndex === 'start' ? 'active' : ''} onClick={() => {
            this.changeGoal('start')
          }}>起点
          </li>
          {
            this.state.goal.script && this.state.goal.script.map((item, index) => {
              return <li key={index} onClick={() => {
                this.changeGoal(index)
              }} className={goalIndex === index ? 'active' : ''}>
                <span>终点{index}</span><Icon type="ashbin" onClick={() => {
                this.delGoal(index)
              }}/>
              </li>;
            })
          }
        </ul>
        <div className="add-goal-button">
          <Button size="small" onClick={this.addGoal.bind(this)} type="primary">+ 新增目标点</Button>
        </div>
      </div>
      <StartGoalPanel visible={goalIndex === 'start'} onChange={this.onStartPointChange.bind(this)} object={object}
                      thing={thing}/>
      <GoalPanel visible={goalIndex !== 'start'} onChange={this.onGoalChange.bind(this)} thing={thing}
                 goalIndex={goalIndex} object={object}/>
    </React.Fragment>;
  }

  render() {
    return <div className="movePanel">
      {this.state.object ? this.renderTab() : ''}
    </div>;
  }
}
