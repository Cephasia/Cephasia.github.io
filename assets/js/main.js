/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license
	(html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px' ],
		medium:   [ '737px',   '980px'  ],
		small:    [ '481px',   '736px'  ],
		xsmall:   [ '361px',   '480px'  ],
		xxsmall:  [ null,      '360px'  ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {

		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);

	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == 'ie') {

		var flexboxFixTimeoutId;

		$window.on('resize.flexbox-fix', function() {

			clearTimeout(flexboxFixTimeoutId);

			flexboxFixTimeoutId = setTimeout(function() {

				if ($wrapper.prop('scrollHeight') > $window.height())
					$wrapper.css('height', 'auto');
				else
					$wrapper.css('height', '100vh');

			}, 250);

		}).triggerHandler('resize.flexbox-fix');

	}

	// Nav.
	var $nav = $header.children('nav'),
		$nav_li = $nav.find('li');

	// Add "middle" alignment classes if we're dealing with an even number of items.
	if ($nav_li.length % 2 == 0) {

		$nav.addClass('use-middle');
		$nav_li.eq(($nav_li.length / 2)).addClass('is-middle');

	}

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	$main._show = function(id, initial) {

		var $article = $main_articles.filter('#' + id);

		// No such article? Bail.
		if ($article.length == 0)
			return;

		// Handle lock.
		if (locked || (typeof initial != 'undefined' && initial === true)) {

			$body.addClass('is-switching');
			$body.addClass('is-article-visible');

			$main_articles.removeClass('active');

			$header.hide();
			$footer.hide();

			$main.show();
			$article.show();

			$article.addClass('active');

			locked = false;

			setTimeout(function() {
				$body.removeClass('is-switching');
			}, (initial ? 1000 : 0));

			return;

		}

		// Lock.
		locked = true;

		// Article already visible? Just swap articles.
		if ($body.hasClass('is-article-visible')) {

			var $currentArticle = $main_articles.filter('.active');

			$currentArticle.removeClass('active');

			setTimeout(function() {

				$currentArticle.hide();

				$article.show();

				setTimeout(function() {

					$article.addClass('active');

					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					setTimeout(function() {
						locked = false;
					}, delay);

				}, 25);

			}, delay);

		}

		// Otherwise, handle as normal.
		else {

			$body.addClass('is-article-visible');

			setTimeout(function() {

				$header.hide();
				$footer.hide();

				$main.show();
				$article.show();

				setTimeout(function() {

					$article.addClass('active');

					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					setTimeout(function() {
						locked = false;
					}, delay);

				}, 25);

			}, delay);

		}

	};

	$main._hide = function(addState) {

		var $article = $main_articles.filter('.active');

		// Article not visible? Bail.
		if (!$body.hasClass('is-article-visible'))
			return;

		// Add state?
		if (typeof addState != 'undefined' && addState === true)
			history.pushState(null, null, '#');

		// Handle lock.
		if (locked) {

			$body.addClass('is-switching');

			$article.removeClass('active');

			$article.hide();
			$main.hide();

			$footer.show();
			$header.show();

			$body.removeClass('is-article-visible');

			locked = false;

			$body.removeClass('is-switching');

			$window
				.scrollTop(0)
				.triggerHandler('resize.flexbox-fix');

			return;

		}

		// Lock.
		locked = true;

		$article.removeClass('active');

		setTimeout(function() {

			$article.hide();
			$main.hide();

			$footer.show();
			$header.show();

			setTimeout(function() {

				$body.removeClass('is-article-visible');

				$window
					.scrollTop(0)
					.triggerHandler('resize.flexbox-fix');

				setTimeout(function() {
					locked = false;
				}, delay);

			}, 25);

		}, delay);

	};

	// Articles.
	$main_articles.each(function() {

		var $this = $(this);

		// Close.
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on('click', function() {
				location.hash = '';
			});

		// Prevent clicks from inside article from bubbling.
		$this.on('click', function(event) {
			event.stopPropagation();
		});

	});

	// Events.
	$body.on('click', function() {

		if ($body.hasClass('is-article-visible'))
			$main._hide(true);

	});

	$window.on('keyup', function(event) {

		if (event.key === 'Escape') {

			if ($body.hasClass('is-article-visible'))
				$main._hide(true);

		}

	});

	$window.on('hashchange', function(event) {

		if (location.hash == '' || location.hash == '#') {

			event.preventDefault();
			event.stopPropagation();

			$main._hide();

		}

		else if ($main_articles.filter(location.hash).length > 0) {

			event.preventDefault();
			event.stopPropagation();

			$main._show(location.hash.substr(1));

		}

	});

	// Scroll restoration.
	if ('scrollRestoration' in history)
		history.scrollRestoration = 'manual';

	else {

		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $('html,body');

		$window
			.on('scroll', function() {

				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();

			})
			.on('hashchange', function() {

				$window.scrollTop(oldScrollPos);

			});

	}

	// Initialize.
	$main.hide();
	$main_articles.hide();

	if (location.hash != '' && location.hash != '#') {

		$window.on('load', function() {
			$main._show(location.hash.substr(1), true);
		});

	}

})(jQuery);


