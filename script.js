'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
// overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) { // The event listener is copied to all the 3 events
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     console.log('link');
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event Delegation
// 1. Add event listener to common parent element
// 2.Determinewhich element originated in the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    console.log('link');
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  console.log('Current Scroll X/Y', window.pageXOffset, pageYOffset);

  console.log(
    'Height/Width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // Traditional approach
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  // Mordern way only works on mordern browsers
  // section1.scrollIntoView({ behavior: 'smooth' });
});

// Tabbed component

// tabs.forEach(t => {
//   t.addEventListener('click', () => {
//     console.log('TABS');
//   });
// });

tabsContainer.addEventListener('click', function (e) {
  console.log(e.target);
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard Clause.
  if (!clicked) return;

  // Active tabs
  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
  });
  clicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(c => {
    c.classList.remove('operations__content--active');
  });
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // console.log(e.target);
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "arguement" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticku Navigation
// const initialCords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);

//   if (this.window.scrollY > initialCords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky Navigation:: Interaction Observer API
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);
const stickyNav = function (entries) {
  console.log(entries);
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll('.section');
// console.log(allSections);
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry.target);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img'); // Not good approach on slow devices

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));
