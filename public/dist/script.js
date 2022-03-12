window.addEventListener("load", function () {
  console.log(document.querySelector("#showMenu"));

  document
    .querySelector("#preview")
    .addEventListener("click", function(event) {
      const url = document.querySelector("#preview_url").value;

      let response_url = null;

      (async() => {
        const response = await fetch('/model?url=' + url);
        const model_url = await response.json();
        BabylonViewer.viewerManager.getViewerPromiseById('model_preview').then(function (viewer) {
          viewer.loadModel({
            url: model_url
          });
        });
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