/* =========================================================
   THEME SYSTEM
   ========================================================= */

(function() {

    var themeToggle = document.getElementById('theme-toggle');

    if (!themeToggle)
        return;

    var storageKey = 'cephasia-theme';

    function getSystemTheme() {

        return window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';

    }

    function getSavedTheme() {

        try {
            return localStorage.getItem(storageKey);
        }
        catch (error) {
            return null;
        }

    }

    function saveTheme(theme) {

        try {
            localStorage.setItem(storageKey, theme);
        }
        catch (error) {
            // Storage may be unavailable.
        }

    }

    function updateToggle(theme) {

        var isLight = theme === 'light';

        themeToggle.setAttribute(
            'aria-label',
            isLight ? 'Switch to dark mode' : 'Switch to light mode'
        );

        themeToggle.setAttribute(
            'title',
            isLight ? 'Switch to dark mode' : 'Switch to light mode'
        );

        themeToggle.setAttribute(
            'aria-pressed',
            isLight ? 'true' : 'false'
        );

        var icon = themeToggle.querySelector('.theme-toggle-icon');

        if (icon) {
            icon.textContent = isLight ? '☾' : '☀';
        }

    }

    function applyTheme(theme, save) {

        /*
         * IMPORTANT:
         * The CSS uses html[data-theme="light"].
         * Therefore the JavaScript must update the
         * HTML element, not the body class.
         */

        document.documentElement.setAttribute(
            'data-theme',
            theme
        );

        updateToggle(theme);

        if (save)
            saveTheme(theme);

    }

    var savedTheme = getSavedTheme();

    var initialTheme = savedTheme || getSystemTheme();

    applyTheme(initialTheme, false);


    /* Theme button */

    themeToggle.addEventListener('click', function(event) {

        event.preventDefault();
        event.stopPropagation();

        var currentTheme =
            document.documentElement.getAttribute('data-theme') ||
            'dark';

        var newTheme =
            currentTheme === 'light'
                ? 'dark'
                : 'light';

        applyTheme(newTheme, true);

    });


    /* Follow system theme if user has not chosen manually */

    if (window.matchMedia) {

        var mediaQuery = window.matchMedia(
            '(prefers-color-scheme: light)'
        );

        var handleSystemThemeChange = function(event) {

            if (!getSavedTheme()) {

                applyTheme(
                    event.matches ? 'light' : 'dark',
                    false
                );

            }

        };

        if (mediaQuery.addEventListener) {

            mediaQuery.addEventListener(
                'change',
                handleSystemThemeChange
            );

        }
        else if (mediaQuery.addListener) {

            mediaQuery.addListener(
                handleSystemThemeChange
            );

        }

    }

})();


