
let slideNext = true,
	slideTimer = 8.0,
	slideCount = 0;

let pageData = {

	"00": {
		images: [
			'../three/common/videos/movie01.mp4',
			'../three/common/videos/movie02.mp4',
			'../three/common/videos/01.mp4',
			'../three/common/videos/02.mp4',
			'../three/common/videos/03.mp4',
			'../three/common/videos/04.mp4'
		],
		start: function( three, sceneObj, postEffect ) {

			let clock = new THREE.Clock();

			let wheel = 0;
			let wheelFlag = true;

			let returnTimer;
			let returnFlag = false;

			let wheelAction = () => {

				clearTimeout(returnTimer);

				if( wheel >= 1.0 ) { //下スクロール
					wheel = 1.0;
					if( wheelFlag ) {
						wheelFlag = false;
						sceneObj.startTimer( clock.getElapsedTime() );
						setTimeout( () => {
							wheel = 0.0;
							touchPrevY = 0.0;
							pageData.textureVideoUpdateWheel( "down", sceneObj, this.images );
						}, 1000 );
					}
				} else if( wheel <= -1.0 ) {
					wheel = -1.0;
					if( wheelFlag ) {
						wheelFlag = false;
						sceneObj.startTimer( clock.getElapsedTime() );
						setTimeout( () => {
							wheel = 0.0;
							touchPrevY = 0.0;
							pageData.textureVideoUpdateWheel( "up", sceneObj, this.images );
						}, 1000 );
					}
				} else {

					wheelFlag = true;
					let speed = 0.3;

					if( -0.3 < wheel && wheel < 0.3 ) {

						returnTimer = setTimeout( () => {

							returnFlag = true;
							let startWheel = wheel;

							let startTime = clock.getElapsedTime();

							let returnTimerI = setInterval( () => {

								let nowTime = (clock.getElapsedTime() - startTime).toFixed(2);
								let wheelEase;

								if( wheel >= 0 ) { //下
									wheelEase = Easing.easeIn( nowTime, 0.0, startWheel, speed);
									if( wheelEase >= 1.0 ) wheelEase = 1.0;
								} else {
									wheelEase = Easing.easeIn( nowTime, 0.0, startWheel, speed);
									if( wheelEase < -1.0 ) wheelEase =- 1.0;
								}

								wheel = startWheel - wheelEase;
								if( nowTime >= speed ) {
									clearInterval(returnTimerI);
									returnFlag = false;
								}

							},1)

						}, 100 );
					}

				}

			}

			window.onwheel = (e) => {
				if(!returnFlag) wheel += e.deltaY/window.innerHeight;
				wheelAction();
			};

			let touchStartY = 0, touchPrevY = 0;
			window.ontouchstart = (e) => {
				touchStartY = e.touches[0].pageY;
			}
			window.ontouchmove = (e) => {
				let touchMoveY = e.touches[0].pageY;
				let touchDiffY = touchStartY - touchMoveY;
				if(!returnFlag) wheel = Math.min(1.0, (touchPrevY + touchDiffY/window.innerHeight) * 1.5);
				wheelAction();
			}
			window.ontouchend = (e) => {
				touchPrevY = wheel;
			}

			////


			sceneObj.addUniform({
				wheel: {
					type: 'f',
					value: wheel
				}
			});
			sceneObj.addUniform({
				startTime: {
					type: 'f',
					value: clock.getElapsedTime()
				}
			});

			sceneObj.initVideoObj(this.images, () => {
				three.sceneOR.add(sceneObj.obj);
				three.scene.add(postEffect.obj);

				three.run = true;
				three.renderLoop();
			});
			three.renderCallback = () => {
		        sceneObj.timer( clock.getElapsedTime() );
		        sceneObj.wheel( wheel );
		    };

		}
	},

	// "01": {
	// 	image: '../three/common/images/p.png',
	// 	start: function( three, sceneObj, postEffect ) {
    //
	// 		let clock = new THREE.Clock();
    //
	// 		let vert = [];
	// 		let color = [];
	// 		let texCoord = [];
	// 		{
	// 			let width = 3.0; // 全体の幅
	// 			let half = width / 2.0; // 幅の半分（上下左右に線対称に展開するため）
	// 			let interval = 0.015; // 頂点同士の間隔
	// 			let count = width / interval; // 幅と間隔からループカウント数を求める
    //
	// 			for(let i = 0; i <= count; ++i){
	// 				// 横位置
	// 				let x = -half + i * interval;
	// 				for(let j = 0; j <= count; ++j){
	// 					// 縦位置
	// 					let y = -half + j * interval;
	// 					vert.push(x, y, 0.0);
	// 					color.push(i / count, j / count, 0.5, 1.0);
	// 					texCoord.push(i / count, 1.0 - j / count);
	// 				}
	// 			}
    //
	// 		}
    //
	// 		let geometry = new THREE.BufferGeometry();
    //
	// 	    let vert_ = new Float32Array(vert);
	// 	    geometry.addAttribute('position', new THREE.BufferAttribute(vert_, 3));
    //
	// 	    let color_ = new Float32Array(color);
	// 	    geometry.addAttribute('color', new THREE.BufferAttribute(color_, 3));
    //
	// 	    let texCoord_ = new Float32Array(texCoord);
	// 	    geometry.addAttribute('texCoord', new THREE.BufferAttribute(texCoord_, 2));
    //
	// 		// let geometry = new THREE.BufferGeometry();
	// 		// const vertices_base = [];
	// 		// for (let i = 0; i < 1000 ; i ++) {
	// 		// 	const x = Math.floor(Math.random() * 1000 - 500);
	// 		// 	const y = Math.floor(Math.random() * 1000 - 500);
	// 		// 	const z = Math.floor(Math.random() * 1000 - 500);
	// 		// 	vertices_base.push(x, y, z);
	// 		// }
	// 		// console.log(vertices_base);
	// 		// const vertices = new Float32Array(vertices_base);
	// 		// geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    //
    //
	// 		let texture = new THREE.TextureLoader();
	// 		let uniforms = {
	// 			texture: {
	// 				type: 't',
	// 				value: texture.load( this.image )
	// 			},
	// 			globalColor: {
	// 				type: 'v4',
	// 				value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
	// 			},
	// 			time: {
	// 				type: 'f',
	// 				value: 0
	// 			},
	// 			mouse: {
	// 				type: 'v2',
	// 				value: new THREE.Vector2(0.0, 0.0),
	// 			}
	// 		};
	// 		let material = new THREE.ShaderMaterial({
	// 			uniforms: uniforms,
	// 			vertexShader: sceneObj.vertexShader,
	// 			fragmentShader: sceneObj.fragmentShader,
	// 			transparent: true,
	// 			depthTest: false,
	// 			blending: THREE.NormalBlending
	// 		});
    //
	// 		//
    //
	// 		three.sceneOR.add( new THREE.Points(geometry, material) );
	// 		three.scene.add(postEffect.obj);
    //
	// 		three.renderCallback = () => {
	// 			// three.cameraOR.rotation.x += 0.00025;
	// 			// three.cameraOR.rotation.y += 0.0005;
	// 			uniforms.time.value = clock.getElapsedTime();
	// 	    };
    //
	// 	}
	// },

	"06": {
		images: ['../three/common/images/02.jpg'],
		start: function( three, sceneObj, postEffect ) {

			let clock = new THREE.Clock();

			sceneObj.initImageObj(this.images, () => {
				three.sceneOR.add(sceneObj.obj);
				three.scene.add(postEffect.obj);

				three.run = true;
				three.renderLoop();
			});
			three.renderCallback = () => {
		        postEffect.timer( clock.getElapsedTime() );
		    };

		}
	},

	"10": {
		images: [
	        '../three/common/images/14.jpg',
	        '../three/common/images/08.jpg',
	        '../three/common/images/13.jpg',
	        '../three/common/images/04.jpg',
	        '../three/common/images/11.jpg',
	        '../three/common/images/03.jpg',
	        '../three/common/images/02.jpg'
		],
		start: function( three, sceneObj, postEffect ) {

			let clock = new THREE.Clock();

			slideTimer = 8.0;

			sceneObj.initImageObj(this.images, () => {
				three.sceneOR.add(sceneObj.obj);
				three.scene.add(postEffect.obj);

				three.run = true;
				three.renderLoop();
			});
			three.renderCallback = () => {
		        postEffect.timer( clock.getElapsedTime() );
				pageData.textureUpdate( clock.getElapsedTime(), sceneObj, this.images );
		    };
			postEffect.addUniform({
				slideTimer: {
					type: 'f',
					value: slideTimer
				}
			});

		}

	},

	"12": {
		images: ['../three/common/images/02.jpg'],
		start: function( three, sceneObj, postEffect ) {

			let clock = new THREE.Clock();

			sceneObj.initImageObj(this.images, () => {
				three.sceneOR.add(sceneObj.obj);
				three.scene.add(postEffect.obj);

				three.run = true;
				three.renderLoop();
			});
			three.renderCallback = () => {
		        postEffect.timer( clock.getElapsedTime() );
		    };

		}

	},




	textureUpdate: function(nowTime,sceneObj,textures) {

		if( Math.floor(nowTime) % slideTimer == slideTimer - 1 ) {
			if( slideNext ) {
				slideCount++;
				sceneObj.updateTexture(slideCount % textures.length);
				slideNext = false;
			}
		} else {
			slideNext = true;
		}

	},
	textureVideoUpdate: function(nowTime,sceneObj,textures) {

		if( Math.floor(nowTime) % slideTimer == slideTimer - 1 ) {
			if( slideNext ) {
				slideCount++;
				sceneObj.updateTextureVideo(slideCount % textures.length);
				slideNext = false;
			}
		} else {
			slideNext = true;
		}

	},
	textureVideoUpdateWheel: function(direction,sceneObj,textures) {

		if( direction == "down" ) {
			if( slideCount == textures.length - 1 ) {
				slideCount = 0
			} else {
				slideCount++;
			};
			sceneObj.updateTextureVideo(slideCount);
		} else {
			if( slideCount == 0 ) {
				slideCount = textures.length - 1;
			} else {
				slideCount--;
			}
			sceneObj.updateTextureVideo( slideCount );
		}

	}

};



