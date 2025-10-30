'use strict';



// Preloader removed



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 8000);
}

// Slider runs continuously - no pause on hover

window.addEventListener("load", autoSlide);



/**
 * SCROLL REVEAL
 */

const sections = document.querySelectorAll('.section');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

sections.forEach((el) => {
  el.classList.add('reveal-init');
  revealObserver.observe(el);
});

/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});

/**
 * VIDEO TABS (single video segment playback in About Us)
 */
(function initVideoTabs() {
  const tabsRoot = document.querySelector('[data-video-tabs]');
  const videoEl = document.querySelector('.about-video video');
  if (!tabsRoot || !videoEl) return;

  let segStart = 0;
  let segEnd = Number.POSITIVE_INFINITY; // Infinity => play full video without looping

  const setActive = (btn) => {
    const all = tabsRoot.querySelectorAll('.tab-btn');
    all.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  const applySegment = (start, end) => {
    segStart = start ?? 0;
    segEnd = (end === undefined || isNaN(end)) ? Number.POSITIVE_INFINITY : end;
    try {
      videoEl.currentTime = segStart;
      videoEl.play().catch(() => {});
    } catch (_) {}
  };

  tabsRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const isFull = btn.hasAttribute('data-full');
    const start = isFull ? 0 : parseFloat(btn.getAttribute('data-start') || '0');
    const endAttr = isFull ? undefined : btn.getAttribute('data-end');
    const end = endAttr === null ? undefined : parseFloat(endAttr);
    setActive(btn);
    applySegment(start, end);
  });

  // Loop within the selected range
  videoEl.addEventListener('timeupdate', () => {
    if (Number.isFinite(segEnd) && videoEl.currentTime >= segEnd - 0.12) {
      videoEl.currentTime = segStart;
      videoEl.play().catch(() => {});
    }
  });

  // Initialize to first active tab
  const initial = tabsRoot.querySelector('.tab-btn.active');
  if (initial) {
    const isFull = initial.hasAttribute('data-full');
    if (isFull) {
      applySegment(0, undefined); // full video
    } else {
      const s = parseFloat(initial.getAttribute('data-start') || '0');
      const e = parseFloat(initial.getAttribute('data-end') || '6');
      applySegment(s, e);
    }
  }
})();

/**
 * VIDEO SCREENS (simultaneous scene loops)
 */
(function initVideoScreens() {
  const screens = document.querySelectorAll('[data-video-screen]');
  if (!screens.length) return;

  screens.forEach((el) => {
    const video = el.querySelector('.screen-video');
    if (!video) return;
    const start = parseFloat(el.getAttribute('data-start') || '0');
    const end = parseFloat(el.getAttribute('data-end') || '6');
    try { video.currentTime = start; } catch (_) {}

    const loop = () => {
      if (video.currentTime >= end - 0.12) {
        video.currentTime = start;
        video.play().catch(() => {});
      }
    };
    video.addEventListener('timeupdate', loop);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });

    obs.observe(el);
  });
})();

// video segment tiles removed