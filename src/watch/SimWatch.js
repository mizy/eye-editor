import body from './body.js';
class SimView {
  constructor() {
    this.initBody();
    this.initParams();
    this.listenEvents();
  }

  initBody() {
    document.querySelector('#view').innerHTML = body;
  }

  initParams() {
    this.ip = this.getParams('ip').split(',');
    this.port = this.getParams('port').split(',');
    this.token = this.getParams('token');
    this.utmdId = this.getParams('utmdId');
    this.offset = {
      x: this.getParams('x'),
      y: this.getParams('y'),
      z: this.getParams('z'),
    };
    this.ip.map((ip, index) => {
      this.initIframes(ip, this.port[index]);
    });
  }

  listenEvents() {
    let frame;
    const items = document.querySelectorAll('.full-screen');
    for (const x in items) {
      const dom = items[x];
      dom.addEventListener('click', e => {
        const parent = e.target.parentNode;
        if (parent.className === 'iframe-item') {
          parent.setAttribute('class', 'iframe-item active');
          frame = parent.querySelector('iframe');
          frame.contentWindow.addWatchMap.resize();
        } else {
          parent.setAttribute('class', 'iframe-item');
          frame.contentWindow.addWatchMap.resize();
        }
      });
    }
  }

  getParams(key) {
    const paras = location.search;
    let data;
    if (paras) {
      const arr = paras.substr(1).split('&');
      for (const i in arr) {
        data = arr[i].split('=');
        if (data[0] === key) {
          return data[1];
        }
      }
    }
  }

  initIframes(ip, port) {
    const container = document.getElementById('view_container');
    const src = `/manage/skyeye/skip?ip=${ip}&port=${port}&token=${this.token}&x=${this.offset.x}&y=${this.offset.y}&z=${this.offset.z}&utmdId=${this.utmdId}`;
    const iframe = `<div class="iframe-item"><iframe height=${window.innerHeight - 80} width=${window.innerWidth} class='view-fram' src=${src}></iframe><div class="full-screen">全屏</div></div>`;
    const div = document.createElement('div');
    div.innerHTML = iframe;
    container.appendChild(div.childNodes[0]);
  }

}
new SimView();

export default SimView;
