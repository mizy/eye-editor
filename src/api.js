export default {
  read: {
    url: '/api/workspace/read',
    data: {}
  },
  addCase: {
    url: '/api/case/add',
    data: {},
    method: 'PUT'
  },
  play: {
    url: '/api/workspace/play',
    data: {}
  },
  getRootList: {
    url: '/api/task/root/list',
    data: {}
  },
  getDocker: {
    url: '/api/project/getDocker',
    data: {
      pageSize: 1000,
      currentPage: 1
    }
  },
  createWorkspace: {
    url: '/api/workspace/create',
    data: {},
    method: 'PUT'
  },
  getNasaDevice: {
    url: '/api/task/getNasaDevice',
    data: {}
  },
  getNewRunType: {
    url: '/api/job/getNewRunType',
    data: {}
  },
  getMapScene: {
    url: '/api/case/mapscene',
    data: {pageSize: 1000, currentPage: 1}
  }
}
