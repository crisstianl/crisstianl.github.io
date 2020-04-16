/* JQuery */
(function($) {

	// variables
	var	$window = $(window),
		$body = $('body'),
		$main = $('#main'),
		$form = $('form'),
		$menu = $('#menu');

	// Breakpoints.
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px' ],
		medium:   [ '737px',   '980px'  ],
		small:    [ '481px',   '736px'  ],
		xsmall:   [ '361px',   '480px'  ],
		xxsmall:  [ null,      '360px'  ]
	});

	// initialization
	$window.on('load', function() {
		// Play initial animations on page load.
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);

		on_load();
	});

	// Touch?
	if (browser.mobile) {
		$body.addClass('is-touch');
	}

	// Auto-resizing textareas.
	$form.find('textarea').each(function() {
		var $this = $(this),
			$wrapper = $('<div class="textarea-wrapper"></div>'),
			$submits = $this.find('input[type="submit"]');

		$this.wrap($wrapper)
			.attr('rows', 1)
			.css('overflow', 'hidden')
			.css('resize', 'none')
			.on('keydown', function(event) {
				if (event.keyCode == 13 && event.ctrlKey) {
					event.preventDefault();
					event.stopPropagation();
					$(this).blur();
				}

			}).on('blur focus', function() {
				$this.val($.trim($this.val()));

			}).on('input blur focus --init', function() {
				$wrapper.css('height', $this.height());
				$this.css('height', 'auto').css('height', $this.prop('scrollHeight') + 'px');

			}).on('keyup', function(event) {
				if (event.keyCode == 9) {
					$this.select();
				}

			}).triggerHandler('--init');

		// Fix.
		if (browser.name == 'ie' || browser.mobile) {
			$this.css('max-height', '10em').css('overflow-y', 'auto');
		}
	});

	// Menu functions
	$menu.wrapInner('<div class="inner"></div>');
	$menu._locked = false;
	$menu._lock = function() {
		if ($menu._locked) {
			return false;
		}

		$menu._locked = true;

		window.setTimeout(function() {
			$menu._locked = false;
		}, 350);

		return true;
	};

	$menu._show = function() {
		if ($menu._lock()) 
			$body.addClass('is-menu-visible');
	};

	$menu._hide = function() {
		if ($menu._lock())
			$body.removeClass('is-menu-visible');
	};

	$menu._toggle = function() {
		if ($menu._lock())
			$body.toggleClass('is-menu-visible');
	};

	$menu.appendTo($body)
		.on('click', function(event) {
			event.stopPropagation();

		}).on('click', 'a', function(event) {
			var href = $(this).attr('href');

			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$menu._hide();

			// Redirect.
			if (href == '#menu')
				return;

			window.setTimeout(function() {
				window.location.href = href;
			}, 350);

		}).append('<a class="close" href="#menu">Close</a>');

	// body functions
	$body.on('click', 'a[href="#menu"]', function(event) {
			event.stopPropagation();
			event.preventDefault();

			// Toggle.
			$menu._toggle();

		}).on('click', function(event) {
			$menu._hide();

		}).on('keydown', function(event) {
			// Hide on escape.
			if (event.keyCode == 27) {
				$menu._hide();
			}
		});

	// Poptrox.
	$body.poptrox({
		baseZIndex: 20000,
		album: 'article.item',
		selector: 'div.gallery > a',
		onPopupClose: function() { 
			$body.removeClass('modal-active');
		},
		onPopupOpen: function() { 
			$body.addClass('modal-active'); 
		},
		fadeSpeed: 300,
		overlayOpacity: 0,
		popupCloserText: '',
		popupLoaderText: '',
		popupSpeed: 300,
		popupWidth: 200,
		popupHeight: 150,
		usePopupCaption: true,
		usePopupCloser: true,
		usePopupDefaultStyling: false,
		usePopupForceClose: true,
		usePopupLoader: true,
		usePopupNav: true,
		windowMargin: 50
	});

	// Set margins to 0 when 'xsmall' activates.
	breakpoints.on('<=xsmall', function() {
		$body.poptrox.windowMargin = 0;
	});

	breakpoints.on('>xsmall', function() {
		$body.poptrox.windowMargin = 50;
	});

})(jQuery);

function on_load() {
	load_skills();
	load_profile();
}

function load_skills() {
	const container = document.getElementById('skills');
	for (let i = 0; i < SKILLS.length; i++) {
		const list = document.createElement("ul");
		container.appendChild(list);

		if (SKILLS[i].svg) { // icon
			const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			icon.setAttributeNS(null, "width", "24");
			icon.setAttributeNS(null, "heigth", "24");
			icon.setAttributeNS(null, "viewBox", SKILLS[i].svg.viewBox);
			list.appendChild(icon);
	
			if (SKILLS[i].svg.path) { // svg path
				for (let j = 0; j < SKILLS[i].svg.path.length; j++) {
					const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
					path.setAttributeNS(null, "d", SKILLS[i].svg.path[j].d);
					path.setAttributeNS(null, "fill", SKILLS[i].svg.path[j].fill);
					icon.appendChild(path);
				}
			}
		}

		for (let j = 0; j < SKILLS[i].stack.length; j++) {
			let item = document.createElement("li");
			item.innerHTML = SKILLS[i].stack[j];
			list.appendChild(item);
		}
	}
}

function load_profile() {
	const container = document.getElementById('projects'); 
	for (let i = 0; i < PROJECTS.length; i++) {
		let item = create_article(i, PROJECTS[i]);
		container.appendChild(item);
	}
}

function create_article(index, project) {
	// container
	const article = document.createElement("article");
	article.classList.add("item", "thumb", "style" + (index % 6 + 1));

	// background
	const span = document.createElement("span");
	span.className = "image";
	article.appendChild(span);

	const img = document.createElement("img");
	img.src = "assets/images/thumb.jpg";
	img.alt = "alt";
	span.appendChild(img);

	// content
	const link = document.createElement("a");
	link.className = "link";
	link.href = project.source;
	link.target = "_blank";
	article.appendChild(link);

	// title
	const h2 = document.createElement("h2");
	h2.innerHTML = project.name;
	link.appendChild(h2);

	// subtitle
	const div = document.createElement("div");
	div.className = "content";
	link.appendChild(div);

	const p1 = document.createElement("p");
	p1.innerHTML = project.description;
	div.appendChild(p1);

	const p2 = document.createElement("p");
	p2.innerHTML = "<i>" + project.stack + "</i>";
	div.appendChild(p2);

	// screenshots
	if (project.screenshots && project.screenshots.length > 0) {
		const div2 = document.createElement("div");
		div2.className = "gallery";
		article.appendChild(div2);

		for (let i = 0; i < project.screenshots.length; i++) {
			const screenLink = document.createElement("a");
			screenLink.href = project.screenshots[i];
			screenLink.title = project.name + " " + (i + 1) + " / " + project.screenshots.length;
			div2.appendChild(screenLink);
		}
	}

	return article;
}

/* Make Ajax request to email server */
function do_email(form) {
	const payload = {
		key : "",
		subject : "Github contact form",
		from : form['name'].value,
		from_address : form['email'].value,
		message : form['message'].value
	};

	const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhttp.timeout = 3000;
	xhttp.onreadystatechange = function() {
		if (4 == this.readyState) {
			console.log("server do_email() returned " + this.status + ": " + this.statusText);
		}
	};
	xhttp.open("POST", "https://mandrillapp.com/api/1.0/messages/send.json", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(payload));
	return false;
}