import React from 'react';
import DataParser from '../data/DataParser';
import Message from 'antd/lib/message';
import Switch from 'antd/lib/switch';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/Modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import utils from 'utils';
import API from 'api';
import { Menu} from 'antd';

let HELP_URL = 'https://cota.cainiao-inc.com/?source=asim#/packing';
if (location.host.indexOf('pre-') > -1) {
  HELP_URL = 'https://pre-cota.cainiao-inc.com/?source=asim#/packing';
} else if (location.host.indexOf('.test') > -1) {
  HELP_URL = 'https://cota.cainiao-inc.test/?source=asim#/packing';
}

const testNasa = (str) => {
  let autogoList = ['autogo_full_traffic_docker',
    'autogo_full_scenario_docker_ne',
    'autogo_full_scenario_docker']
  return str && str.indexOf('nasa') > -1 || autogoList.indexOf(str) > -1
}

const FormItem = Form.Item;

const {Item, SubMenu} = Menu;

export default class Centerbar extends React.Component {
  state = {
    things: [],
    errorVisible: false,
    errorMessage: '',
    configVisible: false,
    mapVisible: false,
    autoSelect: true,
    numbers: 1,
    algoType: true,
    nasaTrue: false,
    mapScenes: [],
    runTypes: [],
    nasaDevices: [],
    userDefinedValue: false,
    mapSceneValue: '',
    asimDockerNameValue: '',
    dockersDefaultValue: '',
  }

  componentDidMount() {
    const {data} = this.props.initData;
    let {
      mapScene,
      mapId,
      dockerVersion,
      dockerNameAsim,
      runType,
      nasaEnv,
      nasaDevice,
      dockerNameIpc,
      dockerNamePar,
    } = data || {};
    this.setState({
      mapScene,
      mapSceneValue: !mapScene && mapId ? '0' : 'mapScene',
      mapId,
      dockerVersion,
      asimDockerNameValue: dockerNameAsim,
      runType,
      nasaEnv,
      nasaDevice,
      dockerNameIpc,
      dockerNamePar,
      nasaTrue: testNasa(runType)
    })
    if (!mapScene && mapId) {
    }
    // if (!mapScene && mapId) {
    //   this.setState({
    //     mapId: mapId,
    //     runType: 'autogo_adas_docker',
    //     nasaDevice: 'NASA-ASIM-002',
    //     mapSceneValue: '0',
    //     dockerVersion: dockerVersion,
    //     asimDockerNameValue: dockerNameAsim,
    //     nasaServerEnv: 'daily'
    //   });
    //   this.fieldMap.setValue('mapId', data.mapId);
    // } else {
    //   this.setState({
    //     runType: 'autogo_adas_docker',
    //     mapSceneValue: mapScene,
    //     dockerVersion: dockerVersion,
    //     nasaDevice: 'NASA-ASIM-001',
    //     asimDockerNameValue: dockerNameAsim,
    //     nasaServerEnv: 'daily'
    //   });
    // }
    this.getDockerNameIpcSource();
    this.getMapScenes();
  }

  getRunTypes() {
    const {url, data} = API.getNewRunType;
    if (this.state.runTypes.length !== 0) {
      return;
    }
    utils.getData(url, data, (res) => {
      const list = [];
      const items = res;
      for (const key in items) {
        list.push({
          label: items[key], value: key
        });
      }
      this.setState({
        runTypes: list
      });
    });
  }

