/*
    Dimension by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license
    (html5up.net/license)
*/

(function($) {

    var $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $footer = $('#footer'),
        $main = $('#main'),
        $main_articles = $main.children('article');

    breakpoints({
        xlarge:   [ '1281px',  '1680px' ],
        large:    [ '981px',   '1280px' ],
        medium:   [ '737px',   '980px'  ],
        small:    [ '481px',   '736px'  ],
        xsmall:   [ '361px',   '480px'  ],
        xxsmall:  [ null,      '360px'  ]
    });

    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

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

    var $nav = $header.children('nav'),
        $nav_li = $nav.find('li');

    if ($nav_li.length % 2 == 0) {
        $nav.addClass('use-middle');
        $nav_li.eq(($nav_li.length / 2)).addClass('is-middle');
    }

    var delay = 325,
        locked = false;

    $main._show = function(id, initial) {
        var $article = $main_articles.filter('#' + id);

        if ($article.length == 0)
            return;

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

        locked = true;

        if ($body.hasClass('is-article-visible')) {
            var $currentArticle = $main_articles.filter('.active');
            $currentArticle.removeClass('active');

            setTimeout(function() {
                $currentArticle.hide();
                $article.show();

                setTimeout(function() {
                    $article.addClass('active');
                    $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                    setTimeout(function() {
                        locked = false;
                    }, delay);
                }, 25);
            }, delay);
        }
        else {
            $body.addClass('is-article-visible');

            setTimeout(function() {
                $header.hide();
                $footer.hide();

                $main.show();
                $article.show();

                setTimeout(function() {
                    $article.addClass('active');
                    $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                    setTimeout(function() {
                        locked = false;
                    }, delay);
                }, 25);
            }, delay);
        }
    };

    $main._hide = function(addState) {
        var $article = $main_articles.filter('.active');

        if (!$body.hasClass('is-article-visible'))
            return;

        if (typeof addState != 'undefined' && addState === true)
            history.pushState(null, null, '#');

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
            $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
            return;
        }

        locked = true;
        $article.removeClass('active');

        setTimeout(function() {
            $article.hide();
            $main.hide();

            $footer.show();
            $header.show();

            setTimeout(function() {
                $body.removeClass('is-article-visible');
                $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                setTimeout(function() {
                    locked = false;
                }, delay);
            }, 25);
        }, delay);
    };

    $main_articles.each(function() {
        var $this = $(this);

        $('<div class="close">Close</div>')
            .appendTo($this)
            .on('click', function() {
                location.hash = '';
            });

        $this.on('click', function(event) {
            event.stopPropagation();
        });
    });

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

    if ('scrollRestoration' in history)
        history.scrollRestoration = 'manual';
    else {
        var oldScrollPos = 0,
            scrollPos = 0,
            $htmlbody = $('html,body');

        $window.on('scroll', function() {
            oldScrollPos = scrollPos;
            scrollPos = $htmlbody.scrollTop();
        }).on('hashchange', function() {
            $window.scrollTop(oldScrollPos);
        });
    }

    $main.hide();
    $main_articles.hide();

    if (location.hash != '' && location.hash != '#') {
        $window.on('load', function() {
            $main._show(location.hash.substr(1), true);
        });
    }

})(jQuery);

(function() {
    var themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    var storageKey = 'cephasia-theme';

    function getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function getSavedTheme() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(storageKey, theme);
        } catch (error) {}
    }

    function updateToggle(theme) {
        var isLight = theme === 'light';
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        themeToggle.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');

        var icon = themeToggle.querySelector('.theme-toggle-icon');
        if (icon) {
            icon.textContent = isLight ? '☾' : '☀';
        }
    }

    function applyTheme(theme, save) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggle(theme);
        if (save) saveTheme(theme);
    }

    var savedTheme = getSavedTheme();
    var initialTheme = savedTheme || getSystemTheme();
    applyTheme(initialTheme, false);

    themeToggle.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        var newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme, true);
    });

    if (window.matchMedia) {
        var mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        var handleSystemThemeChange = function(event) {
            if (!getSavedTheme()) {
                applyTheme(event.matches ? 'light' : 'dark', false);
            }
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleSystemThemeChange);
        }
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.project-gallery').forEach(function(gallery) {
        var nextButton = gallery.parentElement.querySelector('.gallery-next');
        var prevButton = gallery.parentElement.querySelector('.gallery-prev');

        if (!gallery || !nextButton || !prevButton) return;

        nextButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            gallery.scrollBy({ left: gallery.clientWidth * 0.85, behavior: 'smooth' });
        });

        prevButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            gallery.scrollBy({ left: -gallery.clientWidth * 0.85, behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.project-gallery img').forEach(function(image) {
        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');

        function openImage(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            var lightbox = document.querySelector('.project-lightbox');
            if (!lightbox) return;

            var img = lightbox.querySelector('img');
            if (!img) return;

            img.src = image.src;
            img.alt = image.alt || 'Project image';
            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');
            lightbox.setAttribute('aria-hidden', 'false');
            var closeButton = lightbox.querySelector('.lightbox-close');
            if (closeButton) closeButton.focus();
        }

        image.addEventListener('click', openImage);
        image.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                openImage(event);
            }
        });
    });

    var lightbox = document.createElement('div');
    lightbox.className = 'project-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('aria-label', 'Project image preview');

    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'lightbox-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close image preview');

    var liteImage = document.createElement('img');
    liteImage.alt = 'Project preview';

    lightbox.appendChild(closeButton);
    lightbox.appendChild(liteImage);
    document.body.appendChild(lightbox);

    closeButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        liteImage.src = '';
    });

    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeButton.click();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.classList.contains('active')) {
            closeButton.click();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('back-to-top');
    if (!button) return;

    function updateButton() {
        var activeArticle = document.querySelector('#main > article.active');
        if (!activeArticle) {
            button.classList.remove('is-visible');
            return;
        }
        button.classList.toggle('is-visible', activeArticle.scrollTop > 120);
    }

    document.querySelectorAll('#main > article').forEach(function(article) {
        article.addEventListener('scroll', updateButton, { passive: true });
    });

    button.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        var article = document.querySelector('#main > article.active');
        if (!article) return;

        article.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(updateButton, 350);
    });

    var observer = new MutationObserver(function() {
        updateButton();
    });

    var main = document.getElementById('main');
    if (main) {
        observer.observe(main, { subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    updateButton();
});

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = document.getElementById('form-status');
    var successBox = document.getElementById('contact-success');
    var submitButton = document.getElementById('submit-button');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (status) {
            status.textContent = '';
            status.className = 'form-status';
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        var data = new FormData(form);

        try {
            var response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                form.hidden = true;

                if (successBox) {
                    successBox.hidden = false;
                    var heading = successBox.querySelector('h3');
                    if (heading) heading.focus();
                }

                if (status) {
                    status.textContent = 'Message sent successfully.';
                    status.classList.add('success');
                }
                return;
            }

            var payload = await response.json().catch(function() { return null; });
            var message = 'Sorry, your message could not be sent. Please try again.';

            if (response.status === 429) {
                message = 'Too many requests right now. Please wait a moment and try again.';
            } else if (payload && payload.errors && payload.errors.length) {
                message = payload.errors[0].message || message;
            }

            if (status) {
                status.textContent = message;
                status.classList.add('error');
            }
        } catch (error) {
            if (status) {
                status.textContent = 'Something went wrong. Please check your internet connection and try again.';
                status.classList.add('error');
            }
        } finally {
            if (submitButton && !form.hidden) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });
});

