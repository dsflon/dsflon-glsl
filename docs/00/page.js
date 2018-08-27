let scene, post;

let slideCount,
	next,
	prev,
	area,
	speed;

let clock;

let wheel = 0;
let easeFlag = false;

let touchFlag = true,
	touchStartY = 0,
	touchPrevY = 0;

let videos = [];
let emls,
	target = {},
	targetId = {};

let btnPrev,
	btnNext;

let prevHash = 0;

function pageFunction( three, sceneObj, postEffect ) {

	scene = sceneObj,
	post = postEffect;
	area = scene.uniforms.area.value;
	speed = scene.uniforms.speed.value;

	clock = new THREE.Clock();
	btnPrev = document.getElementById('btn-prev'),
	btnNext = document.getElementById('btn-next'),
	emls = document.getElementsByClassName('sec'),
	target = {};

	let container = document.getElementById('container');
	let loadingBg = document.getElementById('loading-bg');
	let loading = document.getElementById('loading');

	let detail = document.getElementById('detail');
	let detailIframe = document.getElementById('detail-iframe');
	let btnDetailOpen = document.getElementsByClassName('sec-btn');
	let btnDetailClose = document.getElementById('btn-detail_close');
	let btnDetailNew = document.getElementById('btn-detail_new');

	for (var i = 0; i < emls.length; i++) {
		videos.push( emls[i].getAttribute("data-video") );
	};

	////////

	slideCount = 0,
	next = 1,
	prev = videos.length - 1;

	DomInit();
	Capture();

	let thisHash = location.hash;
	if(thisHash) {
		thisHash = checkHashIndex( thisHash.split("#page=")[1].split("&")[0] );
		prevHash = thisHash;
	}

	////////

	addWinowEvent();
	window.addEventListener("touchend", () => {
		touchFlag = true;
		if( !easeFlag ) addWinowEvent();
	});
	// window.addEventListener("mousemove", (e) => {
	// 	three.onMouseMove( e, (mouse) => {
	// 		post.mouseMove(mouse);
	// 	})
	// });


	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout( Capture, 300);
	});

	////////

	window.onhashchange = () => {

		if( easeFlag ) return false;

		let thisHash = location.hash;
		if(thisHash) {
			thisHash = checkHashIndex( thisHash.split("#page=")[1].split("&")[0] );
			if( thisHash > prevHash ) { //next
				wheelEasing("down",wheelAction.down);
			} else { //prev
				wheelEasing("up",wheelAction.up);
			}
		} else {
			if( prevHash == videos.length - 1 ) { //next
				wheelEasing("down",wheelAction.down);
			} else { //prev
				wheelEasing("up",wheelAction.up);
			}
		}

	}

	////////

	btnPrev.addEventListener("click", function(){
		wheelEasing("up", () => {
			wheelAction.up(true); //hashflag
		});
		this.classList.add("clicked");
	});
	btnNext.addEventListener("click", function(){
		wheelEasing("down", () => {
			wheelAction.down(true); //hashflag
		});
		this.classList.add("clicked");
	});

	for (var i = 0; i < btnDetailOpen.length; i++) {
		btnDetailOpen[i].addEventListener("click", function(){
			container.classList.add("hide");
			detail.classList.add("show");
			detailIframe.setAttribute( "src", this.getAttribute("data-href") );
			btnDetailNew.setAttribute( "href", this.getAttribute("data-href") );
			scene.uniforms.showDetail.value = 1.0;
			wheelEasing("up",wheelAction.up);
		});
	}
	btnDetailClose.addEventListener("click", function(){
		container.classList.remove("hide");
		detail.classList.remove("show");
		three.run = true;
		three.renderLoop();
		setTimeout( () => {
			wheelEasing("returnUp");
			detailIframe.setAttribute( "src", "" );
		},400);
		setTimeout( () => {
			wheel = 0.0;
			touchStartY = 0.0;
			touchPrevY = 0.0;
			scene.uniforms.showDetail.value = 0.0;
		},1400);
	});

	////////

	scene.initVideoObj(videos, () => {
		three.sceneOR.add(scene.obj);
		three.scene.add(post.obj);
		three.run = true;
		if(thisHash && thisHash != 0) {
			slideCount = Number(thisHash);
			textureVideoUpdateWheel();
		}
		setTimeout( () => {
			three.renderLoop();
			loadingBg.classList.add("loaded");
		}, 1000);
	},(i) => {
		loading.innerHTML = Math.floor(i / videos.length * 100) + "%";
	});

	three.renderCallback = () => {
		scene.timer( clock.getElapsedTime() );
		scene.uniforms.wheel.value = wheel;
		wheelActionDom();
		// console.log(wheel);
	};

};

