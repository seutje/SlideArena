var TWEEN = require('./tween');
window.TWEEN = TWEEN;

module.exports = Slides;

function Slides(game, options) {
  if (!options) options = {};
  if (!(this instanceof Slides)) return new Slides(game, options);

  this.CENTER = { x: 0.5, y: 8, z: 0 };
  this.OFFSET = { x: 0.5, y: -5, z: 0 };
  this.SWITCHING = false;
  this.current = 0;

  this.game = game;
  this.group = new game.THREE.Object3D();
  this.group.position.set(0, 0, 0);

  this.game.scene.add(this.group);
  this.createSliderExtras();
  this.load();
  this.render();

}

Slides.prototype.load = function (data) {
  data = [
    { src: '/slides/voxeljs-jquery.001.png' },
    { src: '/slides/voxeljs-jquery.002.png' },
    { src: '/slides/voxeljs-jquery.003.png' },
    { src: '/slides/voxeljs-jquery.004.png' },
    { src: '/slides/voxeljs-jquery.005.png' },
    { src: '/slides/voxeljs-jquery.006.png' },
    { src: '/slides/voxeljs-jquery.007.png' },
    { src: '/slides/voxeljs-jquery.008.png' },
    { src: '/slides/voxeljs-jquery.009.png' },
    { src: '/slides/voxeljs-jquery.010.png' }

  ];

  this.slideData = data;
};


Slides.prototype.render = function () {
  var self = this;

  this.slides = [];

  this.slideData.forEach(function (slide, i) {
    var image = new Image();

    image.addEventListener('load', function () {
      var texture = new self.game.THREE.Texture(image);
      texture.needsUpdate = true;
      var geometry = new self.game.THREE.CubeGeometry(16, 12, 0.01);
      var mesh = new self.game.THREE.Mesh(geometry, new self.game.THREE.MeshBasicMaterial({ map: texture }));

      mesh.rotation.y = Math.PI;
      mesh.position.x = self.OFFSET.x;
      mesh.position.y = self.OFFSET.y;

      self.slides.push(mesh);
      self.group.add(mesh);

      if (i === 0) {
        self.setCurrent(self.current);
      }
    });

    image.src = slide.src;
  });
};

Slides.prototype.setCurrent = function (idx) {
  var self = this;
  var c = this.CENTER;
  var o = this.OFFSET;

  if (idx >= 0 && idx < this.slides.length && !this.SWITCHING) {
    var oldSlide = this.slides[this.current];

    this.SWITCHING = true;
    this.current = idx;

    var newSlide = this.slides[idx];

    var exit = new TWEEN.Tween(oldSlide.position)
      .to(this.OFFSET, 800)
      .easing(TWEEN.Easing.Back.Out)
      .start();

    var enter = new TWEEN.Tween(newSlide.position)
      .to(this.CENTER, 500)
      .easing(TWEEN.Easing.Quadratic.Out);

    exit.onComplete(function () {
      enter.start();
    });

    enter.onComplete(function () {
      self.SWITCHING = false;
    });


    window.slide = newSlide;
    //slide.position.set(c.x, c.y, c.z);
  }
};

Slides.prototype.next = function () {
  this.setCurrent(this.current + 1);
};

Slides.prototype.prev = function () {
  this.setCurrent(this.current - 1);
};

Slides.prototype.createSliderExtras = function () {
  var sPos = { x: 0, y: 0, z: 0 };

  var glassMaterial = new this.game.THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  var geometry = new this.game.THREE.CubeGeometry(20, 5, 0.5);
  var slider = new this.game.THREE.Mesh(geometry, glassMaterial);
  this.game.scene.add(slider);
};