module.exports = {
  'VEHICLE': [{
    category: 'VEHICLE',
    'img': '//img.alicdn.com/tfs/TB12d1TGHGYBuNjy0FoXXciBFXa-854-423.png',
    'name': 'car', 'movement': { defaultSpeeds: [11.11, 22.22, 33.33], 'name': 'ccar_movement', 'max_speed': 10, 'max_acceleration': 5, 'max_turn': 2 }, 'appearance': { 'name': 'car_app', 'type': 'cube', 'length': 3.98, 'width': 1.6, 'height': 1.44, 'color': [1, 0, 0, 1]}
  }, {
    category: 'VEHICLE',
    'img': '//gw.alicdn.com/tfs/TB1SkUEIxSYBuNjSsphXXbGvVXa-325-177.png',
    'name': 'suv', 'movement': { defaultSpeeds: [11.11, 22.22, 33.33], 'name': '1ccar_movement', 'max_speed': 12, 'max_acceleration': 6.7, 'max_turn': 2 }, 'appearance': { 'name': 'ccar_app', 'type': 'cube', 'length': 4.62, 'width': 1.88, 'height': 1.63, 'color': [1, 0, 0, 1]}
  }, {
    category: 'VEHICLE',
    'img': '//gw.alicdn.com/tfs/TB1o3.ob7voK1RjSZFNXXcxMVXa-1200-800.jpg',
    'name': 'truck', 'movement': { defaultSpeeds: [11.11, 22.22, 33.33], 'name': '1ccar_movement', 'max_speed': 12, 'max_acceleration': 6.7, 'max_turn': 2 }, 'appearance': { 'name': 'ccar_app', 'type': 'cube', 'length': 6.92, 'width': 2.5, 'height': 3.77, 'color': [1, 0, 0, 1]}
  }],
  'BICYCLE': [{
    category: 'BICYCLE',
    'img': '//gw.alicdn.com/tfs/TB1xlFMIKuSBuNjy1XcXXcYjFXa-307-181.png',
    'name': 'motor', 'movement': {
      defaultSpeeds: [5.5, 8.3, 11.1], 'name': 'mcar_movement', 'max_speed': 8, 'max_acceleration': 2.6, 'max_turn': 2 }, 'appearance': { 'name': 'mcar_app', 'type': 'cube', 'length': 1.8, 'width': 0.7, 'height': 1.63, 'color': [1, 0, 0, 1]}
  }, {
    category: 'BICYCLE',
    'img': '//gw.alicdn.com/tfs/TB1st2dINGYBuNjy0FnXXX5lpXa-268-171.png',
    'name': 'bicycle', 'movement': {
      defaultSpeeds: [2.7, 4, 5.5],
      'name': 'cm1ar_movement', 'max_speed': 3, 'max_acceleration': 1.5, 'max_turn': 2 }, 'appearance': { 'name': 'm1car_app', 'type': 'cube', 'length': 1.5, 'width': 0.7, 'height': 1.5, 'color': [1, 0, 0, 1]}
  }],
  'PEDESTRIAN': [{
    category: 'PEDESTRIAN',
    'img': '//gw.alicdn.com/tfs/TB1c3nIby6guuRjy1XdXXaAwpXa-303-180.png',
    'name': 'man', 'movement': { defaultSpeeds: [0.1, 0.5, 1], 'name': 'man1', 'max_speed': 1.1, 'max_acceleration': 1, 'max_turn': 3 }, 'appearance': { 'name': 'man11', 'type': 'cube', 'length': 0.4, 'width': 0.4, 'height': 1.7, 'color': [1, 0, 0, 1]}
  }, {
    category: 'PEDESTRIAN',
    'img': '//gw.alicdn.com/tfs/TB1RlxSIH5YBuNjSspoXXbeNFXa-296-171.png',
    'name': 'kid', 'movement': { defaultSpeeds: [0.5, 1, 3], 'name': 'boy1', 'max_speed': 0.2, 'max_acceleration': 0.6, 'max_turn': 3 }, 'appearance': { 'name': 'boy11', 'type': 'cube', 'length': 0.2, 'width': 0.2, 'height': 1, 'color': [1, 0, 0, 1]}
  }],
  'other': [{
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'agent', 'movement': { 'name': 'fff', 'max_speed': 1.1, 'max_acceleration': 1, 'max_turn': 3 }, 'appearance': { 'name': 'fff', 'type': 'cube', 'length': 1.4, 'width': 1.4, 'height': 1.7, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Vegetation_Tree', 'model': 'Vegetation_Tree', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'length': 1.5, 'width': 1.5, 'height': 5, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Vegetation_Bush', 'model': 'Vegetation_Bush', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'length': 1, 'width': 1, 'height': 0.5, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Vegetation_Grass', 'model': 'Vegetation_Grass', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'length': 1, 'width': 1, 'height': 0.5, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Pedestrian_Male', 'model': 'Pedestrian_Male', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.9, 'length': 0.5, 'height': 1.8, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Pedestrian_Child', 'model': 'Pedestrian_Child', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.9, 'length': 0.5, 'height': 1.2, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Pedestrian_Female', 'model': 'Pedestrian_Female', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.9, 'length': 0.5, 'height': 1.8, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Pedestrian_Old', 'model': 'Pedestrian_Old', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.9, 'length': 0.5, 'height': 1.8, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Bicycle_Bicycle', 'model': 'Bicycle_Bicycle', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.9, 'length': 1.8, 'height': 1.8, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Bicycle_Motor', 'model': 'Bicycle_Motor', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1, 'length': 2, 'height': 2, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Bicycle_Electric', 'model': 'Bicycle_Electric', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1, 'length': 2, 'height': 2, 'color': [1, 0, 0, 1]}
  },
  {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Bicycle_Tricycle', 'model': 'Bicycle_Tricycle', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1.2, 'length': 2.5, 'height': 2, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Vehicle_Car', 'model': 'Vehicle_Car', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 2, 'length': 4.2, 'height': 1.4, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Vehicle_SUV', 'model': 'Vehicle_SUV', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 2, 'length': 4.5, 'height': 1.5, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Vehicle_Truck', 'model': 'Vehicle_Truck', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 2.6, 'length': 5.2, 'height': 2.5, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Vehicle_Bus', 'model': 'Vehicle_Bus', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 2.1, 'length': 4.5, 'height': 2.05, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_BusStop', 'model': 'Prop_BusStop', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 3.4, 'length': 1.54, 'height': 2.76, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Fence', 'model': 'Prop_Fence', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1.4, 'length': 0.1, 'height': 1, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Pole', 'model': 'Prop_Pole', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.3, 'length': 0.3, 'height': 3.5, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Billboard', 'model': 'Prop_Billboard', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1.1, 'length': 0.1, 'height': 2.2, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_PlantPot', 'model': 'Prop_PlantPot', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.5, 'length': 0.5, 'height': 0.5, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Bin', 'model': 'Prop_Bin', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.55, 'length': 0.65, 'height': 1.05, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Counter', 'model': 'Prop_Counter', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.6, 'length': 0.35, 'height': 1.25, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_DirtDebris', 'model': 'Prop_DirtDebris', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1.8, 'length': 1.5, 'height': 0.15, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_FireHydrant', 'model': 'Prop_FireHydrant', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.5, 'length': 0.4, 'height': 0.8, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Bench', 'model': 'Prop_Bench', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1.5, 'length': 0.5, 'height': 0.5, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_BarrierCone', 'model': 'Prop_BarrierCone', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.35, 'length': 0.35, 'height': 0.6, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_BarrierCylinder', 'model': 'Prop_BarrierCylinder', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 0.25, 'length': 0.25, 'height': 0.9, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Barricade', 'model': 'Prop_Barricade', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1.21, 'length': 0.37, 'height': 1.07, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Cube', 'model': 'Prop_Cube', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1, 'length': 1, 'height': 1, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Cone', 'model': 'Prop_Cone', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1, 'length': 1, 'height': 1, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Cylinder', 'model': 'Prop_Cylinder', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1, 'length': 1, 'height': 1, 'color': [1, 0, 0, 1]}
  }, {
    category: 'UNKNOW',
    'img': '//gw.alicdn.com/tfs/TB1kUUpvAZmBKNjSZPiXXXFNVXa-612-447.png',
    'name': 'Prop_Sphere', 'model': 'Prop_Sphere', 'movement': { }, 'appearance': { 'name': 'fff', 'type': 'cube', 'width': 1, 'length': 1, 'height': 1, 'color': [1, 0, 0, 1]}
  }]
};