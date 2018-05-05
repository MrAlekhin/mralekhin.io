var loadWorld = ()=>{


  var labelAdd, globeSpeed, labels, scene, camera, renderer, flags,
  loader, globe, spotLight, spotLight2, ambientLight, geometry, cubeMaterials, cube,
  stars, starMaterial, textMaterial, text, snap, gameLoopStop;

  var dataAbout, dataPrjects, dataExperiments, dataBlog, dataCourses;

  var createFlag = (x, y, z) =>{
    var obj = new THREE.Object3D();
    obj.position.set(x, y, z);
    obj.updateMatrix();
    obj.matrixAutoUpdate = false;
    return obj;
  }

  var createViewFlag = (x, y, z, _x, _y, _z)=>{
    var obj = new THREE.Object3D();
    obj.position.set(x, y, z);
    obj.rotation.set(_x, _y, _z);
    obj.updateMatrix();
    obj.matrixAutoUpdate = false;
    return obj;
  }

  function initWorld(callback){
    gameLoopStop = false;
    labelAdd = false;
    globeSpeed = 0.001;
    labels = new Array();
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x0d0d0d );
    scene.fog = new THREE.FogExp2( 0x0d0d0d, 0.35, 800 );
    width = window.innerWidth;
    height = window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
    camera.position.z = 9;
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);
    $('#world').append( renderer.domElement );

    //LIGHTNING
    spotLight = new THREE.SpotLight( 0xffffff, 1.5);
    spotLight.position.set( 0, 200, 200 );
    spotLight.castShadow = true;
    scene.add( spotLight );

    spotLight2 = new THREE.SpotLight( 0xffffff, 1.5);
    spotLight2.position.set( 0, -200, -200 );
    spotLight2.castShadow = true;
    scene.add( spotLight2 );

    ambientLight = new THREE.AmbientLight( 0x404040, 0.5);
    scene.add(ambientLight);


    flags = [
      {label: 'About', mesh: createFlag(0.3, 0.5, 1.1), view: createViewFlag(
        0.596139146077479, 0.4972328975035587, 1.6131576361531166,
        -0.2989953223308924, 0.33948026081864824, 0.10228341584758419
      )},
      {label: 'Blog', mesh: createFlag(-0.1, -0.8, 0.8), view: createViewFlag(
        -0.8001873144691829, -1.3119093110055466, 1.2543407239954916,
        0.80782736251857, -0.41522523989483195, 0.39925056718126256
      )},
      {label: 'Experiments', mesh: createFlag(-1.3, -0.75, -0.4), view: createViewFlag(
        -1.681175556300965, -1.1013746854650124, -0.8896604806475855,
        2.250258825559901, -0.8708740035818685, 2.38345390197717
      )},
      {label: 'Courses', mesh: createFlag(0.6, -1.3, -0.8), view: createViewFlag(
        1.2733006059967225, -2.1416173649641137, -0.6033039368590493,
        1.845385209290522, 0.5197855605626398, -2.086718425618078
      )},
      {label: 'Projects', mesh: createFlag(0.1, 1, -1.2), view: createViewFlag(
        -0.00974330896141297, 1.9019497892302626, -0.5363370723496914,
        -1.4894472783331487, -0.04145545690079824, -0.4702890083479135
      )}
    ];

    //loag globe 3Dmodel
    loader = new THREE.JSONLoader();
    loader.load(
      'models/globe.json',
      function ( geometry, materials ) {

        var material = new THREE.MeshFaceMaterial(materials);
        globe = new THREE.Mesh( geometry, material );
        scene.add( globe );

        ///////// ADD FLAGS
        for(var i=0; i<flags.length; i++){
          globe.add(flags[i].mesh, flags[i].view);
        }
      },

      // onProgress callback
      function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        if(xhr.loaded / xhr.total === 1){
          Snap.load("svg/About.svg", (data)=>{
            dataAbout = data;
            Snap.load("svg/Projects.svg", (data)=>{
              dataPrjects = data;
              Snap.load("svg/Experiments.svg", (data)=>{
                dataExperiments = data;
                Snap.load("svg/Blog.svg", (data)=>{
                  dataBlog = data;
                  Snap.load("svg/Courses.svg", (data)=>{
                    dataCourses = data;
                    callback();
                  });
                });
              });
            });
          });
        }
        console.log(dataAbout);
      },

      // onError callback
      function( err ) {
        console.log( 'An error happened' );
      }
    );
    loader.setTexturePath('./img');

    // skybox
    geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    var cubeMaterials = [
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('img/back.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('img/back.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('img/bottom.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('img/top.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('img/back.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('img/back.png'), side: THREE.DoubleSide}),
    ];
    cube = new THREE.Mesh(geometry, cubeMaterials);
    scene.add(cube);

    //stars
    stars = new THREE.Group();
    geometry = new THREE.PlaneGeometry( 0.01,0.01);
    starMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
    for ( var i = 0; i < 2000; i ++ ) {
      var mesh = new THREE.Mesh( geometry, starMaterial );
      mesh.position.x = ( Math.random() - 0.5 ) * 10;
      mesh.position.y = ( Math.random() - 0.5 ) * 10;
      mesh.position.z = ( Math.random() - 0.5 ) * 10;
      mesh.rotation.x = ( Math.random() - 0.5 ) * 10;
      mesh.rotation.y = ( Math.random() - 0.5 ) * 10;
      mesh.rotation.z = ( Math.random() - 0.5 ) * 10;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      stars.add( mesh );
    }
    scene.add(stars);

    //add text
    loader = new THREE.FontLoader();
    textMaterial;
    text;
    loader.load( 'models/helvetiker_regular.typeface.json', function ( font ) {
    var textGeometery = new THREE.TextGeometry( '   WELCOME\n TO MY WORLD', {
      font: font,
      size: 0.1,
      height: 0.01,
      curveSegments: 12,
      bevelEnabled: false,
      bevelSize: 0,
      bevelSegments: 0
      });

      textMaterial = new THREE.MeshPhongMaterial({ color: 0xd12028, flatShading: true } );
      text = new THREE.Mesh(textGeometery, textMaterial);
      text.name = 'text';
      scene.add(text);
      text.position.z = 4;
    },

    // onProgress callback
    function ( xhr ) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loadedFont' );
    });
  }

  //on resize
  window.addEventListener('resize', function(){
    width = window.innerWidth;
    height = window.innerHeight;
    orientationCheck();
    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    if($('#sidebar')){
      console.log('resize');
      let sidebar = $('#sidebar');
      sidebar.css('left', '');
    }
  })

  //create label
  var createTextLabel = function(id) {
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.width = 60;
    div.style.height = 10;
    div.style.color = "white";
    div.innerHTML = "THIS IS MY GLOBE";
    div.style.top = 200 + 'px';
    div.style.left = 200 + 'px';


    return {
      id,
      element: div,
      parent: false,
      position: new THREE.Vector3(0,0,0),
      setHTML: function(html) {
        this.element.innerHTML = html;
      },
      setParent: function(threejsobj) {
        this.parent = threejsobj;
      },
      updatePosition: function() {
        if(parent) {
          //this.position.copy(this.parent.position);
          this.position.setFromMatrixPosition(this.parent.matrixWorld);
        }

        var coords2d = this.get2DCoords(this.position);
        this.element.style.left = coords2d.x + 'px';
        this.element.style.top = coords2d.y + 'px';
        var dist = distanceToCamera(this.parent);
        if(dist>3.45){
          this.element.style.visibility = 'hidden';
        }else{
          this.element.style.fontSize = (Math.round((1/dist)* 100)/100)*2.5+'em';
          this.element.style.visibility = 'visible';
        }
      },
      get2DCoords: function(position) {
        var projector = new THREE.Projector();
        camera.updateMatrixWorld();
        var v = position.clone().project(camera);

        var percX = (v.x + 1) / 2;
        var percY = (-v.y + 1) / 2;
        var left = percX * window.innerWidth;
        var top = percY * window.innerHeight;

        return new THREE.Vector2(left, top);
      }
    }
  }

  //Starting camera animation
  function cameraPositionToDefaul(){
    var pos = {z: camera.position.z};
    var tar = {z: 3};
    var cameraPositionToDefaulTween = new TWEEN.Tween(pos).to(tar, 5000);
    cameraPositionToDefaulTween.onUpdate(()=>{
      camera.position.z = pos.z;
    });
    cameraPositionToDefaulTween.easing(TWEEN.Easing.Quadratic.InOut);
    cameraPositionToDefaulTween.start();
    cameraPositionToDefaulTween.onComplete(()=>{
      $('#world').hover(function(){
        $(this).css('cursor', 'move');
      });
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableKeys = false;
      scene.remove(scene.getObjectByName('text'));
      if(width>800){
        addMenu();
      }
      var smallLogo = document.createElement('div');
      $(smallLogo).addClass('smallLogo');
      $(smallLogo).attr('id','smallLogo');
      $('body').append(smallLogo);
    });
  }

  //Moving animation to the object
  function cameraMoveToObj(obj, callback){
    if(width<800){
      $('#smallLogo').css({right: '0', bottom: '0', top: 'inherit'});
    }
    $('.globeLabel').hover(function(){
      $(this).css('cursor', 'default');
    });
    $('#world').hover(function(){
      $(this).css('cursor', 'default');
    })
    $('.globeLabel').css('pointer-events','none');
    controls.enabled = false;

    var temObj = new THREE.Object3D();
    temObj.position.setFromMatrixPosition(obj.matrixWorld);
    temObj.rotation.setFromRotationMatrix(obj.matrixWorld);
    globeSpeed = 0;
    var pos = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
    var rot = {x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z}
    var posTar = {x: temObj.position.x, y: temObj.position.y, z: temObj.position.z};
    var rotTar = {x: temObj.rotation.x, y: temObj.rotation.y, z: temObj.rotation.z}


    var cameraPositionChangeToObjTween = new TWEEN.Tween(pos).to(posTar, 2000);
    cameraPositionChangeToObjTween.onUpdate(()=>{
      camera.position.x = pos.x;
      camera.position.y = pos.y;
      camera.position.z = pos.z;
    });
    cameraPositionChangeToObjTween.easing(TWEEN.Easing.Quadratic.InOut);
    cameraPositionChangeToObjTween.start();

    var cameraRotationChangeToObjTween = new TWEEN.Tween(rot).to(rotTar, 2000);
    cameraRotationChangeToObjTween.onUpdate(()=>{
      camera.rotation.x = rot.x;
      camera.rotation.y = rot.y;
      camera.rotation.z = rot.z;
    });
    cameraRotationChangeToObjTween.easing(TWEEN.Easing.Quadratic.InOut);
    cameraRotationChangeToObjTween.start();
    cameraRotationChangeToObjTween.onComplete(()=>{
      Snap.animate(0, 40, (value)=>{
        $('#world').css('filter', `blur(${value}px)`)
      }, 1000, mina.easeinout, ()=>{
        gameLoopStop=true;
        globeStart();
        var forozenarea = document.createElement('div');
        $(forozenarea).addClass('forozen-area');
        $(forozenarea).attr('id','svgContainer');
        $('body').append(forozenarea);
        snap = Snap('#svgContainer');
        var closeButton = document.createElement('span');
        $(closeButton).addClass('btn-icon-close');
        $(closeButton).click(()=>zoomCameraBack());
        $('body').append(closeButton);
        callback();
      });
    });
  }

  //zooming camera back
  function zoomCameraBack(){

    $('#smallLogo').css({left: '0', bottom: 'inherit', top: '5px'});
    $('.btn-icon-close').remove();
    $('.btn-icon-clickme').remove();
    gameLoopStop=false;
    GameLoop();
    let forozenarea = $('div[class="forozen-area"]');
    switch (forozenarea.find('svg').attr('id')) {
      case 'About':
        dataAbout = forozenarea.find('svg').detach();
        break;
      case 'Experiments':
        dataExperiments = forozenarea.find('svg').detach();
        break;
      case 'Courses':
        dataCourses = forozenarea.find('svg').detach();
        break;
      case 'Projects':
        dataPrjects = forozenarea.find('svg').detach();
        break;
      case 'Blog':
        dataBlog = forozenarea.find('svg').detach();
        break;
    }
    $('div[class="forozen-area"]').remove();
    //unbluring world and labels animation
    Snap.animate(40, 0, (value)=>{
      $('#world').css('filter', `blur(${value}px)`)
    }, 1000, mina.easeinout,()=>{
      globeStart();
      if(width>800){
        $('.sidebar').show();
      }
      $('.globeLabel').css('pointer-events','auto');
      $('.globeLabel').hover(function(){
        $(this).css('cursor', 'pointer');
      });
      $('#world').hover(function(){
        $(this).css('cursor', 'move');
      });
      controls.enabled = true;
    });


    //move camera back to default position
    var pos = {x:camera.position.x, y:camera.position.y, z: camera.position.z};
    var rot = {x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z};
    var tar_pos = {x:0, y:0, z: 3};
    var tar_rot = {x:0, y:0, z:0};

    var cameraPositionBack = new TWEEN.Tween(pos).to(tar_pos, 1500);
    cameraPositionBack.onUpdate(()=>{
      camera.position.x = pos.x;
      camera.position.y = pos.y;
      camera.position.z = pos.z;
    });
    cameraPositionBack.easing(TWEEN.Easing.Quadratic.InOut);
    cameraPositionBack.start();

    var cameraRotationBack = new TWEEN.Tween(rot).to(tar_rot, 1500);
    cameraRotationBack.onUpdate(()=>{
      camera.rotation.x = rot.x;
      camera.rotation.y = rot.y;
      camera.rotation.z = rot.z;
    });
    cameraRotationBack.easing(TWEEN.Easing.Quadratic.InOut);
    cameraRotationBack.start();
  }

  //stoping the globe animation
  function globeStop(){
    var speed = {speed: globeSpeed};
    var globeStopTween = new TWEEN.Tween(speed).to({speed: 0}, 500);
    globeStopTween.onUpdate(()=>globeSpeed=speed.speed);
    globeStopTween.easing(TWEEN.Easing.Quadratic.Out);
    globeStopTween.start();
  }

  //starting turning globe animation
  function globeStart(){
    var speed = {speed: globeSpeed};
    var globeStopTween = new TWEEN.Tween(speed).to({speed: 0.001}, 500);
    globeStopTween.onUpdate(()=>globeSpeed=speed.speed);
    globeStopTween.easing(TWEEN.Easing.Quadratic.Out);
    globeStopTween.start();
  }

  //add labels
  function addLabels(){
    for (var i = 0; i < flags.length; i++){
      var text = createTextLabel(i);
      text.setHTML(`<p class="globeLabel" id="globelabel${flags[i].label}">${flags[i].label}</p>`);
      text.setParent(flags[i].mesh);
      labels.push(text);
      $('#world').append(text.element);
    }

    $(document).ready(()=>{

      $("#globelabelAbout").click(function(){
        $('#sidebar').hide();
        cameraMoveToObj(flags[0].view,()=>loadAbout());
      });

      $("#globelabelBlog").click(function(){
        $('#sidebar').hide();
        cameraMoveToObj(flags[1].view, ()=>loadBlog());
      });

      $("#globelabelExperiments").click(function(){
        $('#sidebar').hide();
        cameraMoveToObj(flags[2].view, ()=>loadExperiments());
      })

      $("#globelabelCourses").click(function(){
        $('#sidebar').hide();
        cameraMoveToObj(flags[3].view, ()=>loadCourses());
      })

      $("#globelabelProjects").click(function(){
        $('#sidebar').hide();
        cameraMoveToObj(flags[4].view, ()=>loadProjects());
      })

      $('.globeLabel').mouseenter(function(){
        globeStop();
        $(this).css('cursor', 'pointer');
      });
      $('.globeLabel').mouseleave(function(){
        globeStart();
        $(this).css('cursor', 'default');
      });
    });
  };

  //Distance between objects
  function distanceVector( obj1, obj2 ){
    _v1 = new THREE.Vector3();
    _v2 = new THREE.Vector3();

    _v1.setFromMatrixPosition(obj1.matrixWorld);
    _v2.setFromMatrixPosition(obj2.matrixWorld);

    var dx = _v1.x - _v2.x;
    var dy = _v1.y - _v2.y;
    var dz = _v1.z - _v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
  }

  //Distance between object and camera
  function distanceToCamera(obj){
    return distanceVector(camera, obj);
  }


  var GameLoop = function(){
    setTimeout( function() {
      if(!gameLoopStop){
        requestAnimationFrame(GameLoop);
      }
    }, 1000 / 30 );
    if(text){
      text.position.x = camera.position.x - 0.35;
    }
    if(camera.position.z<=3){
      if(!labelAdd){
        addLabels();
        labelAdd = true;
      }
    }
    for(var i=0; i<labels.length; i++) {
    labels[i].updatePosition();
    }
    renderer.render(scene, camera);
    TWEEN.update();
    if(globe){
      globe.rotation.y += globeSpeed;
      globe.rotation.x += globeSpeed;
    }
    if(stars){
      stars.rotation.x -= 0.0005;
      stars.rotation.y -= 0.0005;
    }
  };

  initWorld(()=>{
    animate();
  });
  function animate(){
    GameLoop();
    $('#loaderText').html('Ready! Click on the screen.');
    $('#loadingMask').click(()=>{
      if (screenfull.enabled) {
        screenfull.request(document.documentElement);
      }

      Snap.animate(0, 100, (value)=>{
        $('#loadingMask').css({top: `${value}%`});
        $('#loadingMask').find('span').css({top: `${value+50}%`});
        $('#loaderText').css({top: `${value+60}%`});

      }, 1000, mina.easeinout, ()=>{
        cameraPositionToDefaul();

      })
    })
  }

  function orientationCheck(){
    width = window.innerWidth;
    height = window.innerHeight;
    if(width<height){
      console.log('vertical');
      initVertical();
      initSvgContainerVertical();


    }else{
      console.log('landscape');
      initLandscape();
      initSvgContainerLandscape();
    }
  }
  function initLandscape(){
    if(Snap.select('#prComment')){
      Snap.select('#prComment').attr({
        transform: '',
      })
      Snap.select('#prComment').select('polygon').attr({
        visibility: ''
      });
    }
  }
  function initVertical(){
    if(Snap.select('#prComment')){
      Snap.select('#prComment').attr({
        transform: 'translate(500, 400)',
      })
      Snap.select('#prComment').select('polygon').attr({
        visibility: 'hidden'
      });
    }
    //$('#svgContainer').css('bottom', `${}`);
  }
  function initSvgContainerLandscape(){
    if(document.getElementById('svgContainer')){
      $('#svgContainer')
        .css({
          'z-index': '2',
          'position': 'absolute',
          'bottom': '0',
          'width': '100%',
          'height': '100%',
          'overflow': 'hidden',
          // 'background': 'linear-gradient(#03A9F4, #764ba2)'
        });

        $('#svgContainer').find('svg')
          .css({
            'z-index': '2',
            'position': 'absolute',
            'bottom': '0',
            'right': '',
            'height': '100%',
            'width': '100%'
          })
        if(Snap('#popUpSvg')){
          console.log('landscape');
          if(width>850){
            $('#popUp').css({
              'transform-origin': `50% 50% 0px`,
             transform:'scale(1,1)',
            })
          }else{
            $('#popUp').css({
            'transform-origin': `50% 50% 0px`,
             transform:'scale(1.5,1.5)',
            })
          }
        }
    }
  }
  function initSvgContainerVertical(){
    if(document.getElementById('svgContainer')){
      $('#svgContainer')
        .css({
          'position': 'absolute',
          'bottom': '0',
          'width': '100%',
          'height': '100%',
          'overflow': 'hidden',
          // 'background': 'linear-gradient(#667eea, #764ba2)'
        })

      $('#svgContainer').find('svg')
        .css({
          'position': 'absolute',
          'bottom': '0',
          'right': '0',
          'height': '100%',
          'width': '190%'
        })

      if(Snap('#popUpSvg')){
        console.log('hi');
        $('#popUpSvg').css('width', '100%');
        $('#popUp').css({'transform-origin': `50% 50% 0px`, transform:'scale(2.1,2.1)'});
      }
    }
    function initLandscape(){
      if(Snap.select('#prComment')){
        Snap.select('#prComment').attr({
          transform: '',
        })
        Snap.select('#prComment').select('polygon').attr({
          visibility: ''
        });
      }
    }

    function initVertical(){
      if(Snap.select('#prComment')){
        Snap.select('#prComment').attr({
          transform: 'translate(500, 400)',
        })
        Snap.select('#prComment').select('polygon').attr({
          visibility: 'hidden'
        });
      }
      //$('#svgContainer').css('bottom', `${}`);
    }
  }
  function appendSvg (data, callback){
    try {
      snap.append(data);
      callback();
    } catch (e) {
      $('div[class="forozen-area"]').append(data);
    }
    orientationCheck();
  }
  function loadAbout(){
      //snap.attr({bottom: 0});
      appendSvg(dataAbout, ()=>{
        var abMoon = $('#abMoon');
        var abTitle = Snap('#abTitle');
        var abDescription = Snap('#abDescription');
        var abSpaceMan = Snap('#abSpaceMan');
        var abHandOne = Snap('#abHandOne');
        var abHandTwo = Snap('#abHandTwo');
        //var abComment = Snap('#abComment');
        var abCircle = Snap('#abCircle');
        var abCabel = Snap('#abCabel');

        if(abSpaceMan && abMoon){
          abMoon.css({transform: 'scale(0,0)','transform-origin': '50% 50% 0px'});

          abSpaceMan.attr({transform: 'scale(0,0)', 'transform-origin': '50% 50% 0px'});
        }


        var titlePos = abTitle.transform().string;
        var descritionPos = abDescription.transform().string;
        abTitle.transform(`scale(0,0)`);

        abDescription.attr({transform: 'scale(0,0)'});
        //abComment.attr({transform: 'scale(0,0)', 'transform-origin': '50% 100% 0px'});
        abCabel.attr({transform: 'scale(0,0)', 'transform-origin': '50% 100% 0px'});

        // $('#abHandOne').css("transform-origin",`${abHandOne.getBBox().x + abHandOne.getBBox().width - 5}px ${abHandOne.getBBox().y + abHandOne.getBBox().height-20}px 0px`);
        // $('#abHandTwo').css("transform-origin",`${abHandTwo.getBBox().x + abHandTwo.getBBox().width - 5}px ${abHandTwo.getBBox().y + abHandTwo.getBBox().height-20}px 0px`);

        Snap.animate(0, 1, (value)=>{
          abMoon.css({transform: `scale(${value},${value})`,'transform-origin': '50% 50% 0px'});
        }, 600, mina.backout, ()=>{
          moonRound();
        });

        //moonRound();
        function moonRound(){
          if(abMoon){
            Snap.animate(0,360, ( value )=>{
              $('#abMoon').css('transform', `rotate(${value}deg)`);
            },30000, ()=>{
                $('#abMoon').css('transform', 'rotate(0deg)');
                moonRound()
              });
          }
        }


        abTitle.animate({transform: `s1,1${titlePos}`}, 400, mina.elastic, ()=>{
          abDescription.animate({transform: `s1,1${descritionPos}`}, 400, mina.elastic, ()=>{
            abSpaceMan.animate({transform: 'scale(1,1)'}, 400, mina.elastic, ()=>{
              abCabel.animate({transform: 'scale(1,1)'}, 400, mina.elastic, ()=>{
                  moveSpaceManUp();
                  moveSpaceCabelUp();
                  firstHandMoveUp();
                  secondHandMoveUp();
                  abMoon.stop();
              });
            });
          });
        });

        //Animate Circle
        abCircle.attr({
          strokeWidth: 2,
          "stroke-opacity": 0.5,
          "stroke-dasharray": 5000,
          "strokeDashoffset": 0
        });
        Snap.animate(5000,0, function( value ){
               abCircle.attr({ 'strokeDashoffset': value })
        },3000)

        function moveSpaceManUp(){
          abSpaceMan.animate({transform: 'translate(-30, 30)'}, 5000, mina.easeinout, ()=>moveSpaceManDown());
        }
        function moveSpaceManDown(){
          abSpaceMan.animate({transform: 'translate(0, -20)'}, 5000, mina.easeinout, ()=>moveSpaceManUp());
        }
        function moveSpaceCabelUp(){
          abCabel.animate({transform: 'translate(10, 0)'}, 5000, mina.easeinout, ()=>moveSpaceCabelDown());
        }
        function moveSpaceCabelDown(){
          abCabel.animate({transform: 'translate(-20, 0)'}, 5000, mina.easeinout, ()=>moveSpaceCabelUp());
        }

        function firstHandMoveUp(){
          console.log('handUp');
          if($('#abHandOne').css('transform-origin')){
            $('#abHandOne').css("transform-origin",`${abHandOne.getBBox().x + abHandOne.getBBox().width - 5}px ${abHandOne.getBBox().y + abHandOne.getBBox().height-20}px 0px`);
            Snap.animate(0, -30, function(value){
              $('#abHandOne').css({'transform': `rotate(${value}deg)`});
            }, 5000, mina.easeinout, ()=>firstHandMoveDown())
          }
        }
        function firstHandMoveDown(){
          console.log('handDown');
          Snap.animate(-30, 0, function(value){
            $('#abHandOne').css({'transform': `rotate(${value}deg)`});
          }, 5000, mina.easeinout, ()=>firstHandMoveUp())
        }

        function secondHandMoveUp(){
          if($('#abHandTwo').css('transform-origin')){
            $('#abHandTwo').css("transform-origin",`${abHandTwo.getBBox().x + abHandTwo.getBBox().width - 5}px ${abHandTwo.getBBox().y + abHandTwo.getBBox().height-20}px 0px`);
            Snap.animate(0, -20, function(value){
              $('#abHandTwo').css({'transform': `rotate(${value}deg)`});
            }, 5000, mina.easeinout, ()=>secondHandMoveDown());
          }
        }
        function secondHandMoveDown(){
          Snap.animate(-20, 0, function(value){
            $('#abHandTwo').css({'transform': `rotate(${value}deg)`});
          }, 5000, mina.easeinout, ()=>secondHandMoveUp())
        }
      });
      addClickMe();
  }
  function loadExperiments(){
    appendSvg(dataExperiments, ()=>{
        var exSattelite = Snap('#exSattelite');
        var exCircle = Snap('#exCircle');
        var exBluePlanet = Snap('#exBluePlanet');
        var exTitle = Snap('#exTitle');
        var exDescription = Snap('#exDescription');

        var titlePos = exTitle.transform().string;
        var descritionPos = exDescription.transform().string;

        exBluePlanet.attr({"transform-origin": '100% 50%', transform:'scale(0,0)'});
        exTitle.attr({transform:'scale(0,0)', "transform-origin": '50% 0'});
        exDescription.attr({transform:'scale(0,0)', "transform-origin": '50% 0'});
        exSattelite.attr({transform:'scale(0,0)', "transform-origin": '50% 50%'});

        exBluePlanet.animate({transform: 'scale(1,1)'}, 500, mina.backout, ()=>{
          exTitle.animate({transform: `s1,1${titlePos}`}, 500, mina.elastic, ()=>{
            exDescription.animate({transform: `s1,1${descritionPos}`}, 400, mina.elastic, ()=>{
              exSattelite.animate({transform: 'scale(1,1)'}, 400, mina.backout, ()=>{
                exSatteliteMoveDown();
              });
            });
          });
        });

        //Animate Circle
        exCircle.attr({
          strokeWidth: 2,
          "stroke-opacity": 0.5,
          "stroke-dasharray": 5000,
          "strokeDashoffset": 0
        });
        Snap.animate(5000,0, function( value ){
               exCircle.attr({ 'strokeDashoffset': value })
        },3000)


        function exSatteliteMoveDown(){
          exSattelite.animate({transform: 'translate(-20, 60)'}, 4000, mina.easeinout, ()=>exSatteliteMoveUp());
        }

        function exSatteliteMoveUp(){
          exSattelite.animate({transform: 'translate(0, 0)'}, 4000, mina.easeinout, ()=>exSatteliteMoveDown());
        }
      });
    addClickMe();
  }
  function loadBlog(){
    appendSvg(dataBlog, ()=>{
        var blGround = Snap('#blGroung');
        var blCircle = Snap('#blCircle');
        var blAstronaut = Snap('#blAstronaut');
        var blTitle = Snap('#blTitle');
        var blDescription = Snap('#blDescription');
        var flag = Snap('#Flag');

        var titlePos = blTitle.transform().string;
        var descritionPos = blDescription.transform().string;

        blGround.attr({transform: 'scale(0,0)', "transform-origin": '100% 100%'});
        blTitle.attr({transform:'scale(0,0)', "transform-origin": '50% 0'});
        blDescription.attr({transform:'scale(0,0)', "transform-origin": '50% 0'});
        blAstronaut.attr({transform:'scale(0,0)', "transform-origin": '50% 50%'});
        flag.attr({transform:'scale(0,0)', "transform-origin": '100% 50%'});

        blGround.animate({transform: 'scale(1,1)'}, 400, mina.backout, ()=>{
          blTitle.animate({transform: `s1,1${titlePos}`}, 400, mina.elastic, ()=>{
            blDescription.animate({transform: `s1,1${descritionPos}`}, 400, mina.elastic, ()=>{
              blAstronaut.animate({transform: 'scale(1,1)'}, 400, mina.backout, ()=>{
                flag.animate({transform: 'scale(1,1)'}, 400, mina.elastic, ()=>{
                    flagWave();
                });
              });
            });
          });
        });

        function flagWave(){
          if(Snap('#FlagTopBase')){
            Snap('#FlagTopBase').animate({d: 'M1733,580.2c-8.5,0-12.5-0.9-14.2-1.6c-0.3-3.1-1.7-6.1-4-8.3c-4.2-4.2-10.6-6.1-20.3-6.1c-13.9,0-58.1,7-70.4,10.1l-1.6-72.9c11.8-4.2,62.9-15.5,81.6-15.5c10,0,13,2.6,13.7,3.3c7.4,8.7,20.3,12.8,39.3,13c11.9,0.2-0.2,1.3,9.8-0.6v74.3C1754.1,578.4,1752.2,580.2,1733,580.2z'}, 3000, ()=>{
              Snap('#FlagTopBase').animate({d: 'M1708,583.2c-8.5,0-12.5-0.9-14.2-1.6c-0.3-3.1-1.7-6.1-4-8.3c-4.2-4.2-10.6-6.1-20.3-6.1c-13.9,0-33.1,4-45.4,7.1l-1.6-72.9c11.8-4.2,37.9-12.5,56.6-12.5c10,0,13,2.6,13.7,3.3c7.4,8.7,20.3,12.8,39.3,13c11.9,0.2,24.8-1.7,34.8-3.6v74.3C1754.1,578.4,1727.2,583.2,1708,583.2z'}, 3000)
            });
          }
          if(Snap('#FlagTopBorder')){
            Snap('#FlagTopBorder').animate({d: 'M1613,494.9c0,0,96.2-31.1,112.4-11.8c16.3,19.2,51.4,6.6,51.4,6.6v94c0,0-67.8,17.6-67.3-3c0.3-17-94.4,5.9-94.4,5.9L1613,494.9z'}, 3000, ()=>{
              Snap('#FlagTopBorder').animate({d:'M1613,494.9c0,0,71.2-28.1,87.4-8.8c16.3,19.2,76.4,3.6,76.4,3.6v94c0,0-92.8,20.6-92.3,0c0.3-17-69.4,2.9-69.4,2.9L1613,494.9z'},3000,()=>flagWave());
            });
          }
        }

        //Animate Circle
        blCircle.attr({
          strokeWidth: 2,
          "stroke-opacity": 0.5,
          "stroke-dasharray": 5000,
          "strokeDashoffset": 0
        });
        Snap.animate(5000,0, function( value ){
               blCircle.attr({ 'strokeDashoffset': value })
        },3000)



        $("#blAstronaut").click();

      });
    addClickMe(()=>{
        loadPopUp();
    });
  }
  function loadCourses(){
    appendSvg(dataCourses, ()=>{
        var crCircle = Snap('#crCircle');
        var crGround = Snap('#crGround');
        var crBoard = Snap('#crBoard');
        var crAstronautTeacher = Snap('#crAstronautTeacher');
        var crHand = Snap('#crHand');
        var crTitle = Snap('#crTitle');
        var crDescription = Snap('#crDescription');

        var titlePos = crTitle.transform().string;
        var descritionPos = crDescription.transform().string;

        crGround.attr({transform: 'scale(0,0)', "transform-origin": '100% 100%'});
        crTitle.attr({transform:'scale(0,0)', "transform-origin": '50% 0'});
        crDescription.attr({transform:'scale(0,0)', "transform-origin": '50% 0'});
        crAstronautTeacher.attr({transform:'scale(0,0)', "transform-origin": '50% 50%'});
        crBoard.attr({transform:'scale(0,0)', "transform-origin": '100% 50%'});

        crGround.animate({transform: 'scale(1,1)'}, 400, mina.backout, ()=>{
          crTitle.animate({transform: `s1,1${titlePos}`}, 400, mina.elastic, ()=>{
            crDescription.animate({transform: `s1,1${descritionPos}`}, 400, mina.elastic, ()=>{
              crAstronautTeacher.animate({transform: 'scale(1,1)'}, 400, mina.backout, ()=>{
                crBoard.animate({transform: 'scale(1,1)'}, 400, mina.elastic, ()=>{
                    handMoveUp();
                });
              });
            });
          });
        });


        //Animate Circle
        crCircle.attr({
          strokeWidth: 2,
          "stroke-opacity": 0.5,
          "stroke-dasharray": 5000,
          "strokeDashoffset": 0
        });
        Snap.animate(5000,0, function( value ){
               crCircle.attr({ 'strokeDashoffset': value })
        },3000)

        function handMoveUp(){
          if($('#crHand').css("transform-origin")){
            $('#crHand').css("transform-origin",`${crHand.getBBox().x}px ${crHand.getBBox().y + crHand.getBBox().height-40}px`);
            Snap.animate(0, -20, function(value){
              $('#crHand').css('transform', `rotate(${value}deg)`)
            }, 5000, mina.easeinout, ()=>handMoveDown());
          }
        }

        function handMoveDown(){
          if($('#crHand').css("transform-origin")){
            Snap.animate(-20, 0, function(value){
              $('#crHand').css('transform', `rotate(${value}deg)`)
            }, 5000, mina.easeinout, ()=>handMoveUp())
          }
        }
      });
    addClickMe(()=>{
      loadPopUp();
    });
  }
  function loadPopUp(){
    $('.btn-icon-clickme').remove();
    $('.btn-icon-close').hide();
    Snap.load("svg/popUpSorry.svg", (data)=>{
      dataCourses = $('#svgContainer').find('svg').detach();
      snap.append(data);
      orientationCheck();
      match = Number(document.getElementById('popUp').style.transform.replace(/scale\(|,|\)/gi, '')[0]);
      Snap.animate(0, match, function(value){
        $('#popUp').css({ transform:`scale(${value},${value})`});
      }, 500, mina.backout, ()=>{
        $('#returnBack').click(()=>{
          zoomCameraBack();
        })
        $('#returnBack').hover(()=>{
          console.log('hover');
          $('#returnBack').attr('cursor', 'pointer');
        }, ()=>{
          $('#returnBack').attr('cursor', 'default');
        });
      });

    });
  }
  function loadProjects(){
    appendSvg(dataPrjects, ()=>{
        //animate and declare Smoke
        prWhiteSmoke = snap.select('#prWhiteSmoke');
        var prWhiteSmokeh = prWhiteSmoke.getBBox().height;
        prWhiteSmoke.transform(`t0,${prWhiteSmokeh}`);
        prWhiteSmoke.animate({transform: 't0,0'}, 1000)

        var smokeOne = Snap.select("#SmokeOne");
        var smokeTwo = Snap.select("#SmokeTwo");
        var smokeThree = Snap.select("#SmokeThree");

        prWhiteSmoke.attr({opacity: '0'});
        smokeOne.attr({opacity: '0'});
        smokeTwo.attr({opacity: '0'});
        smokeThree.attr({opacity: '0'});

        //Animate Title
        var titlePos = Snap.select('#prTitle').transform().string;
        Snap.select('#prTitle').transform(`s0,0${titlePos}`);


        //Animate Description
        var descPos = Snap.select('#prDescription').transform().string;
        Snap.select('#prDescription').transform(`s0,0${descPos}`);


        //Animate Planet
        Snap.select('#prSaturnPlanet').transform(`s0,0`);
        Snap.select('#prSaturnPlanet').animate({transform: 's1,1'}, 500, mina.backout);

        //Animate shuttle
        var rightTurbin = Snap.select('#rightTurbin').transform().string;
        Snap.select('#rightTurbin').transform(`s0,0${rightTurbin}`);

        var leftTurbin = Snap.select('#leftTurbin').transform().string;
        Snap.select('#leftTurbin').transform(`s0,0${leftTurbin}`);

        var mainTurbin = Snap.select('#mainTurbin').transform().string;
        Snap.select('#mainTurbin').transform(`s0,0${mainTurbin}`);

        var rocket = Snap.select('#rocket').transform().string;
        Snap.select('#rocket').transform(`s0,0${rocket}`);


        //Shuttle animation order
        Snap.select('#rightTurbin').animate({transform: `s1,1${rightTurbin}`}, 400, mina.elastic, ()=>{
          Snap.select('#leftTurbin').animate({transform: `s1,1${leftTurbin}`}, 400, mina.elastic, ()=>{
            Snap.select('#mainTurbin').animate({transform: `s1,1${mainTurbin}`}, 400, mina.elastic, ()=>{
              Snap.select('#rocket').animate({transform: `s1,1${rocket}`}, 400, mina.elastic,()=>{
                Snap.select('#prDescription').animate({transform: `s1,1${descPos}`}, 400, mina.elastic);
                Snap.select('#prTitle').animate({transform: `s1,1${titlePos}`}, 400, mina.elastic);
              });
            });
          });
        });

        //Animate Circle
        Snap.select('#prCircle').attr({
          strokeWidth: 2, // CamelCase...
          "stroke-opacity": 0.5, // or dash-separated names
          "stroke-dasharray": 5000,
          "strokeDashoffset": 0
        });
        Snap.animate(5000,0, function( value ){
               Snap.select('#prCircle').attr({ 'strokeDashoffset': value })
        },3000, ()=>{
          shuttleDown();
          whiteSmokeDown();
          smokeOneUp();
          smokeTwoUp();
          smokeThreeUp();
        });

        //shuttle loop move animation
        var shuttle = Snap.select("#prShuttle");

        function shuttleUp(){
            shuttle.animate({
              transform: 'translate(0,0)',
            }, 2000, mina.easeinout, ()=>{
              shuttleDown();
              whiteSmokeDown();
              smokeOneUp();
              smokeTwoUp();
              smokeThreeUp();
            });
        }

        function shuttleDown() {
          shuttle.animate({
              transform: 'translate(0,30)',
           }, 2000, mina.easeinout, ()=>{
             shuttleUp();
             whiteSmokeUp();
             smokeOneDown();
             smokeTwoDown();
             smokeThreeDown();
           });
        };


        function smokeOneUp(){
          smokeOne.animate({
            transform: 'translate(0,-10)',
            opacity: '1'
          }, 2000, mina.easeinout);
        }

        function smokeOneDown() {
          smokeOne.animate({
              transform: 'translate(15,0)',
              opacity: '-0.5'
           }, 2000, mina.easeinout);
        };


        function smokeTwoUp(){
          smokeTwo.animate({
            transform: 'translate(0,-20)',
            opacity: '1'
          }, 2000, mina.easeinout);
        }

        function smokeTwoDown() {
          smokeTwo.animate({
              transform: 'translate(-30,0)',
              opacity: '-0.5'
           }, 2000, mina.easeinout);
        };

        function smokeThreeUp(){
          smokeThree.animate({
            transform: 'translate(0,-50)',
            opacity: '0.5'
          }, 2000, mina.easeinout);
        }

        function smokeThreeDown() {
          smokeThree.animate({
              transform: 'translate(0,0)',
              opacity: '-0.5'
           }, 2000, mina.easeinout);
        };

        function whiteSmokeUp(){
          prWhiteSmoke.animate({
              transform: 'translate(0,0)',
              opacity: '0'
           }, 1500, mina.easeinout);
        }

        function whiteSmokeDown(){
          prWhiteSmoke.animate({
              transform: 'translate(0,20)',
              opacity: '0.5'
           }, 1500, mina.easeinout);
        }

    });
    addClickMe(()=>{
      // $('#body').show();
      // $('#body').css('background-image', `linear-gradient(60deg, #29323c 0%, #485563 100%)`);
      window.location.hash = 'projects';
      // Snap.animate(0, 1, (value)=>{
      //   $('#body').css('opacity', `${value}`);
      // }, 500, mina.easeinout)
    });
  }

  function addMenu(){
    var sidebar = $('.sidebar').css('display', 'block');
    let pos = width - sidebar.width();
    sidebar.css('left', `${width}px`);
    Snap.animate(width, pos, (value)=>{
      sidebar.css('left', `${value}px`)
    }, 500, mina.easeinout, ()=>{
      $(".btn-icon-about").click(function(){
        $('.sidebar').hide();
        cameraMoveToObj(flags[0].view,()=>loadAbout());
      });

      $(".btn-icon-blog").click(function(){
        $('.sidebar').hide();
        cameraMoveToObj(flags[1].view, ()=>loadBlog());
      });

      $(".btn-icon-experiments").click(function(){
        $('.sidebar').hide();
        cameraMoveToObj(flags[2].view, ()=>loadExperiments());
      })

      $(".btn-icon-courses").click(function(){
        $('.sidebar').hide();
        cameraMoveToObj(flags[3].view, ()=>loadCourses());
      })

      $(".btn-icon-projects").click(function(){
        $('.sidebar').hide();
        cameraMoveToObj(flags[4].view, ()=>loadProjects());
      })
    });

  }



  // function addBody(){
  //   return new Promise(function(resolve, reject)=>{
  //     $('#body').show();
  //     $('#body').css('background-color', '#80808000');
  //     Snap.animate(0, 1, (value)=>{
  //       $('#body').css('background-color', `rgb(128,128,128,${value})`)
  //     }, 500, mina.easeinout);
  //   });
  // }


  function addClickMe(callback){
    let button = document.createElement('div');
    $(button).html('Click me!')
    $(button).addClass('btn-icon-clickme');
    $(button).click(()=>{
      callback();
    })
    $('body').append(button);

  }
};
