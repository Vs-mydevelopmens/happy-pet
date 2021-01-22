
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 600;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function () {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = '0px';
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}



document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// руализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	//проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
$(document).ready(function () {
	$('.header__burger').click(function (event) {
		$('.header__burger,.header__menu').toggleClass('active');
		$('body').toggleClass('lock');
	});
});
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
// BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-bild')) {
			let slider_items = slider.children;
			if (slider_items) {
				for (let index = 0; index < slider_items.length; index++) {
					let el = slider_items[index];
					el.classList.add('swiper-slide');
				}
			}
			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-bild');
		}
		if (slider.classList.contains('_gallery')) {
			// slider.data('LightGallery').destroy(true);
		}
	}
	slider_bild_callback();
}

function slider_bild_callback(params) { }

let headerSlider = new Swiper('.header-slider__item', {

	// effect: 'fade',
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},

	observer: true,
	observeParents: true,
	slidesPerView: 3,
	spaceBetween: 24,
	// autoHeight: true,
	speed: 800,
	// touchRatio: 0,
	// simulateTouch: false,
	loop: true,
	// lazy: true,
	preloadImages: false,
	// dotts
	// pagination: {
	// 	el: '.slider-quality__pagging',
	// 	clickable: true,
	// },
	// Arrows
	navigation: {
		nextEl: '.header-slider-button__next',
		prevEl: '.header-slider-button__prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 10,
			autoHeight: true,
		},
		420: {
			slidesPerView: 2,
			spaceBetween: 10,
			autoHeight: true,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 14,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		1268: {
			slidesPerView: 3,
			spaceBetween: 24,
		},
	},
	// on: {
	// 	lazyImageReady: function () {
	// 		ibg();
	// 	},
	// },
	// And if we need scroLLbar
	// Scrollbar: {
	// 	el: '.swiper-scrollbar',
	// },
});
// ==========================================

let tabsSlider = new Swiper('.tabs-content', {

	// effect: 'fade',
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},

	observer: true,
	observeParents: true,
	observeSlideChildren: true,
	slidesPerView: 3,
	spaceBetween: 30,
	// autoHeight: true,
	speed: 800,
	// touchRatio: 0,
	// simulateTouch: false,
	loop: true,
	// lazy: true,
	preloadImages: false,
	// dotts
	pagination: {
		el: '.tabs-slider-pagination',
		clickable: true,
	},
	// Arrows
	navigation: {
		nextEl: '.tabs-slider-arrow__next',
		prevEl: '.tabs-slider-arrow__prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 10,
			autoHeight: true,
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 14,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		1268: {
			slidesPerView: 3,
			spaceBetween: 24,
		},
	},
	// on: {
	// 	lazyImageReady: function () {
	// 		ibg();
	// 	},
	// },
	// And if we need scroLLbar
	// Scrollbar: {
	// 	el: '.swiper-scrollbar',
	// },
});

// ==========================================
// <КАРТОЧКА КОРЗИНЫ ШАПКИ САЙТА>
// ==========================================
let cartLink = document.querySelector('.header-cart');
let cartItem = document.querySelector('.header-products');
cartLink.addEventListener("click", function (e) {
    cartLink.classList.toggle('_active');
    cartItem.classList.toggle('_active');
});
// ==========================================
// </КАРТОЧКА КОРЗИНЫ ШАПКИ САЙТА>
// ==========================================

// ==========================================
// <ВЫДЕЛЕНИЕ АКТИВНОГО МЕНЮ>
// ==========================================
$('.tabs__item').click(function () {
    $('.active').removeClass('active');
    $(this).addClass('active');
});
// ==========================================
// Toggle active link
const links = document.querySelectorAll('.header__menu a')

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault()
        links.forEach(other => other.classList.remove('is-active'))
        link.classList.add('is-active')
    })
})
// ==========================================
// </ВЫДЕЛЕНИЕ АКТИВНОГО МЕНЮ>
// ==========================================

// ==========================================
// <WEBP IMAGE>
// ==========================================
function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp');
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
});
// ==========================================
// </WEBP IMAGE>
// ==========================================

// ==========================================
// <2 СКРИПТА НА ИЗОБРАЖЕНИЯ, ЕСЛИ НЕ ОТОБРАЖАЕТСЯ, АКТИВНЫЙ СКРИПТ ЗАКОМЕНТИРОВАТЬ, А ЗАКОМЕНТИРОВАННЫЙ РАССКОМЕНТИРОВАТЬ>
// ==========================================
function ibg() {
    let ibg = document.querySelectorAll(".ibg");
    for (var i = 0; i < ibg.length; i++) {
        if (ibg[i].querySelector('img')) {
            ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
        }
    }
}
ibg();

// function ibg() {
//     $.each($('.ibg'), function (index, val) {
//         if ($(this).find('img').length > 0) {
//             $(this).css('background-image', 'url("' + $(this).find('img').attr('src') + '")');
//         }
//     });
// }
// ibg();
// ==========================================
// <2 СКРИПТА НА ИЗОБРАЖЕНИЯ>
// ==========================================

// ==========================================
// <SWIPER SLIDER INIT>
// ==========================================

// ==========================================

// ==========================================
// </SWIPER SLIDER INIT>
// ==========================================