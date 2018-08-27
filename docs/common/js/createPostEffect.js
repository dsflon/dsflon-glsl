/**
 * XHR でシェーダのソースコードを外部ファイルから取得しコールバックを呼ぶ。
 * @param {string} vertexShader - 頂点シェーダのソースコード
 * @param {string} fragmentShader - フラグメントシェーダのソースコード
 */
function CreatePostEffect(texture,vertexShader,fragmentShader,uniforms) {

    this.uniforms = {
        time: {
            type: 'f',
            value: 0
        },
        mouse: {
            type: 'v2',
            value: new THREE.Vector2(0.0, 0.0),
        },
        resolution: {
            type: 'v2',
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        texture: {
            type: 't',
            value: texture,
        }
    };

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    this.obj = this.createObj();

}

CreatePostEffect.prototype.reset = function(vertexShader,fragmentShader) {

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.obj = this.createObj();

}

CreatePostEffect.prototype.createObj = function() {

    return new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2, 2),
        new THREE.RawShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        })
    );

}

CreatePostEffect.prototype.mouseMove = function(mouse) {
    this.uniforms.mouse.value.set(mouse.x,mouse.y);
}

CreatePostEffect.prototype.resize = function() {
    this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
}

CreatePostEffect.prototype.timer = function(time) {
    this.uniforms.time.value = time;
}

CreatePostEffect.prototype.addUniform = function(obj) {

    for (let prop in obj) {
        this.uniforms[prop] = obj[prop];
    }

}
CreateSceneImage.prototype.deleteUniform = function(property) {

    delete this.uniforms[property];

}
