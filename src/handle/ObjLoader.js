const THREE = window.THREE;
export default class ObjLoader {
  loadXG(callback) {
    return new Promise((resolve) => {
      const mtlLoader = new THREE.MTLLoader();
      mtlLoader.setCrossOrigin(true);
      mtlLoader.setPath('//et-asim-platform.oss-cn-shanghai.aliyuncs.com/studio-car-models/models/');
      mtlLoader.load('yunm.mtl', function( materials ) {
        const objLoader = new THREE.OBJLoader();//加载模型
        // objLoader.setCrossOrigin(true);
        objLoader.setMaterials( materials );
        objLoader.load('//et-asim-platform.oss-cn-shanghai.aliyuncs.com/studio-car-models/models/yunm.obj', function(mesh) {
          window.mesh = mesh;
          mesh.children[0].position.x = - 63;
          mesh.children[0].position.z = 46.8;
          mesh.children[0].position.y = -0.35;
          mesh.scale.addScalar(0.5);
          mesh.rotation.x = Math.PI / 2;
          if (!window.globalState.models)window.globalState.models = {};
          window.globalState.models['xg'] = mesh;
          resolve(mesh);
        });
      });
    });
  }
}