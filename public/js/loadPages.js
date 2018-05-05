function loadProjects(data){
  return new Promise(function(resolve, reject){
    $('#body').append('<h1>Projects</h1>');
    if(document.getElementById('body')){
      let body = $('#body');
      let tags = '';
      const projects = data.projects;
      for(let i =0; i < projects.length; i++){
        for (let j = 0; j < projects[i].tags.length; j++) {
          tags+=`<span>${projects[i].tags[j].tag}</span>`;
        }
        body.append(
          `<div class="project">
            <div class="project-window">
              <div class="image" style="background-image: url(${projects[i].image})"></div>
            </div>
            <h3>${projects[i].projectName}</h3>
            ${tags}
            <hr>
          </div>`);
        tags = '';
      }
    }
  });
}
