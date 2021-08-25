import DataLoader from '../data/DataLoader';
import Message from 'antd/lib/message';
// import axios from 'axios';
import React from 'react';
import Viewport from '../handle/viewport';
import utils from 'utils';

require('../../lib/yaml.js');
import DataParser from '../data/DataParser';

const API = {
  token: {
    url: '/api/task/token',
    data: {}
  }
};

const getGeo = (SN, VERSION) => {
  return `/produce/cloud_lmap/${SN}/export_data/${VERSION}/pushdata/lmap/geo.json`;
};
export default class Viewer extends React.Component {
  state = {};

  componentDidMount() {
    this.getMapToken();
  }

  getMapToken() {
    const {url, data} = API.token;
    const {schema} = window.globalState || {};
    data.mapId = schema && schema.mapVersion;
    utils.getData(url, data, (res) => {
      if (!res.offset) {
        Message.error('没有地图数据');
        // this.props.setError();
        return;
      }
      this.initStudio(res);
    });
  }

  //解析数据
  loadData() {
    this.initSchema();
    window.globalState.dataLoader = this.dataLoader;
    this.dataLoader = new DataLoader();
    this.dataLoader.loadData(window.globalState.schema);
  }

  //地图数据加载再进行数据格式化，因为依赖offset
  initSchema() {
    let schema = {};
    if (window.globalState.yamlData) {
      schema = DataParser.convert(window.globalState.yamlData);
    } else {
      schema = {'objects': {}, triggers: {}, agentSources: {}};
    }
    window.globalState.schema = Object.assign(window.globalState.schema, schema);
    window.globalState.dispatchEvent({
      type: 'loadSchema'
    });
  }

  //初始化天眼
  initStudio(data) {
    const {offset} = data;
    const domain = 'http://et-lmap-online.oss-cn-shanghai.aliyuncs.com';
    // if (window.location.href.indexOf('alibaba-inc') > -1) {
    //   domain = '//lmap.cainiao.com';
    // }
    // if (window.location.href.indexOf('pre') > -1) {
    //   domain = '//pre-lmap.cainiao.com';
    // }
    // if (!data.offset) {
    //   Message.error('没有地图信息，请配置正确地图')
    //   return
    // }
    // domain = 'http://et-lmap-online.oss-cn-shanghai.aliyuncs.com/';
    let {mapVersion} = this.props.schema;
    mapVersion = mapVersion.split('&');
    const mapUrl = getGeo(mapVersion[0], mapVersion[1]);

    this.watchMap = new window.WatchMap({
      container: '.viewer',
      isRos: false,
      autoCenter: true,
      isAmap: false,
      noData: true,
      pitch: Math.PI / 3,
      domain: domain,
      mapId: window.globalState.schema.mapVersion,
      updateView: false,
      mapUrl,
      offset: {
        x: offset[0], y: offset[1],
      },
    });

    this.watchMap.onCarLoad = (car) => {
      car.visible = false;
    };
    this.watchMap.pigeonMap.map.zoom = 80;
    this.watchMap.pigeonMap.map.fov = Math.PI / 8;
    this.watchMap.pigeonMap.map.pitch = 0;
    //绘图工具
    this.watchMap.pigeonMap.drawTool = new window.PigeonGL.DrawTool();
    this.watchMap.pigeonMap.addLayer(this.watchMap.pigeonMap.drawTool);
    window.globalState.watchMap = this.watchMap;
    window.globalState.viewer = this;
    this.resize();
    window.onresize = () => this.resize();
    this.viewport = new Viewport(this.watchMap);
    this.watchMap.mapLayer.on('load', () => {//地图加载完毕，再加载场景数据
      this.loadData();//加载场景数据
    });
  }

  /**
   * 页面自适应
   */
  resize() {
    const dom = document.querySelector('.viewer');
    // dom.style.left = '150px';
    const width = window.innerWidth;
    const height = window.innerHeight - 40;
    dom.style.width = width + 'px';
    dom.style.height = height + 'px';
    dom.style.top = '40px';
    this.watchMap.pigeonMap.map.width = width;
    this.watchMap.pigeonMap.map.height = height;
    this.watchMap.pigeonMap.cameraControl.updateMap();
  }


  render() {
    return (<div className="viewer"></div>);
  }
}