function Capture() {

	if( window.innerWidth <= 640 ) return false;
	// return false;

	html2canvas( target.active,
		{
			backgroundColor: "#000000",
			letterRendering: true
		}
	).then( (canvas) => {

		let imagetexture = new THREE.Texture(canvas);
		imagetexture.needsUpdate = true;
        imagetexture.magFilter = THREE.NearestFilter;
        imagetexture.minFilter = THREE.NearestFilter;

		scene.uniforms["textImgSize"] = {
			type: 'v2',
			value: new THREE.Vector2(
				canvas.width,
				canvas.height
			)
		};
		scene.uniforms["textTexture"] = {
			type: 't',
			value: imagetexture
		};

	});

	// html2canvas( target.next,
	// 	{
	// 		backgroundColor: "#000000",
	// 		letterRendering: true
	// 	}
	// ).then( (canvas) => {
    //
	// 	let imagetexture = new THREE.Texture(canvas);
	// 	imagetexture.needsUpdate = true;
    //     imagetexture.magFilter = THREE.NearestFilter;
    //     imagetexture.minFilter = THREE.NearestFilter;
    //
	// 	scene.uniforms["textTextureNext"] = {
	// 		type: 't',
	// 		value: imagetexture
	// 	};
    //
	// });

}

function checkHashIndex(thisHash) {

	for (var variable in targetId) {
		if (targetId[variable] == thisHash) {
			return variable;
		}
	}

}

function addWinowEvent() {

	window.onwheel = (e) => {
		wheel -= e.deltaY/window.innerHeight;
		wheelAction.wheel();
	};

	if( touchFlag ) {
		window.ontouchstart = (e) => {
			touchFlag = false;
			touchStartY = e.touches[0].pageY;
		}
		window.ontouchmove = (e) => {
			let touchMoveY = e.touches[0].pageY;
			let touchDiffY = touchMoveY - touchStartY;
			wheel = Math.min(1.0, (touchPrevY + touchDiffY/window.innerHeight*3.0));
			wheelAction.wheel();
		}
		window.ontouchend = (e) => {
			touchPrevY = wheel;
		}
	}

}
function removeWinowEvent() {
	window.onwheel = null;
	window.ontouchstart = null;
	window.ontouchmove = null;
}

function DomInit() {

	emls = document.getElementsByClassName('sec');
	target = {
		active: emls[slideCount],
		prev: emls[prev],
		next: emls[next]
	}

	for (var j = 0; j < emls.length; j++) {
		emls[j].classList.remove("sec-active","sec-prev","sec-next");
		emls[j].removeAttribute("style");
		targetId[j] = emls[j].getAttribute("data-id");
	}

	target.prev.classList.add("sec-prev");
	target.next.classList.add("sec-next");
	target.active.classList.add("sec-active");

	btnPrev.classList.add("hide");
	btnNext.classList.add("hide");

	btnNext.addEventListener( "transitionend", transitionEnd);
	function transitionEnd() {
		btnPrev.innerHTML = "<span>#" + targetId[prev] + "</span>";
		btnNext.innerHTML = "<span>#" + targetId[next] + "</span>";
		btnPrev.classList.remove("hide","clicked");
		btnNext.classList.remove("hide","clicked");
		btnNext.removeEventListener( "transitionend", transitionEnd);
	}

	target.active.addEventListener( "transitionend", transitionEnd2);
	function transitionEnd2() {
		Capture();
		target.active.classList.remove("transition");
		target.active.removeEventListener( "transitionend", transitionEnd2);
	}

}

let wheelTextFlag = true;
function wheelActionDom() {

	let showDetail = scene.uniforms.showDetail.value;

	if( wheel == 0.0 ) {
		if(wheelTextFlag) {
			target.active.classList.add("transition");
			setTimeout( ()=> {
				target.active.classList.add("show");
				wheelTextFlag = false
			}, 100);
		}
	} else if( wheel >= area || wheel <= -area  ) {
		if(wheelTextFlag) {
			setTimeout( ()=> {
				target.active.classList.remove("show");
				wheelTextFlag = false
			}, 10);
			setTimeout( ()=> {
				wheelTextFlag = true;
			}, speed + 10);
		}
	} else {
		wheelTextFlag = true;
	}

}

