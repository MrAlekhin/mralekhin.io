function loadBody(){
  if(document.getElementById('body')){
    let body = $('#body');
    if(!body.is(':visible')){
      //$('body').append('<script type="text/javascript" src="//platform-api.sharethis.com/js/sharethis.js#property=5aefaf8e96e6fc00110b311d&product=sticky-share-buttons"></script>');
      body.show();
      body.css('background-image', `linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)`);
      Snap.animate(0, 1, (value)=>{
        body.css('opacity', `${value}`);
      }, 500, mina.easeinout);
    }
  }
}

function loadProjects(data){
  return new Promise(function(resolve, reject){
    if(document.getElementById('body')){
      let body = $('#body');
      let tags = '';
      body.append('<h1>Projects</h1>');
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
          <div class="projectDetail">
            <div class="my-slider">
              <ul>
                ${screenshots}
              </ul>
            </div>
            <article>
            ${project.content}
            </article>
          </div>`);

      	$('.my-slider').unslider({
          autoplay: true,
          arrows: false
        });
        screenshots = '';
      }
  });
}