/* =========================================================
   PROJECT IMAGE GALLERY CONTROLS
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

	document.querySelectorAll('.full-project-card').forEach(function(project) {

		var gallery = project.querySelector('.project-gallery');
		var nextButton = project.querySelector('.gallery-next');
		var prevButton = project.querySelector('.gallery-prev');

		if (!gallery || !nextButton || !prevButton)
			return;

		nextButton.addEventListener('click', function(event) {

			event.preventDefault();
			event.stopPropagation();

			gallery.scrollBy({
				left: gallery.clientWidth * 0.85,
				behavior: 'smooth'
			});

		});

		prevButton.addEventListener('click', function(event) {

			event.preventDefault();
			event.stopPropagation();

			gallery.scrollBy({
				left: -gallery.clientWidth * 0.85,
				behavior: 'smooth'
			});

		});

	});

});


/* =========================================================
   PROJECT IMAGE LIGHTBOX
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

	var lightbox = document.createElement('div');
	lightbox.className = 'project-lightbox';

	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-modal', 'true');
	lightbox.setAttribute('aria-label', 'Project image preview');

	var closeButton = document.createElement('button');

	closeButton.className = 'lightbox-close';
	closeButton.innerHTML = '&times;';
	closeButton.setAttribute('aria-label', 'Close image preview');
	closeButton.setAttribute('type', 'button');

	var lightboxImage = document.createElement('img');

	lightboxImage.alt = '';

	lightbox.appendChild(closeButton);
	lightbox.appendChild(lightboxImage);

	document.body.appendChild(lightbox);

	var currentProject = null;
	var previousFocusedElement = null;


	document.querySelectorAll('.project-gallery img').forEach(function(image) {

		image.setAttribute('tabindex', '0');
		image.setAttribute('role', 'button');

		function openLightbox(event) {

			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}

			previousFocusedElement = document.activeElement;

			currentProject = document.querySelector('#work');

			lightboxImage.src = image.src;
			lightboxImage.alt = image.alt || 'Project image';

			lightbox.classList.add('active');

			document.body.classList.add('lightbox-open');

			closeButton.focus();

		}

		image.addEventListener('click', openLightbox);

		image.addEventListener('keydown', function(event) {

			if (event.key === 'Enter' || event.key === ' ') {
				openLightbox(event);
			}

		});

	});


	function closeLightbox(event) {

		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		lightbox.classList.remove('active');

		document.body.classList.remove('lightbox-open');

		lightboxImage.src = '';

		if (previousFocusedElement &&
			typeof previousFocusedElement.focus === 'function') {

			previousFocusedElement.focus();

		}

		/*
			Return to the Projects section without
			forcing the page to the top.
		*/
		if (currentProject &&
			!document.body.classList.contains('is-article-visible')) {

			window.location.hash = 'work';

		}

	}


	closeButton.addEventListener('click', closeLightbox);


	lightbox.addEventListener('click', function(event) {

		if (event.target === lightbox)
			closeLightbox(event);

	});


	document.addEventListener('keydown', function(event) {

		if (
			event.key === 'Escape' &&
			lightbox.classList.contains('active')
		) {

			closeLightbox(event);

		}

	});

});


/* =========================================================
   FEATURED PROJECT → FULL PROJECT
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

	document.querySelectorAll(
		'.project-card a[href^="#project-"]'
	).forEach(function(button) {

		button.addEventListener('click', function(event) {

			event.preventDefault();

			var targetId = this.getAttribute('href');
			var target = document.querySelector(targetId);

			if (!target)
				return;

			window.location.hash = 'work';

			setTimeout(function() {

				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});

			}, 500);

		});

	});

});


/* =========================================================
   HOME NAVIGATION BUTTONS
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

	document.querySelectorAll('.home-actions a').forEach(function(button) {

		button.addEventListener('click', function() {

			var destination = this.getAttribute('href');

			if (
				destination === '#work' ||
				destination === '#about'
			) {

				window.location.hash = destination.substring(1);

			}

		});

	});

});


/* =========================================================
   BACK TO TOP — DIMENSION
   ========================================================= */

(function() {

	var button = document.getElementById('back-to-top');

	if (!button)
		return;

	var allowedArticles = [
		'intro',
		'work',
		'about',
		'contact'
	];


	function getActiveArticle() {

		return document.querySelector(
			'#main > article.active'
		);

	}


	function isAllowedArticle(article) {

		return article &&
			allowedArticles.indexOf(article.id) !== -1;

	}


	function getScrollPosition(article) {

		if (!article)
			return 0;

		return article.scrollTop || 0;

	}


	function updateButton() {

		var article = getActiveArticle();

		if (!isAllowedArticle(article)) {

			button.classList.remove('is-visible');

			return;

		}

		if (getScrollPosition(article) > 100)
			button.classList.add('is-visible');

		else
			button.classList.remove('is-visible');

	}


	document.querySelectorAll(
		'#main > article'
	).forEach(function(article) {

		article.addEventListener(
			'scroll',
			updateButton,
			{ passive: true }
		);

	});


	$(window).on('hashchange', function() {

		button.classList.remove('is-visible');

		setTimeout(updateButton, 400);

	});


	var observer = new MutationObserver(function() {

		updateButton();

	});


	var main = document.getElementById('main');

	if (main) {

		observer.observe(main, {
			subtree: true,
			attributes: true,
			attributeFilter: ['class']
		});

	}


	button.addEventListener('click', function(event) {

		event.preventDefault();
		event.stopPropagation();

		var article = getActiveArticle();

		if (!isAllowedArticle(article))
			return;

		var start = article.scrollTop;
		var startTime = null;

		var duration = window.matchMedia &&
			window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			).matches
			? 0
			: 700;


		if (duration === 0) {

			article.scrollTop = 0;
			updateButton();

			return;

		}


		function easeInOut(t) {

			return t < 0.5
				? 2 * t * t
				: 1 - Math.pow(-2 * t + 2, 2) / 2;

		}


		function scrollToTop(timestamp) {

			if (!startTime)
				startTime = timestamp;

			var progress = Math.min(
				(timestamp - startTime) / duration,
				1
			);

			var easedProgress = easeInOut(progress);

			article.scrollTop =
				start * (1 - easedProgress);

			if (progress < 1)
				window.requestAnimationFrame(scrollToTop);

			else
				updateButton();

		}


		window.requestAnimationFrame(scrollToTop);

	});


	updateButton();

})();


