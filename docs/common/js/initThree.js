
function InitThree( container ) {

    this.container = container;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer( {
        antialias:true
    } );

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x111111, 1.0);
    this.container.appendChild( this.renderer.domElement );

    this.run = false;

    this.initCamera();
    this.initThreeOR();
    this.initCameraOR();

    this.renderCallback = () => {};

}

InitThree.prototype.initCamera = function() {
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); //平行投影カメラ
    // this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 10);

    // this.camera.position.set( 0, 0, 3 );
    // this.camera.up.set( 0, 0.0, 0 );
    // this.camera.lookAt({ x:0, y:1, z:0 });

}

InitThree.prototype.initThreeOR = function() {
    this.sceneOR = new THREE.Scene();
    this.rendererOR = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
}
InitThree.prototype.initCameraOR = function() {
    this.cameraOR = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    // this.cameraOR.position.set(0, 0, 100);
}

InitThree.prototype.onMouseMove = function(e,callback) {

    let x = e.clientX / window.innerWidth * 2.0 - 1.0;
    let y = e.clientY / window.innerHeight * 2.0 - 1.0;

    if(callback) callback( { x: x, y: -y } );

}

InitThree.prototype.onWindowResize = function(callback) {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    if(callback) callback();

}

InitThree.prototype.renderStart = function() {

    this.renderer.render(
        three.sceneOR,
        three.cameraOR,
        three.rendererOR
    );

    this.renderer.render(
        three.scene,
        three.camera
    );

    this.renderCallback();

}
InitThree.prototype.renderLoop = function() {
    this.renderStart();
    if( this.run ) requestAnimationFrame( this.renderLoop.bind(this) );
}