var projectImageLightbox = document.querySelector('.project-lightbox');
if (projectImageLightbox) {
    projectImageLightbox.classList.add('ready');
}

window.addEventListener('resize', function() {
    document.querySelectorAll('.project-gallery').forEach(function(gallery) {
        gallery.scrollLeft = 0;
    });
});

(function() {
    var button = document.getElementById('theme-toggle');
    if (button) {
        var icon = button.querySelector('.theme-toggle-icon');
        if (icon) {
            var theme = document.documentElement.getAttribute('data-theme');
            icon.textContent = theme === 'light' ? '☾' : '☀';
        }
    }
})();


/* =========================================================
   CERTIFICATE LIGHTBOX (safe, single-instance)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('.view-certificate, .certificate-view-button');
    if (!buttons.length) return;

    var lightbox = document.createElement('div');
    lightbox.className = 'certificate-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Certificate preview');

    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'certificate-lightbox-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close certificate preview');

    var content = document.createElement('div');
    content.className = 'certificate-lightbox-content';

    lightbox.appendChild(closeButton);
    lightbox.appendChild(content);
    document.body.appendChild(lightbox);

    var previousFocusedElement = null;

    function openCertificate(button) {
        previousFocusedElement = button;
        var file = button.getAttribute('data-certificate') || '';
        var type = button.getAttribute('data-certificate-type') || 'image';
        var title = button.getAttribute('data-certificate-title') || 'Certificate preview';

        content.innerHTML = '';

        if (type === 'pdf') {
            var iframe = document.createElement('iframe');
            iframe.className = 'certificate-lightbox-pdf';
            iframe.src = file;
            iframe.title = title;
            iframe.loading = 'eager';
            content.appendChild(iframe);
        } else {
            var image = document.createElement('img');
            image.className = 'certificate-lightbox-image';
            image.src = file;
            image.alt = title;
            content.appendChild(image);
        }

        lightbox.classList.add('active');
        document.body.classList.add('certificate-lightbox-open');
        closeButton.focus();
    }

    function closeCertificate(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        lightbox.classList.remove('active');
        document.body.classList.remove('certificate-lightbox-open');
        content.innerHTML = '';

        if (previousFocusedElement && typeof previousFocusedElement.focus === 'function') {
            previousFocusedElement.focus();
        }
    }

    buttons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            openCertificate(button);
        });
    });

    closeButton.addEventListener('click', closeCertificate);

    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) closeCertificate(event);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.classList.contains('active')) {
            closeCertificate(event);
        }
    });
});


/* =========================================================
   HOME NAVIGATION + HASH FIXES
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.home-actions a').forEach(function(button) {
        button.addEventListener('click', function() {
            var dest = this.getAttribute('href');
            if (dest === '#work' || dest === '#about') {
                window.location.hash = dest.substring(1);
            }
        });
    });

    document.querySelectorAll('.project-card a[href^="#project-"]').forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            window.location.hash = 'work';
            setTimeout(function() {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 450);
        });
    });
});


/* =========================================================
   FORM FLOOD/STATUS CLEANUP
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    var status = document.getElementById('form-status');
    if (status) {
        status.className = 'form-status';
    }
});


/* =========================================================
   GLOBAL SAFETY
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.project-lightbox')) {
        var projectLightbox = document.createElement('div');
        projectLightbox.className = 'project-lightbox';
        projectLightbox.setAttribute('role', 'dialog');
        projectLightbox.setAttribute('aria-modal', 'true');
        projectLightbox.setAttribute('aria-hidden', 'true');
        projectLightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close image preview">&times;</button><img alt="Project preview" />';
        document.body.appendChild(projectLightbox);
    }
});

