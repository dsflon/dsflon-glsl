let page = "00";

let sceneImg,postEffect;
let sceneShaderCode, postShaderCode;

let three = new InitThree( document.getElementById('app') );
let ua = new UA();

function init() {

	sceneImg = new CreateSceneImage(
		sceneShaderCode.vs,
		sceneShaderCode.fs,
		{
			wheel: {
				type: 'f',
				value: 0
			},
			startTime: {
				type: 'f',
				value: 0
			},
			area: {
				type: 'f',
				value: 0.5
			},
			speed: {
				type: 'f',
				value: 0.75
			},
			showDetail: {
				type: 'f',
				value: 0.0
			}
		}
	);
	postEffect = new CreatePostEffect(
		three.rendererOR.texture,
		postShaderCode.vs,
		postShaderCode.fs
	);

    pageFunction( three, sceneImg, postEffect );

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

}

////

function LoadShader() {

	three.run = false;
	sceneShaderCode = null;
	postShaderCode = null;

	new LoadShaderSource(
		"../" + page + "/scene.vert",
		"../" + page + "/scene.frag",
		(shader) => {
			sceneShaderCode = shader;
			loadCheck();
		}
	);
	new LoadShaderSource(
		"../" + page + "/post.vert",
		"../" + page + "/post.frag",
		(shader) => {
			postShaderCode = shader;
			loadCheck();
		}
	);

}

function loadCheck(){
	if( sceneShaderCode != null && postShaderCode != null ){
		init()
	}
}

window.onload = () => {
	LoadShader();
	// window.onhashchange = LoadShader;
}