/* =========================================================
   ACCESSIBILITY HELPERS
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

	/*
		Add keyboard focus support to gallery images
		without changing the visual design.
	*/

	document.querySelectorAll('.project-gallery img').forEach(function(image) {

		if (!image.hasAttribute('tabindex'))
			image.setAttribute('tabindex', '0');

	});

});

// =====================================================
// CONTACT FORM — FORMSPREE
// =====================================================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitButton = document.getElementById("submit-button");
const contactSuccess = document.getElementById("contact-success");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Clear previous status
        formStatus.textContent = "";
        formStatus.className = "form-status";

        // Basic validation
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Prevent multiple submissions
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        const formData = new FormData(contactForm);

        try {

            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                // Hide the form
                contactForm.hidden = true;

                // Show success message
                contactSuccess.hidden = false;

                // Reset the form
                contactForm.reset();

                // Put focus on the success message
                const successHeading =
                    contactSuccess.querySelector("h3");

                if (successHeading) {
                    successHeading.focus();
                }

            } else {

                const data =
                    await response.json().catch(() => null);

                if (response.status === 429) {

                    formStatus.textContent =
                        "Too many requests right now. Please wait a moment and try again.";

                } else if (data && data.errors) {

                    formStatus.textContent =
                        "Please check your details and try again.";

                } else {

                    formStatus.textContent =
                        "Sorry, your message could not be sent. Please try again.";
                }

                formStatus.classList.add("error");
            }

        } catch (error) {

            formStatus.textContent =
                "Something went wrong. Please check your internet connection and try again.";

            formStatus.classList.add("error");

        } finally {

            // Re-enable the button only if the form is still visible
            if (!contactForm.hidden) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }
        }
    });
}

