
	let idx = 0;
	let isfullscreen = false;


	const articles = document.querySelectorAll('article');


	function bindKeys(e){
			var p = parent || window.opener;
			console.log(p);
			if(e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "Enter") e.preventDefault();
			if (e.key == "ArrowLeft") {
				p.postMessage({
					'action' : "left"
				}, "*")
			}
			if (e.key == "ArrowRight") {
				p.postMessage({
					'action' : "right"
				}, "*")
			}
			if (e.key == "Enter") {
				p.postMessage({
					'action' : "start"
				}, "*")
			}
			if (e.key == "Escape") {
				p.postMessage({
					'action' : "toggleGrid"
				}, "*")
			}
	
	}

	// navigation au clavier (flèches directionelles)
	document.body.onkeydown = function(e){
		bindKeys(e)
	};

	// affichage du premier article
	articles[0].classList.add('visible');

	// attribution d’un id à chaque article
	articles.forEach(function(el, index, array){
		el.id = "article-" + idx;
		el.dataset.id = idx;
		idx++
	})

	// insert runningtitle + id dans chaque header
	var headers = document.querySelectorAll("article header:not(.opening)");
	headers.forEach((h,idx) => {
		var span = document.createElement('span');
		span.innerHTML = runningtitle;
		h.prepend(span);
		var i = document.createElement('span');
		span.appendChild(i);
		// i.textContent = " " + (idx + 1) + "/" + articles.length;
	});


	document.body.ondblclick = function(e){
		toggleFullScreen();
	};

	function toggleFullScreen() {
  	if (!document.fullscreenElement) {
    	document.documentElement.requestFullscreen();
			isfullscreen = true;
  	} else {
    	if (document.exitFullscreen) {
      		document.exitFullscreen();
					isfullscreen = false;
    	}
  	}
	}

	// changement de slide
	function changeSlide(direction){

	  	// quelle direction ?
	  	if (direction == 'right') {
	  		idx = idx == articles.length - 1 ? 0 : idx + 1;
	  	} else {
	  		idx = idx == 0 ? articles.length - 1 : idx - 1;
	  	}

      // console.log('index: ' + idx);

	  	articles.forEach(function(el, index, array){

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
						iframe.contentWindow.addEventListener('keydown', function(e){ 
							bindKeys(e)
						}, true);
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
	  	})
	}
