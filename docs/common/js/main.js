let page;
let pageFunction;

let first = true;

let sceneImg,postEffect;
let sceneShaderCode, postShaderCode;

let three = new InitThree( document.getElementById('app') );

function init() {

	sceneImg = new CreateSceneImage(
		sceneShaderCode.vs,
		sceneShaderCode.fs
	);
	postEffect = new CreatePostEffect(
		three.rendererOR.texture,
		postShaderCode.vs,
		postShaderCode.fs
	);

    pageFunction.start( three, sceneImg, postEffect );

	////

	window.onresize = () => {
		three.onWindowResize( () => {
			sceneImg.resize();
			postEffect.resize();
		})
	};
	window.onmousemove = (e) => {
		three.onMouseMove( e, (mouse) => {
			postEffect.mouseMove(mouse);
		})
	};



	////

	first = false;
}

function reInit() {

	three.scene = new THREE.Scene();

	sceneImg.reset(
		sceneShaderCode.vs,
		sceneShaderCode.fs
	);
	postEffect.reset(
		postShaderCode.vs,
		postShaderCode.fs
	);

    pageFunction.start( three, sceneImg, postEffect );

	three.run = true;
	three.renderLoop();

}

////

function LoadShader() {

	three.run = false;
	sceneShaderCode = null;
	postShaderCode = null;

	if( location.hash ) {
		page = location.hash.split("page=")[1].split("&")[0];
        pageFunction = pageData[ page ];
	} else if( !location.hash || location.hash == "#" ) {
        page = "00";
        pageFunction = pageData[ page ];
    }

	new LoadShaderSource(
		"../three/" + page + "/scene.vert",
		"../three/" + page + "/scene.frag",
		(shader) => {
			sceneShaderCode = shader;
			loadCheck();
		}
	);
	new LoadShaderSource(
		"../three/" + page + "/post.vert",
		"../three/" + page + "/post.frag",
		(shader) => {
			postShaderCode = shader;
			loadCheck();
		}
	);

}

function loadCheck(){
	if( sceneShaderCode != null && postShaderCode != null ){
		first ? init() : reInit();
	}
}

LoadShader();
window.onhashchange = LoadShader;
