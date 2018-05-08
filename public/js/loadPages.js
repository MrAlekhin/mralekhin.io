let loadBody = function(){
  return new Promise(function(resolve, reject){
    if(document.getElementById('body')){
      let body = $('#body');
      if(!body.is(':visible')){
        body.show();
        body.css('background-image', `linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)`);
        Snap.animate(0, 1, (value)=>{
          body.css('opacity', `${value}`);
        }, 500, mina.easeinout, ()=>resolve);
      }
    }
  });
}

function loadProjects(data){
  return new Promise(function(resolve, reject){
    if(document.getElementById('body')){
      let body = $('#body');
      let tags = '';
      body.append('<h1>Projects</h1><a href="#/" class="btn-icon-back"></a>');
      const projects = data.projects;
      for(let i =0; i < projects.length; i++){
        for (let j = 0; j < projects[i].tags.length; j++) {
          tags+=`<span>${projects[i].tags[j].tag}</span>`;
        }
        body.append(
          `<div class="project">
            <div class="project-window">
              <a href="#/projects/${projects[i]._id}" class="image" style="background-image: url(${projects[i].image})"></a>
            </div>
            <h3>${projects[i].projectName}</h3>
            ${tags}
          </div>`);
        tags = '';
      }
    }
  });
}

function loadProject(data){
  return new Promise(function(resolve, reject){
      if(document.getElementById('body')){
        let body = $('#body');
        let screenshots = '';
        const project = data.project;
        for(let i=0; i<project.screenshots.length; i++){
          screenshots += `<li><img src="${project.screenshots[i]}"></li>`
        }
        body.append(
          `<h1>${project.projectName}</h1>
          <h4>${project.shortDescription}</h4>
          <a href="/#/projects" class="btn-icon-back"></a>
          <div class="projectDetail">
            <div class="my-slider">
              <ul>
                ${screenshots}
              </ul>
            </div>
            ${project.content}
          </div>`);

      	$('.my-slider').unslider({
          autoplay: true,
          arrows: false
        });
        screenshots = '';
        resolve;
      }
  });
}

function loadSVG(url){
  return new Promise(function(resolve, reject) {
    Snap.load(url, resolve);
  });
}

function addSVG(data){
  return new Promise(function(resolve, reject){
      if(document.getElementById('body')){
        let snap = Snap('#body');
        let data;
        if(window.innerWidth<window.innerHeight){
          data = loadSVG("svg/AboutMeMobile.svg");
        }else{
          data = loadSVG("svg/AboutMe-01.svg");
        }
        data.then((res)=>{snap.append(res)}).then(()=>{
          $(document).ready(()=>{
            $('#resume').click(()=>{
              window.open('resume.pdf')
            });
            $('#resume').find('text').click(()=>{
              window.open('resume.pdf')
            });
          });
        });

      }
  });
}

function removeLds(){
  $('.lds-eclipse').remove();
}

// function addIsd(){
//   return new Promise(function(resolve, reject){
//     $(body).append('<div class="lds-eclipse"><div></div></div>');
//   });
// }
