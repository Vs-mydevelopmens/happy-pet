
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
var $tabs = function (target) {
	var
		_elemTabs = (typeof target === 'string' ? document.querySelector(target) : target),
		_eventTabsShow,
		_showTab = function (tabsLinkTarget) {
			var tabsPaneTarget, tabsLinkActive, tabsPaneShow;
			tabsPaneTarget = document.querySelector(tabsLinkTarget.getAttribute('href'));
			tabsLinkActive = tabsLinkTarget.parentElement.querySelector('.tabs__link_active');
			tabsPaneShow = tabsPaneTarget.parentElement.querySelector('.tabs-block_show');
			// если следующая вкладка равна активной, то завершаем работу
			if (tabsLinkTarget === tabsLinkActive) {
				return;
			}
			// удаляем классы у текущих активных элементов
			if (tabsLinkActive !== null) {
				tabsLinkActive.classList.remove('tabs__link_active');
			}
			if (tabsPaneShow !== null) {
				tabsPaneShow.classList.remove('tabs-block_show');
			}
			// добавляем классы к элементам (в завимости от выбранной вкладки)
			tabsLinkTarget.classList.add('tabs__link_active');
			tabsPaneTarget.classList.add('tabs-block_show');
			document.dispatchEvent(_eventTabsShow);
		},
		_switchTabTo = function (tabsLinkIndex) {
			var tabsLinks = _elemTabs.querySelectorAll('.tabs__item');
			if (tabsLinks.length > 0) {
				if (tabsLinkIndex > tabsLinks.length) {
					tabsLinkIndex = tabsLinks.length;
				} else if (tabsLinkIndex < 1) {
					tabsLinkIndex = 1;
				}
				_showTab(tabsLinks[tabsLinkIndex - 1]);
			}
		};

	_eventTabsShow = new CustomEvent('tab.show', { detail: _elemTabs });

	_elemTabs.addEventListener('click', function (e) {
		var tabsLinkTarget = e.target;
		// завершаем выполнение функции, если кликнули не по ссылке
		if (!tabsLinkTarget.classList.contains('tabs__item')) {
			return;
		}
		// отменяем стандартное действие
		e.preventDefault();
		_showTab(tabsLinkTarget);
	});

	return {
		showTab: function (target) {
			_showTab(target);
		},
		switchTabTo: function (index) {
			_switchTabTo(index);
		}
	}

};

$tabs('.tabs');


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
$(document).ready(
	function () {
		let tabsSlider = new Swiper('.tabs-content', {
			observer: true,
			observeParents: true,
			// effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
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
				el: '.swiper-pagination',
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

			on: {
				lazyImageReady: function () {
					ibg();
				},
			},
			// And if we need scroLLbar
			// Scrollbar: {
			// 	el: '.swiper-scrollbar',
			// },


		});

	});



const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < animItems.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 6;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;
			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('scroll_active');
			} else {
				if (!animItem.classList.contains('_anim-no-hide')) {
					animItem.classList.remove('scroll_active');
				}
			}
		}
	}
	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	setTimeout(() => {
		animOnScroll();
	}, 300);
}

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
// <ПЛАВНЫЙ СКРОЛЛ ЯКОРНЫХ ССЫЛОК>
// ==========================================
// функция скролла
function scrollIt(
    destination,
    duration = 200,
    easing = "linear",
    callback
) {
    const easings = {
        linear(t) {
            return t;
        },
        easeInQuad(t) {
            return t * t;
        },
        easeOutQuad(t) {
            return t * (2 - t);
        },
        easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        easeInCubic(t) {
            return t * t * t;
        },
        easeOutCubic(t) {
            return --t * t * t + 1;
        },
        easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        easeInQuart(t) {
            return t * t * t * t;
        },
        easeOutQuart(t) {
            return 1 - --t * t * t * t;
        },
        easeInOutQuart(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        },
        easeInQuint(t) {
            return t * t * t * t * t;
        },
        easeOutQuint(t) {
            return 1 + --t * t * t * t * t;
        },
        easeInOutQuint(t) {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
        }
    };

    // Определение координаты элемента по вертикали от начала документа
    function pageY(elem) {
        return elem.offsetParent
            ? elem.offsetTop + pageY(elem.offsetParent)
            : elem.offsetTop;
    }

    const start = window.pageYOffset;
    const startTime =
        "now" in window.performance ? performance.now() : new Date().getTime();

    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );
    const windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.getElementsByTagName("body")[0].clientHeight;
    const destinationOffset =
        typeof destination === "number" ? destination : pageY(destination);
    const destinationOffsetToScroll = Math.round(
        documentHeight - destinationOffset < windowHeight
            ? documentHeight - windowHeight
            : destinationOffset
    );

    if ("requestAnimationFrame" in window === false) {
        window.scroll(0, destinationOffsetToScroll);
        if (callback) {
            callback();
        }
        return;
    }

    function scroll() {
        const now =
            "now" in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, (now - startTime) / duration);
        const timeFunction = easings[easing](time);
        // эта функция скролит по чуть чуть
        window.scroll(
            0,
            Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start)
        );
        //усоловие если время истекло, то поставь в конечную точку анимации
        if (duration <= now - startTime) {
            return;
        }
        // это условие проверяет условие кончилась ли аницация. в данном случае проверяет дошли ли до точки назначения
        if (window.pageYOffset === destinationOffsetToScroll) {
            if (callback) {
                callback();
            }
            return;
        }
        // эта функция запускает следующую итерацию анимации
        requestAnimationFrame(scroll);
    }

    scroll();
}



friends.addEventListener('click', () => {
    scrollIt(play, 800, 'linear', () => { console.log("скролл завершился") });
});

aboutUs.addEventListener('click', () => {
    scrollIt(about, 800, 'linear', () => { console.log("скролл завершился") });
});

contacts.addEventListener('click', () => {
    scrollIt(contact, 800, 'linear', () => { console.log("скролл завершился") });
});

showCatalog.addEventListener('click', () => {
    scrollIt(catalog, 800, 'linear', () => { console.log("скролл завершился") });
});

topScroll.addEventListener('click', () => {
    scrollIt(header, 800, 'linear', () => { console.log("скролл завершился") });
});

tops.addEventListener('click', () => {
    scrollIt(header, 800, 'linear', () => { console.log("скролл завершился") });
});
// ==========================================
// </ПЛАВНЫЙ СКРОЛЛ ЯКОРНЫХ ССЫЛОК>
// ==========================================



// ==========================================
// <ВЫДЕЛЕНИЕ АКТИВНОГО МЕНЮ>
// ==========================================
// $('.tabs__item').click(function () {
//     $('.__active').removeClass('__active');
//     $(this).addClass('__active');
//     var tab = $(this).attr('href');
//     $(tab).fadeIn(400);
// });

// ==========================================
let checkLink = document.querySelector('.contact-body__check');
checkLink.addEventListener("click", function (e) {
    checkLink.classList.toggle('check-active');
});
// ==========================================
let checked = document.querySelector('.contact-body__click');
checked.addEventListener("click", function (e) {
    checked.classList.toggle('check-active');
});
// ==========================================
// Toggle active link
const links = document.querySelectorAll('.header__menu a');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault()
        links.forEach(other => other.classList.remove('is-active'));
        link.classList.add('is-active');
    });
});
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

