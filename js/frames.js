// projection
let screen;

// two frames
let screenframe, textframe;
let screen_articles, local_articles;

let is_started = false;

let idx = 0;
let isfullscreen = false;
let displaygrid = false;

let talk_mode = false;


window.onload = (event) => {

  screenframe = window.frames[0];
  textframe = window.frames[1];

  (function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
      textframe.init();
    };
    script.src = 'js/text.js';
    textframe.document.body.appendChild(script) 
  }(document));


  if(talk_mode){

  }
  
  screen = window.open('slides.html', screen, "_blank");
  screen.onload = function() {
    screen_articles = screen.document.documentElement.querySelectorAll('article');
    local_articles = screenframe.document.querySelectorAll('article');
    local_articles.forEach(function(article){
      initGridActions(article);
    })

    // rafraichissement de page
    if(window.location.hash) {
      var el = screenframe.document.querySelector(window.location.hash)
      idx = Array.prototype.indexOf.call(local_articles, el) - 1;
      console.log("hash idx = " + idx);
      changeSlide('right');
    }
  }

  // Allow window to listen for a postMessage
	window.addEventListener("message", (event)=>{
    // Normally you would check event.origin
    // console.log(event.data.action);
    switch (event.data.action) {
      case "right":
        changeSlide("right");
        break;
      case "left":
        changeSlide("left");
        break;
      case "start":
        start();
        break;
      case "toggleGrid":
        toggleGrid();
        break;
    }
  });



  // start
  function start(){
    var bar = textframe.document.querySelector('#bar');
    if(bar){
      is_started = true;
		  bar.classList.add('animated');
    }
  }

	// changement de slide
	function changeSlide(direction){

    if(!is_started){
      start();
    }
    // quelle direction ?
    if (direction == 'right') {
      idx = idx == local_articles.length - 1 ? 0 : idx + 1;
    } else {
      idx = idx == 0 ? local_articles.length - 1 : idx - 1;
    }
    local_articles.forEach(function(el, index){
      doChangeSlide(el, index);
    })
    screen_articles.forEach(function(el, index){
      doChangeSlide(el, index);
    })

    let pilcrow = textframe.document.querySelector("#pilcrow-" + parseInt(idx - 1));
    // debug:
    // console.log(pilcrow);
    if(pilcrow){
      pilcrow.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }



  // toggle grid
	function toggleGrid() {
		let body = screenframe.document.body;
  	if (!displaygrid) {
    	body.classList.add('grid')
			displaygrid = true;
  	} else {
    	body.classList.remove('grid')
			displaygrid = false;
  	}
	}

	// grid actions
  function initGridActions(article){
		article.addEventListener('click', () => {
			if(displaygrid == true) {
				screenframe.document.querySelector('.visible').classList.remove("visible");
				article.classList.add('visible');
				idx = parseInt(article.dataset.id) - 1;
				changeSlide("right")
				toggleGrid();
			}
		})
	}


  function doChangeSlide(el, index){

      // Si c’est la slide qu’on veut afficher
      if (index == idx) {
        el.classList.add('visible');

        // change le “hash” dans l’URL
        history.pushState(null, el.id, '#' + el.id);

        // auto build iframes
        let embed = el.querySelectorAll('.embed')[0] || null
        if (embed !== null) {
          let iframe = document.createElement('iframe');
          iframe.src = embed.getAttribute('rel');
          iframe.setAttribute('width', 854);
          iframe.setAttribute('autoplay', 'true');
          iframe.setAttribute('height', 480);
          iframe.setAttribute('frameborder', 0);
          embed.appendChild(iframe);
          embed.className = 'embedded';
          // iframe.contentWindow.addEventListener('keydown', function(e){ 
          //   bindKeys(e)
          // }, true);
        }

        // autoplay videos
        let video = el.querySelectorAll('video')[0] || null;
        if (video) {
          
          if(video.dataset.start){
            // console.log(parseInt(video.dataset.start));
            // video.addEventListener("loadedmetadata", function() { }, false);
            video.currentTime = parseInt(video.dataset.start);
            
            setTimeout(() => {
              // sosorry
              video.play();
            }, 100);
          } else {
            video.play();
          }
        }
      }
      // Sinon
      else {
        el.classList.remove('visible');

        // auto destroy iframes
        let embedded = el.querySelectorAll('.embedded')[0] || null
        if (embedded !== null) {
          let iframe = embedded.querySelectorAll('iframe')[0];
          embedded.setAttribute('rel', iframe.src);
          embedded.removeChild(iframe);
          embedded.className = 'embed';
        }

        // pause videos
        let video = el.querySelectorAll('video')[0] || null;
        if (video) video.pause();
      }
  }

};