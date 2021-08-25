import React from 'react';
import 'antd/dist/antd.css';
import LeftBar from './view/Leftbar';
import TopBar from './view/Topbar';
import RightBar from './view/Rightbar';
import Viewer from './view/Viewer';
import CenterBar from './view/Centerbar';
import History from './data/history';
import Message from 'antd/lib/message';
import utils from 'utils';
import API from 'api';

require('./style/style.less');
require('./style/icon.css');

class App extends React.Component {

  constructor(config) {
    super(config);
    this.state = {
      name: false,
      initData: {}
    };
    this.initGlobalState();
    this.getScenario();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  //初始化全局需要的东西
  initGlobalState() {
    window.globalState = new window.THREE.EventDispatcher();//全局事件分发器，处理模块间通讯
    this.history = new History(this.watchMap);
    window.globalState.history = this.history;
    window.globalState.index = -1;
    window.globalState.things = [];//存放所有障碍物
    window.globalState.triggers = [];//存放所有触发器
    window.globalState.trafficAreas = [];//存放所有交通流区域实例
    window.globalState.models = {};//存放所有模型window.globalState.models = {};//存放所有模型

  }

  /**
   * 拉取yaml文件
   */
  getScenario() {
    const caseId = utils.getParamByName('caseId');
    if (!caseId) return;
    const {url, data} = API.read;
    data.caseId = caseId;
    this.setState({
      view: false
    });
    this.watchMap = null;
    window.globalState = window.globalState || {};
    window.globalState.things = [];

    utils.getData(url, data, (res) => {
      this.setState({initData: {data: res}});
      this.loadYaml(res, caseId);
      this.setState({
        view: true
      })
    });
  }


  //解析yaml
  loadYaml(data) {
    //schema默认数据
    window.globalState.schema = {
      algoVersion: data.algoVersion,
      caseId: data.caseId,
      workSpaceId: data.workSpaceId,
      mapVersion: data.mapId,
      triggers: {},
      agentSources: {},
      objects: {},
      name: data.name
    };
    if (data.scenario) {
      try {
        const yamlData = window.YAML.parse(data.scenario);
        window.globalState.yamlData = yamlData;
        this.setState({
          mapVersion: data.mapId,
          name: data.name
        });
      } catch (e) {
        Message.error('yaml 文件异常，请检查文件格式内容是否正确！')
      }
    } else {
      this.setState({
        mapVersion: data.mapId,
        name: data.name
      });
    }
  }

  /**
   * 新增
   */
  addNew(obj) {
    window.globalState.schema = {'objects': {}, triggers: {}, agentSources: {}};
    window.globalState.schema.mapVersion = obj.mapVersion;
    window.globalState.schema.name = obj.name;
    this.setState(obj);
  }

  setError() {
    this.setState({
      mapVersion: false
    });
  }

  render() {
    return <div className="m-studio">
      <TopBar/>
      {
        this.state.mapVersion ? <React.Fragment>
            <div className="m-studio-layout">
              <LeftBar/>
              <CenterBar getScenario={this.getScenario.bind(this)} initData={this.state.initData}/>
              <RightBar/>
            </div>
            {
              this.state.view && <Viewer schema={window.globalState.schema}/>
            }
          </React.Fragment> :
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <div>
              <img src="https://img.alicdn.com/tfs/TB10NCtsmzqK1RjSZPxXXc4tVXa-207-103.png"/>
              <div style={{textAlign: 'center'}}>该场景不支持展示，请试试其他的</div>
            </div>
          </div>
        /* <NewScene addNew={this.addNew.bind(this)} />*/
      }
    </div>;
  }
}

export default App;