/**
**
** Easing
**
** t : 時間(進行度)
** b : 開始の値(開始時の座標やスケールなど)
** c : 開始と終了の値の差分
** d : Tween(トゥイーン)の合計時間
**
**/
var Easing = {

    "linear" : function(t, b, c, d) {
        t /= d;
        return c*t + b;
    },
    "easeIn": function(t, b, c, d) {
        t /= d;
        return c*t + b;
    },
    "easeOut": function(t, b, c, d) {
        t /= d;
        t = t - 1;
        return c*(t + 1) + b;
    },

    //Cubic
    "easeInCubic": function(t, b, c, d) {
        t /= d;
        return c*t*t*t + b;
    },
    "easeOutCubic": function(t, b, c, d) {
        t /= d;
        t = t - 1;
        return c*(t*t*t + 1) + b;
    },
    "easeInOutCubic": function(t, b, c, d) {
        t /= d/2.0;
        if (t < 1) {
            return c/2.0*t*t*t + b;
        } else {
            t = t - 2;
            return c/2.0 * (t*t*t + 2) + b;
        }
    },

    //Quartic
    "easeInQuart": function(t, b, c, d) {
        t /= d;
        return c*t*t*t*t + b;
    },
    "easeOutQuart": function(t, b, c, d) {
        t /= d;
        t = t - 1;
        return -c*(t*t*t*t - 1) + b;
    },
    "easeInOutQuart": function(t, b, c, d) {
        t /= d/2.0;
        if (t < 1) {
            return c/2.0*t*t*t*t + b;
        } else {
            t = t - 2;
            return -c/2.0 * (t*t*t*t - 2) + b;
        }
    },

    //Quintic
    "easeInQuint": function(t, b, c, d) {
        t /= d;
        return c*t*t*t*t*t + b;
    },
    "easeOutQuint": function(t, b, c, d) {
        t /= d;
        t = t - 1;
        return c*(t*t*t*t*t + 1) + b;
    },
    "easeInOutQuint": function(t, b, c, d) {
        t /= d/2.0;
        if (t < 1) {
            return c/2.0*t*t*t*t*t + b;
        } else {
            t = t - 2;
            return c/2.0 * (t*t*t*t*t + 2) + b;
        }
    }

}
