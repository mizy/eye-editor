const THREE = window.THREE;
export default class History extends THREE.EventDispatcher {
  constructor(watchMap) {
    super(watchMap);
    this.agents = {};
    this.goals = {};
    this.roles = {};
    this.movements = {};
    this.apperances = {};
    this.points = [];
  }

  //添加物体
  addObject(data) {
    window.globalState.schema.objects[data.name] = data;
  }

  //删除物体
  removeObject(name) {
    delete window.globalState.schema.objects[name];
  }

  modifyObject(data) {
    window.globalState.schema.objects[data.name] = data;
  }

  modifyTrigger(data) {
    window.globalState.schema.triggers[data.name] = data;
  }

  removeTrigger(data) {
    delete window.globalState.schema.triggers[data.name];
  }

  modifyAgentSource(data) {
    if (!window.globalState.schema.agentSources)window.globalState.schema.agentSources = {};
    for (const x in window.globalState.schema.agentSources) {
      if (window.globalState.schema.agentSources[x].name === data.name) {
        window.globalState.schema.agentSources[x] = data;
      }
    }
  }

  removeAgentSource(data) {
    window.globalState.schema.agentSources = 
       window.globalState.schema.agentSources.filter(item => item.name !== data.name);
  }

}