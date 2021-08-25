export default {
  state: {
    goal: {},
    movement: {},
    role: {},
    agent: {}
  },

  /******************  
 *  构造yaml要求的json结构
 * ******************************************************** */
  convert2yaml() {
    const objects = JSON.parse(JSON.stringify(window.globalState.schema.objects));
    const triggers = JSON.parse(JSON.stringify(window.globalState.schema.triggers));
    this.yaml = [];
    for (const x in objects) {
      let agent = objects[x];
      agent = this.makeYamlAgent(agent);
      this.yaml.push({ agent });
    }
    for (const x in triggers) {
      const trigger = this.makeYamlTrigger(triggers[x]);
      this.yaml.push({ trigger });
    }
    this.convertYamlAgentSource();
    return this.yaml;
  },

  //交通流编码
  convertYamlAgentSource() {
    const agentSources = JSON.parse(JSON.stringify(window.globalState.schema.agentSources || {}));
    for (const x in agentSources) {
      const agentSource = this.makeYamlAgentSource(agentSources[x]);
      this.yaml.push({ agentSource });
    }
  },

  makeYamlAgentSource(agentSource) {
    const initareas = [], goalareas = [];
    agentSource.initareas.map(item => {
      initareas.push(item.name);
      this.makeYamlTraffic(item);
    });
    agentSource.goalareas.map(item => {
      goalareas.push(item.name);
      this.makeYamlTraffic(item);
    });
    agentSource.initareas = initareas;
    agentSource.goalareas = goalareas;
    return agentSource;
  },

  makeYamlTraffic(traffic) {
    const points = [];
    traffic.points.map(point => {
      points.push(this.transformPosToLoc(point));
    });
    traffic.points = points;
    this.yaml.push({ traffic });
  },

  makeYamlTrigger(trigger) {
    const points = [];
    trigger.points.map(item => {
      points.push(this.transformPosToLoc(item));
    });
    trigger.points = points;
    return trigger;
  },

  makeYamlAgent(agent) {
    if (agent.startPointType === 'single') {
      agent.initlocation = this.transformPosToLoc(agent.initlocation[0]);
    } else if (agent.startPointType === 'area') { 
      agent.initlocation = {
        min: this.transformPosToLoc(agent.initlocation[0]),
        max: this.transformPosToLoc(agent.initlocation[1])
      };
    } else {
      agent.initlocation.map(item => this.transformPosToLoc(item));
    }
    const role = agent.role;
    const goal = agent.goal;
    goal.name = 'goal_' + new Date().getTime() * Math.random();
    agent.role = role.name;
    agent.goal = goal.name;
    agent.numbers = parseInt(agent.numbers || 1);
    if (isNaN(agent.numbers))agent.numbers = 1;
    this.makeYamlRole(role);
    this.makeYamlGoal(goal);
    delete agent.scaleToLatitude;
    delete agent.startPointType;//删除冗余数据
    return agent;
  },

  makeYamlRole(role) {
    if (role.name === 'gplus') return;
    const appearance = role.appearance;
    const movement = role.movement;
    role.appearance = role.appearance.name;
    role.movement = role.movement.name;
    role.category = role.category || 'UNKNOWN';
    if (!role.offset)role.offset = 0;
    if (typeof(role.offset.min) !== 'undefined') {
      role.offset = {
        min: parseFloat(role.offset.min),
        max: parseFloat(role.offset.max)
      };
    } else if (Array.isArray(role.offset)) {
      const speeds = [];
      for (const x in role.offset) {
        speeds.push(parseFloat(role.offset[x]));
      }
      role.offset = speeds;
    } else {
      role.offset = parseFloat(role.offset || 0);
    }
    this.makeYamlAppearance(appearance);
    this.makeYamlMovement(movement);
    this.yaml.push({ movement });
    this.yaml.push({ appearance });
    this.yaml.push({ role: role });
  },

  makeYamlAppearance(appearance) {
    appearance.length = parseFloat(appearance.length);
    appearance.width = parseFloat(appearance.width);
    appearance.height = parseFloat(appearance.height);
  },

  makeYamlMovement(movement) {
    if (typeof(movement.max_speed.min) !== 'undefined') {
      movement.max_speed = {
        min: parseFloat(movement.max_speed.min),
        max: parseFloat(movement.max_speed.max)
      };
    } else if (Array.isArray(movement.max_speed)) {
      const speeds = [];
      for (const x in movement.max_speed) {
        speeds.push(parseFloat(movement.max_speed[x]));
      }
      movement.max_speed = speeds;
    } else {
      movement.max_speed = parseFloat(movement.max_speed || 0);
    }
       
    movement.max_acceleration = parseFloat(movement.max_acceleration);
    movement.max_turn = parseFloat(movement.max_turn);
  },

  makeYamlGoal(goal) {
    if (goal.speed) {
      goal.speed = this.makeYamlSpeed(goal.speed);
    }
    if (goal.script) {
      const script = [];
      for (const x in goal.script) {
        if (!goal.script[x]) continue;
        if (goal.script[x].waittime) {
          script.push(this.makeWaitTime(goal.script[x]));
        }
        goal.script[x].name = 'goal_' + new Date().getTime() + Math.random();
        const name = this.makeYamlGoal(goal.script[x]);
        if (name)
          script.push(name);
      }
      goal.script = script;
      this.yaml.push({ goal });
      return goal.name;
    } else if (goal.type === 'area') {
      goal.location = { min: this.transformPosToLoc(goal.location[0]), max: this.transformPosToLoc(goal.location[1]) };
      this.yaml.push({ goal });
      return goal.name;
    } else if (goal.type === 'multi') {
      const locations = [];
      goal.location.map(item => {
        locations.push(this.transformPosToLoc(item));
      });
      goal.location = locations;
      this.yaml.push({ goal });
      return goal.name;
    } else if (goal.type === 'single') {
      goal.location = this.transformPosToLoc(goal.location[0]);
      this.yaml.push({ goal });
      return goal.name;
    }
  },

  makeYamlSpeed(speed) {
    if (speed.min) {
      speed.min = parseFloat(speed.min);
      speed.max = parseFloat(speed.max);
    } else if (Array.isArray(speed)) {
      const speeds = [];
      speed.map(item => {speeds.push(parseFloat(item))});
      return speeds;
    } else {
      speed = parseFloat(speed);
    }
    return speed;
  },

  transformPosToLoc(location) {
    return [
      location.x - window.ETOFFSET.x,
      location.y - window.ETOFFSET.y,
      location.z
    ];
  },

  makeWaitTime(goal) {
    if (goal.waittime !== 0) {
      const goal = {
        name: ('waittime_' + (new Date().getTime()) + --window.globalState.index),
        waittime: goal.waittime
      };
      this.yaml.push({ goal });
      return goal.name;
    }
  },

  /** *******************************
 * yaml 2 schema
 * .................................... ----------------------------*/
    
    
  convert(yaml) {
    if (!yaml) return false;
    const data = {};
    yaml.map(item => {
      for (const x in item) {
        if (!data[x])data[x] = {};
        data[x][item[x].name] = item[x];
      }
    });
    this.state = Object.assign({}, data);
    this.state = data;
    const agent = this.formatAgent();
    this.state.objects = agent;
    this.state.triggers = this.formatTrigger();
    this.state.agentSources = this.formatAgentSources();
    return { objects: this.state.objects, triggers: this.state.triggers, agentSources: this.state.agentSources };
  },

  /**
     * 交通流数据重建
     */
  formatAgentSources() {
    const agentSources = this.state.agentSource;
    for (const x in agentSources) {
      agentSources[x].initareas = this.formatTraffic(agentSources[x].initareas);
      agentSources[x].goalareas = this.formatTraffic(agentSources[x].goalareas);
    }
    return agentSources;
  },

  formatTraffic(areas) {
    const traffics = this.state.traffic;
    const res = [];
    areas.map(item => {
      const traffic = traffics[item];
      const points = [];
      traffic.points.map(point => {
        points.push(this.localToWorld(point));
      });
      traffic.points = points;
      res.push(traffic);
    }); 
    return res;
  },

  /**
     * 变成树状结构
     */
  formatAgent() {
    const agent = this.state.agent || {};
    for (const x in agent) {
      const role = this.makeRole(agent[x]);
      const goal = this.makeGoal(agent[x]);
      this.parseAgent(agent[x]);
      agent[x].role = role;
      agent[x].goal = goal;
    }
    return agent;
  },

  //兼
  formatTrigger() {
    const triggers = {};
    const trigger = this.state.trigger;
    if (!trigger) return triggers;
    for (const x in trigger) {
      const trigger0 = trigger[x];
      const points = trigger0.points;
      const locations = [];
      points.map(item => {
        locations.push(this.localToWorld(item));
      });
      trigger0.points = locations;
      triggers[trigger0.name] = (trigger0);
    }
    return triggers;
  },


  /**
     * 解析起始位置
     */
  parseAgent(agent) {
    if (typeof agent.initlocation[0] === 'number') {
      agent.startPointType = 'single';
      agent.initlocation = [this.localToWorld(agent.initlocation)];
    } else if (agent.initlocation.min) {
      agent.startPointType = 'area';
      agent.initlocation = [this.localToWorld(agent.initlocation.min), this.localToWorld(agent.initlocation.max)];
    } else if (agent.initlocation[0].length) {
      agent.startPointType = 'multi';
      agent.initlocation.map(item => this.localToWorld(item) );
    }
  },

  /**
     * 本地坐标转世界坐标
     */
  localToWorld(location) {
    return {
      x: parseFloat(location[0]) + window.ETOFFSET.x,
      y: parseFloat(location[1]) + window.ETOFFSET.y,
      z: parseFloat(location[2])
    };
  },

  /**
     * 构造role的tree
     */
  makeRole(agent) {
    if (agent.role === 'gplus') return { name: 'gplus', movement: {}};
    const role = this.state.role[agent.role];
    //gplus优化
    // if(!role)console.log('没有对应的role!'+agent.role)
    if (role.movement.name) return role;//已经格式化过该role
    const appearance = this.state.appearance[role.appearance];
    const movement = this.state.movement[role.movement];
    role.movement = movement;
    role.appearance = appearance;
    if (!role.offset)//兼容
      role.offset = 0;
    return role;
  },

  /**
     * 构造goal的tree
     */
  makeGoal(agent) {
    this.formatGoal(this.state.goal[agent.goal]);
    if (this.state.goal[agent.goal].type !== 'path') {//不是多点路径的情况下，稳定数据格式为带script的
      const goal = {
        name: 'goal_' + new Date().getTime() * Math.random(),
        script: [this.state.goal[agent.goal]],
        type: 'path'
      };
      this.state.goal[agent.goal] = goal;
    }
    return this.state.goal[agent.goal];
  },

  /**
     * 递归查询goal
     */
  formatGoal(goal) {
    if (goal.script) {//多点
      goal.type = 'path';
      this.formatPath(goal);
    } else if (goal.location.min) {//区域
      goal.type = 'area';
      goal.location = [
        this.localToWorld(goal.location.min),
        this.localToWorld(goal.location.max),
      ];
      return goal;
    } else if (Array.isArray(goal.location[0])) {//位置
      goal.type = 'multi';
      const locations = [];
      goal.location.map(item => {
        locations.push(this.localToWorld(item));
      });
      goal.location = locations;
      return goal;
    } else if (!goal.location[0][0]) {//单点
      goal.type = 'single';
      goal.location = [this.localToWorld(goal.location)];
      return goal;
    }
  },

  //重构路径点的每个点结构
  formatPath(goals) {
    const script = [];
    for (const x in goals.script) {
      const goalName = goals.script[x];
      if (this.state.goal[goalName]) {
        //子goal
        const goal = this.formatGoal(this.state.goal[goalName]);
        goal.goalIndex = x;
        script.push(goal);
      }
    }
    goals.script = script;
  }
};