  getNasaDevice() {
    const {url, data} = API.getNasaDevice;
    utils.getData(url, data, (res) => {
      this.setState({
        nasaDevices: res.map((item) => {
          return {
            label: item, value: item
          };
        })
      });
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return false;
    };
  }

  save() {
    const yamlJson = DataParser.convert2yaml();
    let yaml = window.YAML.stringify(yamlJson, 4);
    if (yaml === '[]') yaml = '';
    const {schema} = window.globalState || {}
    const {caseId, name, algoVersion, mapVersion} = schema;
    const mapId = mapVersion;
    let {url, data, method} = API.createWorkspace;
    Object.assign(data, {name, mapId, caseId, algoVersion});
    data.scenario = yaml;
    utils.getData(url, data, (res) => {
      let {caseCheckSuccess, caseCheckMessage} = res || {}
      if (caseCheckSuccess) {
        Message.success('保存成功');
      } else {
        this.setState({
          errorMessage: '失败：' + caseCheckMessage || '保存失败',
          errorVisible: true
        })
      }
    }, () => {
    }, method)
  }

  play() {
    const {workSpaceId, caseId} = window.globalState.schema;
    if (!workSpaceId) {
      Message.warning('请先操作保存，再预览');
      return;
    }
    let {url, data} = API.read;
    data.caseId = caseId;
    utils.getData(url, data, (res) => {
      this.setPlayUrl(Object.assign(res, {caseId, workSpaceId}));
    })
  }

  setPlayUrl(info) {
    let {
      workSpaceId,
      caseId,
      runType,
      nasaEnv,
      nasaDevice,
      dockerNameIpc,
      dockerNamePar,
      dockerNameAsim,
      mapId,
      previewNum
    } = info;
    let teamId = parent.window &&
      parent.window.globalData &&
      parent.window.globalData.teamId;
    // teamId = 1;
    if (!teamId) {
      Message.error('teamId不存在，请使用正确方式获取teamId');
      return;
    }
    if (!dockerNameAsim) {
      this.configVisible = true;
      // this.setState({configVisible: true});
      this.config();
      return;
    }
    mapId = encodeURIComponent(mapId);
    const win = window.open('/manage/skyeye/skip');
    let {url, data} = API.play;
    previewNum = previewNum || 1;
    Object.assign(data, {
      workSpaceId,
      caseId,
      dockerNameAsim,
      mapId,
      previewNum,
      teamId,
      runType,
      nasaEnv,
      nasaDevice,
      dockerNameIpc,
      dockerNamePar,
    });
    utils.getData(url, data, (res) => {
      if (res.length < 1) {
        win.close();
        return false;
      }
      const ips = [], ports = [];
      // 考虑多个节点
      res.map(item => {
        const {serverInfo} = item;
        const serverInfoFormat = serverInfo && JSON.parse(serverInfo.replace(/&quot;/g, '"'));
        const {ip, dockerPort} = serverInfoFormat || {};
        ips.push(ip);
        ports.push(dockerPort);
      })

      const item = res[0];
      const {token, utmdId, taskId, offset} = item || {};
      const [x, y, z] = offset;

      const initSkip = () => {
        win.dispatchEvent(new CustomEvent('queryData', {
          detail: {
            token, x, y, z, taskId, utmdId,
            ip: ips.join(','),
            port: ports.join(','),
          }
        }));
      }
      if (!win.taskId) {
        setTimeout(() => {
          initSkip();
        }, 500);
      }
      initSkip();
    }, () => {
      win.close();
    }, 'PUT')
  }

  runTypesChange(e) {
    this.setState({nasaTrue: testNasa(e)})
  }

  static delete(e) {
    window.globalState.dispatchEvent({
      type: 'deleteThing',
      data: e
    });
  }

  submitConfigData() {
    const {
      caseId,
      mapVersion,
      name,
      algoVersion
    } = window.globalState.schema;
    const mapId = mapVersion;
    this.field.validate((err, values) => {
      if (!err) {
        values.previewNum = 1;
        const dockerItems = values.dockers.split('|-|');
        values.dockerNameIpc = values.dockerNameIpc || dockerItems[1];
        values.dockerNamePar = values.dockerNamePar || dockerItems[2];
        values.dockerNameAsim = values.dockerNameAsim || values.dockerNameIpc;
        values.dockerVersion = dockerItems[0];
        let {url, data, method} = API.createWorkspace;
        if (!this.state.nasaTrue) {
          values.nasaDevice = '';
          values.nasaEnv = '';
        }
        Object.assign(data, {caseId, mapId, name, algoVersion}, values);
        utils.getData(url, data, (res) => {
          if (this.configVisible) {
            this.play();
          }
          this.setState({
            configVisible: false,
            asimDockerNameValue: values.dockerNameAsim,
            runType: values.runType,
            dockerNameIpc: values.dockerNameIpc,
            dockerNamePar: values.dockerNamePar,
            nasaEnv: values.nasaEnv,
            nasaDevice: values.nasaDevice
          });
        }, () => {
        }, method)
      }
    });
  }

  submitMapData() {
    const {caseId, name, mapVersion} = window.globalState.schema;
    let mapId = mapVersion;
    
  }

  config() {
    this.setState({
      configVisible: true
    });
    this.getRunTypes();
    this.getNasaDevice();
  }

  changeType(c) {
    const type = c ? 'translate' : 'rotate';
    const {thingControl, targetPointContorl} = window.globalState.controls;
    thingControl.setMode(type);
    targetPointContorl.setMode(type);
    this.setState({
      transformControlMode: type
    });
  }

  // changeLocal(c) {
  //   const type = !c ? 'world' : 'local';
  //   window.globalState.controls.thingControl.setSpace(type);
  // }

  setMapConfigVisible() {
    this.setState({
      mapVisible: true
    });
  }

  getDockerNameIpcSource() {
    const {url, data} = API.getDocker;
    utils.getData(url, data, (res) => {
      const list = [];
      res.map((item) => {
        const obj = {};
        obj['version'] = item.version;
        item.agBuildList.map(one => {
          obj[one.platform] = one.buildDockerVersion;
        });
        list.push(obj);
      });
      let dockersDefaultValue = ''
      const dockers = list.map((item, index) => {
        let value = item.version + '|-|' + item['x86'] +
          '|-|' + item['arm'] + '|-|' + index
        if (item.version === this.state.dockerVersion) {
          dockersDefaultValue = value
        }
        return {
          label: item.version,
          value
        };
      }) || [];
      dockers.unshift({label: '自定义镜像', value: '0'});
      this.setState({
        dockers,
        dockersDefaultValue: dockersDefaultValue || '0',
        showDefineDocker: !dockersDefaultValue
      });
    });
  }

  selectDockerChange(e) {
    this.setState({
      showDefineDocker: e === '0',
      dockersDefaultValue: e,
      dockerNameIpc:''
    });
  }

  getMapScenes(id) {
    let {url, data} = API.getMapScene;
    utils.getData(url, data, (res) => {
      const list = res.map(item => {
        return {label: item.mapName, value: item.id};
      });
      list.push({label: '指定地图版本', value: '0'});
      this.setState({
        mapScenes: list
      });
    })
  }

  render() {
    return (
      <div className="centerbar">
        <div className="centerbar-buttons">
          <Menu direction="hoz" activeDirection="right" type="primary">
            <Item key="0" onClick={this.setMapConfigVisible.bind(this)}><i
              className="et-icon icon-map"/><span>地图</span></Item>
            <Item key="1" onClick={Centerbar.delete.bind(this)}><i
              className="next-icon next-icon-ashbin "/><span>删除</span></Item>
            <Item key="2" onClick={this.save.bind(this)}><i className="et-icon icon-iconset0237"/>
              <span>保存</span></Item>
            <SubMenu key="5" icon="et-icon" label="运行">
                <Menu.Item key="51" onClick={this.play.bind(this)}>天眼播放</Menu.Item>
                <Menu.Item key="53" onClick={this.config.bind(this)}>配置</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="case-name">{window.globalState.schema && window.globalState.schema.name}</div>
        <Switch className="switch-control" defaultChecked={true} checkedChildren="位移" onChange={(c) => {
          this.changeType(c);
        }} unCheckedChildren="旋转"/>
        <Modal
          title="播放配置"
          style={{width: '400px'}}
          visible={this.state.configVisible}
          onOk={v => {
            this.submitConfigData();
          }}
          onCancel={v => {
            this.setState({configVisible: false});
          }}
          onClose={v => {
            this.setState({configVisible: false});
          }}>
          <Form labelCol={{span: 6}} wrapperCol={{fixedSpan: 10}} >
            <FormItem
              label="运行类型"
              required={true}
              requiredMessage={'请选择运行类型'}>
              <Select
                style={{width: '210px'}}
                defaultValue={this.state.runType}
                onChange={this.runTypesChange.bind(this)}
                dataSource={this.state.runTypes} name="runType"
              />
            </FormItem>
            <FormItem
              label="镜像选择"
              required={true}
              requiredMessage={'请选择镜像选择'}>
              <Select
                style={{width: '210px'}}
                defaultValue={this.state.dockersDefaultValue}
                onChange={this.selectDockerChange.bind(this)}
                dataSource={this.state.dockers} name="dockers"
              />
              <a style={{marginTop: 10, display: 'block'}}
                 href={HELP_URL}
                 target={'_blank'}>我要构建docker</a>
            </FormItem>
            {
              this.state.showDefineDocker &&
              <FormItem
                label="仿真镜像:"
                required={true}
                requiredMessage={'仿真镜像不能为空'}>
                <Input
                  style={{width: '200px'}}
                  defaultValue={this.state.dockerNameIpc}
                  name="dockerNameIpc"/>
              </FormItem>
            }
            {
              this.state.showDefineDocker && this.state.nasaTrue &&
              <FormItem
                label="平行驾驶镜像"
                required={true}
                requiredMessage={'请选择平行驾驶镜像'}>
                <Input
                  style={{width: '210px'}}
                  defaultValue={this.state.dockerNamePar}
                  name="dockerNamePar"
                />
              </FormItem>
            }
            {
              this.state.nasaTrue && <FormItem
                label="车辆列表"
                required={true}
                requiredMessage={'请选择车辆列表'}>
                <Select
                  style={{width: '210px'}}
                  defaultValue={this.state.nasaDevice}
                  dataSource={this.state.nasaDevices} name="nasaDevice"
                />
              </FormItem>
            }
            {
              this.state.nasaTrue && <Form.Item
                label="NASA环境" required={true}
                requiredMessage="NASA环境为必选项">
                <Select
                  style={{width: '210px'}}
                  defaultValue={this.state.nasaEnv}
                  name="nasaEnv" dataSource={[
                  {label: 'daily', value: 'daily'},
                  {label: 'pre', value: 'pre'},
                  {label: 'online', value: 'online'}
                ]}/>
              </Form.Item>
            }
          </Form>
        </Modal>
        <Modal
          title="地图配置"
          style={{width: '400px'}}
          visible={this.state.mapVisible}
          onOk={v => {
            this.submitMapData();
          }}
          onCancel={v => {
            this.setState({mapVisible: false});
          }}
          onClose={v => {
            this.setState({mapVisible: false});
          }}>
          <Form labelCol={{span: 6}} wrapperCol={{fixedSpan: 10}} field={this.fieldMap}>
            <FormItem label="地图名称:" required={true} requiredMessage={'地图名称'}>
              <Select name="mapScene" defaultValue={this.state.mapSceneValue} onChange={e => {
                this.setState({mapSceneValue: e});
              }} dataSource={this.state.mapScenes} style={{width: '200px'}} autoWidth={true}/>
            </FormItem>
            {this.state.mapSceneValue === '0' ?
              <FormItem label="地图版本:" required={true} requiredMessage={'地图版本为必填项'}>
                <Input style={{width: '200px'}} defaultValue={this.state.mapId} name="mapId"/>
              </FormItem> : ''
            }
          </Form>
        </Modal>
        <Modal
          title="提示"
          style={{width: 400}}
          visible={this.state.errorVisible}
          footer={<Button type="primary" onClick={() => {
            this.setState({errorVisible: false})
          }}>我知道了</Button>}
          onClose={() => {
            this.setState({errorVisible: false})
          }}>
          {this.state.errorMessage}
        </Modal>
      </div>
    );
  }
}
