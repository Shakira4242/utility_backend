async function validator(license_key){
  try{
    const response = await fetch('/validator?license_key=' + license_key);
    if(response.status == '200'){
      return true
    }else{
      return false
    }
  }catch(error){
    return false
  }
}

async function get_model(url){
  try{
    const response = await fetch('/model?url=' + url);
    const json_response = await response.json();
    return json_response;
  }catch(error){
    return false;
  }
}

function downloadURI(uri, name) 
{
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

window.addEventListener("load", function () {
  console.log(document.querySelector("#showMenu"));

  document
    .querySelector("#preview")
    .addEventListener("click", function(event) {
      const url = document.querySelector("#preview_url").value;
      const license_key = document.querySelector("#license_key").value;

      (async() => {
        const valid = await validator(license_key);

        if(valid){
          const model_url = await get_model(url);
          console.log(model_url)
          if(model_url){
            BabylonViewer.viewerManager.getViewerPromiseById('model_preview').then(function (viewer) {
              viewer.loadModel({
                url: model_url
              });
            });
          }
        }
      })()
    }
  );

  document
    .querySelector("#download")
    .addEventListener("click", function(event) {
      const url = document.querySelector("#preview_url").value;
      const license_key = document.querySelector("#license_key").value;

      (async() => {
        const valid = await validator(license_key);

        if(valid){
          const model_url = await get_model(url);
          downloadURI(model_url,'')
        }
      })()

    }
  );

  document
    .querySelector("#showMenu")
    .addEventListener("click", function (event) {
      document.querySelector("#mobileNav").classList.remove("hidden");
    });

  document
    .querySelector("#hideMenu")
    .addEventListener("click", function (event) {
      document.querySelector("#mobileNav").classList.add("hidden");
    });

  document.querySelectorAll("[toggleElement]").forEach((toggle) => {
    toggle.addEventListener("click", function (event) {
      console.log(toggle);
      const answerElement = toggle.querySelector("[answer]");
      const caretElement = toggle.querySelector("img");
      console.log(answerElement);
      if (answerElement.classList.contains("hidden")) {
        answerElement.classList.remove("hidden");
        caretElement.classList.add("rotate-90");
      } else {
        answerElement.classList.add("hidden");
        caretElement.classList.remove("rotate-90");
      }
    });
  });
});