/* =========================================================
   CERTIFICATE LIGHTBOX
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

	var certificateButtons =
		document.querySelectorAll('.certificate-view-button');

	if (!certificateButtons.length)
		return;


	/* ---------------------------------------------------------
	   Create lightbox
	   --------------------------------------------------------- */

	var lightbox = document.createElement('div');

	lightbox.className = 'certificate-lightbox';

	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-modal', 'true');
	lightbox.setAttribute(
		'aria-label',
		'Certificate preview'
	);


	/* Close button */

	var closeButton = document.createElement('button');

	closeButton.type = 'button';
	closeButton.className = 'certificate-lightbox-close';
	closeButton.innerHTML = '&times;';

	closeButton.setAttribute(
		'aria-label',
		'Close certificate preview'
	);


	/* Content area */

	var content = document.createElement('div');

	content.className = 'certificate-lightbox-content';


	lightbox.appendChild(closeButton);
	lightbox.appendChild(content);

	document.body.appendChild(lightbox);


	var previousFocusedElement = null;


	/* ---------------------------------------------------------
	   Open certificate
	   --------------------------------------------------------- */

	function openCertificate(button) {

		previousFocusedElement = button;

		var file = button.getAttribute(
			'data-certificate'
		);

		var type = button.getAttribute(
			'data-certificate-type'
		);

		var title = button.getAttribute(
			'data-certificate-title'
		) || 'Certificate preview';


		/* Clear previous certificate */

		content.innerHTML = '';


		/* Image certificate */

		if (type === 'image') {

			var image = document.createElement('img');

			image.className =
				'certificate-lightbox-image';

			image.src = file;

			image.alt = title;

			content.appendChild(image);

		}


		/* PDF certificate */

		else if (type === 'pdf') {

			var pdf = document.createElement('iframe');

			pdf.className =
				'certificate-lightbox-pdf';

			pdf.src = file;

			pdf.title = title;

			pdf.setAttribute(
				'loading',
				'eager'
			);

			content.appendChild(pdf);

		}


		/* Open */

		lightbox.classList.add('active');

		document.body.classList.add(
			'certificate-lightbox-open'
		);

		closeButton.focus();

	}


	/* ---------------------------------------------------------
	   Close certificate
	   --------------------------------------------------------- */

	function closeCertificate(event) {

		if (event) {

			event.preventDefault();
			event.stopPropagation();

		}


		lightbox.classList.remove('active');

		document.body.classList.remove(
			'certificate-lightbox-open'
		);


		/* Remove certificate content */

		content.innerHTML = '';


		/* Return focus to the exact button clicked */

		if (
			previousFocusedElement &&
			typeof previousFocusedElement.focus === 'function'
		) {

			previousFocusedElement.focus();

		}

	}


	/* ---------------------------------------------------------
	   Certificate buttons
	   --------------------------------------------------------- */

	certificateButtons.forEach(function(button) {

		button.addEventListener(
			'click',
			function(event) {

				event.preventDefault();
				event.stopPropagation();

				openCertificate(button);

			}
		);

	});


	/* ---------------------------------------------------------
	   Close button
	   --------------------------------------------------------- */

	closeButton.addEventListener(
		'click',
		closeCertificate
	);


	/* ---------------------------------------------------------
	   Click outside certificate
	   --------------------------------------------------------- */

	lightbox.addEventListener(
		'click',
		function(event) {

			if (event.target === lightbox)
				closeCertificate(event);

		}
	);


	/* ---------------------------------------------------------
	   Escape key
	   --------------------------------------------------------- */

	document.addEventListener(
		'keydown',
		function(event) {

			if (
				event.key === 'Escape' &&
				lightbox.classList.contains('active')
			) {

				closeCertificate(event);

			}

		}
	);

});

/* =========================================================
CERTIFICATE IMAGE LIGHTBOX
========================================================= */

document.addEventListener('DOMContentLoaded', function() {

var certificateButtons =
    document.querySelectorAll('.view-certificate');

if (!certificateButtons.length)
    return;


/* Create the lightbox */

var lightbox = document.createElement('div');

lightbox.className = 'certificate-lightbox';

lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute(
    'aria-label',
    'Certificate preview'
);


/* Close button */

var closeButton = document.createElement('button');

closeButton.type = 'button';
closeButton.className = 'certificate-lightbox-close';
closeButton.innerHTML = '&times;';
closeButton.setAttribute(
    'aria-label',
    'Close certificate'
);


/* Certificate image */

var certificateImage = document.createElement('img');

certificateImage.className =
    'certificate-lightbox-image';

certificateImage.alt = '';


lightbox.appendChild(closeButton);
lightbox.appendChild(certificateImage);

document.body.appendChild(lightbox);


var previousFocusedElement = null;


/* Open certificate */

certificateButtons.forEach(function(button) {

    button.addEventListener('click', function(event) {

        event.preventDefault();
        event.stopPropagation();

        previousFocusedElement =
            document.activeElement;

        var imagePath =
            button.getAttribute('data-certificate');

        var certificateTitle =
            button.getAttribute(
                'data-certificate-title'
            ) || 'Certificate';

        certificateImage.src = imagePath;
        certificateImage.alt = certificateTitle;

        lightbox.classList.add('active');

        document.body.classList.add(
            'certificate-lightbox-open'
        );

        closeButton.focus();

    });

});


/* Close certificate */

function closeCertificate(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    lightbox.classList.remove('active');

    document.body.classList.remove(
        'certificate-lightbox-open'
    );

    certificateImage.removeAttribute('src');

    if (
        previousFocusedElement &&
        typeof previousFocusedElement.focus === 'function'
    ) {
        previousFocusedElement.focus();
    }

}


closeButton.addEventListener(
    'click',
    closeCertificate
);


/* Clicking the dark area closes the viewer */

lightbox.addEventListener('click', function(event) {

    if (event.target === lightbox)
        closeCertificate(event);

});


/* Escape key closes the viewer */

document.addEventListener('keydown', function(event) {

    if (
        event.key === 'Escape' &&
        lightbox.classList.contains('active')
    ) {
        closeCertificate(event);
    }

});

});