let wheelAction = {

	showDetail: false,
	returnTimer: null,

	wheel: () => {

		clearTimeout(wheelAction.returnTimer);

		if( wheel >= area ) { //上スクロール
			wheelAction.up(true);
		} else if( wheel <= -area ) {
			wheelAction.down(true);
		} else {
			wheelAction.return();
		}

	},

	resetSpeed : () => {

		let spd = speed * 850;

		if( ua.isFirefox ) {
			spd = speed * 600;
		} else if(ua.isSp) {
			spd = speed * 900;
		}

		return spd;
	},

	up: (hashflag) => {

		easeFlag = true;
		if( easeFlag ) wheel = area;
		wheelAction.showDetail = scene.uniforms.showDetail.value == 0;

		removeWinowEvent();
		scene.uniforms.startTime.value = clock.getElapsedTime();
		if(hashflag) location.hash = "page=" + targetId[prev];

		setTimeout( () => {
			if(wheelAction.showDetail) {
				wheel = 0.0;
				touchStartY = 0.0;
				touchPrevY = 0.0;
				textureVideoUpdateWheel( "down" );
			} else {
				three.run = false;
			}
		}, wheelAction.resetSpeed() );
		setTimeout( () => {
			easeFlag = false;
			addWinowEvent();
		}, (speed * 1000) );

	},

	down: (hashflag) => {

		easeFlag = true;
		if( easeFlag ) wheel = -area;
		wheelAction.showDetail = scene.uniforms.showDetail.value == 0;

		removeWinowEvent();
		scene.uniforms.startTime.value = clock.getElapsedTime();
		if(hashflag) location.hash = "page=" + targetId[next];

		setTimeout( () => {
			if(wheelAction.showDetail) {
				wheel = 0.0;
				touchStartY = 0.0;
				touchPrevY = 0.0;
				textureVideoUpdateWheel( "up" );
			} else {
				three.run = false;
			}
		}, wheelAction.resetSpeed() );
		setTimeout( () => {
			easeFlag = false;
			addWinowEvent();
		}, (speed * 1000) );

	},

	return: () => {

		if( !easeFlag && (-0.3 < wheel && wheel < 0.3) ) { //戻す処理

			let backSpeed = 0.3;

			wheelAction.returnTimer = setTimeout( () => {

				easeFlag = true;

				removeWinowEvent();

				let startWheel = wheel;
				let startTime = clock.getElapsedTime();
				let easeTimer = requestAnimationFrame( render );

				function render(){
					easeTimer = requestAnimationFrame( render );

					let nowTime = clock.getElapsedTime() - startTime;
					let wheelEase;

					if( wheel > 0 ) { //上
						wheelEase = Easing.linear( nowTime, 0.0, startWheel, backSpeed);
						if( wheelEase >= 1.0 ) wheelEase = 1.0;
					} else {
						wheelEase = Easing.linear( nowTime, 0.0, startWheel, backSpeed);
						if( wheelEase <= -1.0 ) wheelEase = -1.0;
					}

					wheel = startWheel - wheelEase;

					if( nowTime >= backSpeed ) {
						wheel = 0.0;
						touchStartY = 0.0;
						touchPrevY = 0.0;
						easeFlag = false;
						cancelAnimationFrame(easeTimer);
						addWinowEvent();
					}

				}

			}, 200 );
		}

	}

}

function wheelEasing( direction, callback ) {

	removeWinowEvent();
	let startTime = clock.getElapsedTime();
	let easeTimer = requestAnimationFrame( render );

	function render(){

		easeTimer = requestAnimationFrame( render );

		let nowTime = clock.getElapsedTime() - startTime;
		let wheelEase = Easing.easeInQuart( nowTime, 0.0, area, 0.4);
		let wheelEaseRe = area - Easing.easeOutQuart( nowTime, 0.0, area, 0.4);

		if( direction == "up" ) { //上

			wheel = wheelEase;
			if( wheelEase >= 1.0 ) wheel = 1.0;

		} else if( direction == "down" ) {

			wheel = -wheelEase;
			if( wheelEase <= -1.0 ) wheel = -1.0;

		} else if ( direction == "returnUp" ) {

			wheel = wheelEaseRe;
			if( wheelEaseRe <= 0.00001 ) wheel = 0.0;

		} else if ( direction == "returnDown" ) {

			wheel = -wheelEaseRe;
			if( wheelEaseRe >= 0.0 ) wheel = 0.0;

		}

		if( nowTime >= 0.4 ) {
			cancelAnimationFrame(easeTimer);
			if(callback) callback();
			setTimeout( addWinowEvent, 500 );
		}
	}

}

function textureVideoUpdateWheel(direction) {

	if(direction) {
		if( direction == "up" ) {
			if( slideCount == videos.length - 1 ) {
				slideCount = 0
			} else {
				slideCount++;
			};
		} else {
			if( slideCount == 0 ) {
				slideCount = videos.length - 1;
			} else {
				slideCount--;
			}
		}
	}

	prev = slideCount == 0 ? videos.length - 1 : slideCount - 1;
    next = slideCount == videos.length - 1 ? 0 : slideCount + 1;

	// console.log("prev : " + prev,", slideCount : " + slideCount,", next : " + next);
	updateTextureVideo();
	DomInit();

	prevHash = slideCount;

}

function updateTextureVideo() {

    scene.uniforms.imgSize.value = new THREE.Vector2(
        scene.videoTextures[slideCount].width,
        scene.videoTextures[slideCount].height
    )
    scene.uniforms.texture.value = scene.videoTextures[slideCount].tex;

    for (var j = 0; j < scene.videos.length; j++) {
        scene.videos[j].pause();
    }
    scene.videos[slideCount].play();
    scene.videos[next].play();
    scene.videos[prev].play();

    setTimeout( () => {
        scene.uniforms.textureNext.value = scene.videoTextures[next].tex;
        scene.uniforms.texturePrev.value = scene.videoTextures[prev].tex;
    }, 100 )

}


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
