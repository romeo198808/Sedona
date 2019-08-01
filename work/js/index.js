"use strict"
var navList = document.querySelector('.nav__list');
var toggle = document.querySelector('.page-header__toggle');

navList.classList.remove('nav__list--nojs');

toggle.addEventListener('click', function(e) {
  e.preventDefault();
  if (navList.classList.contains('nav__list--close')) {
    toggle.classList.add('page-header__toggle--open');
    toggle.classList.remove('page-header__toggle--close');
    navList.classList.remove('nav__list--close');
    navList.classList.add('nav__list--open');
  }
  else {
    toggle.classList.add('page-header__toggle--close');
    toggle.classList.remove('page-header__toggle--open');
    navList.classList.remove('nav__list--open');
    navList.classList.add('nav__list--close');
  }
});
