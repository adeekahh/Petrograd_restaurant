// SCROLL TO TOP
(function () {
	// Back to Top - by CodyHouse.co
	var backTop = document.getElementsByClassName('js-cd-top')[0]
		, // browser window scroll (in pixels) after which the "back to top" link is shown
		offset = 300
		, //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offsetOpacity = 800
		, scrollDuration = 800
		, scrolling = false;
	if (backTop) {
		//update back to top visibility on scrolling
		window.addEventListener("scroll", function (event) {
			if (!scrolling) {
				scrolling = true;
				(!window.requestAnimationFrame) ? setTimeout(checkBackToTop, 250): window.requestAnimationFrame(checkBackToTop);
			}
		});
		//smooth scroll to top
		backTop.addEventListener('click', function (event) {
			event.preventDefault();
			(!window.requestAnimationFrame) ? window.scrollTo(0, 0): scrollTop(scrollDuration);
		});
	}

	function checkBackToTop() {
		var windowTop = window.scrollY || document.documentElement.scrollTop;
		(windowTop > offset) ? addClass(backTop, 'cd-top--show'): removeClass(backTop, 'cd-top--show', 'cd-top--fade-out');
		(windowTop > offsetOpacity) && addClass(backTop, 'cd-top--fade-out');
		scrolling = false;
	}

	function scrollTop(duration) {
		var start = window.scrollY || document.documentElement.scrollTop
			, currentTime = null;
		var animateScroll = function (timestamp) {
			if (!currentTime) currentTime = timestamp;
			var progress = timestamp - currentTime;
			var val = Math.max(Math.easeInOutQuad(progress, start, -start, duration), 0);
			window.scrollTo(0, val);
			if (progress < duration) {
				window.requestAnimationFrame(animateScroll);
			}
		};
		window.requestAnimationFrame(animateScroll);
	}
	Math.easeInOutQuad = function (t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t + b;
		t--;
		return -c / 2 * (t * (t - 2) - 1) + b;
	};
	//class manipulations - needed if classList is not supported
	function hasClass(el, className) {
		if (el.classList) return el.classList.contains(className);
		else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}

	function addClass(el, className) {
		var classList = className.split(' ');
		if (el.classList) el.classList.add(classList[0]);
		else if (!hasClass(el, classList[0])) el.className += " " + classList[0];
		if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
	}

	function removeClass(el, className) {
		var classList = className.split(' ');
		if (el.classList) el.classList.remove(classList[0]);
		else if (hasClass(el, classList[0])) {
			var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
			el.className = el.className.replace(reg, ' ');
		}
		if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
	}
})();



// JSON
const link = "https://kea-alt-del.dk/t5/api/productlist";
const catLink = "https://kea-alt-del.dk/t5/api/categories";
const main = document.querySelector(".menu");
const imgbase = "https://kea-alt-del.dk/t5/site/imgs/";
const nav = document.querySelector("nav");
const allLink = document.querySelector("#allLink");
const modal = document.querySelector("#modal");
const pLink ="http://kea-alt-del.dk/t5/api/product?id=";
const template = document.querySelector("#foodTemplate").content;

allLink.addEventListener("click", (e) => {
	filterBy("all");
	e.preventDefault();
});



//console.log(allLink);
fetch(catLink).then(promise => promise.json()).then(data => buildCategories(data));

function buildCategories(data) {
	data.forEach(category => {
		const newSection = document.createElement("section");
		const newH2 = document.createElement("h2");
		const newLink = document.createElement("a");
		newLink.href = "#";
		newLink.textContent = category;
		newLink.addEventListener("click", (e) => {filterBy(category)
																						 e.preventDefault();
																						});
		newSection.id = category;
		newH2.textContent = category;
		nav.appendChild(newLink);
		newSection.appendChild(newH2);
		main.appendChild(newSection);
		newH2.classList.add("mains-title")
	});
	fetch(link).then(promise => promise.json()).then(data => show(data));
}

function filterBy(category) {
	document.querySelectorAll("section").forEach(section => {
		if (section.id == category || category == "all") {
			section.classList.remove("hide");
		}
		else {
			section.classList.add("hide");
		}
	})
}

function show(plist) {
	plist.forEach(product => {
		const parent = document.querySelector('#' + product.category)
		const clone = template.cloneNode(true);
		clone.querySelector("h2").textContent = product.name;
		clone.querySelector(".short-description").textContent = product.shortdescription
		clone.querySelector(".price").textContent = product.price + " kr. ";
		clone.querySelector("button").addEventListener("click", ()=>fetch(pLink+product.id).then(promise=>promise.json()).then(data=>showDetails(data)));

		clone.querySelector("img").src = imgbase + "medium/" + product.image + "-md.jpg";
		//discount-animation
		if (product.discount == 0) {
			clone.querySelector(".discount-anim").style.display = "none";
		}
		//soldout
		if (product.soldout == false) {
			clone.querySelector(".soldout-anim").style.display = "none";
		}
		//vegetarian
		if (product.vegetarian) {
			clone.querySelector(".vegetarian-label").innerHTML = "&#x2714;"
		}
		else {
			clone.querySelector(".vegetarian-label").innerHTML = "&#10006;"
			clone.querySelector(".vegetarian-label").style.color = "red";
		}
		//discount price + sizes
		//if there is a discount make normal price smaller and the discount price bigger
		if (product.discount) {
			const newPrice = Math.round(product.price - product.price * product.discount / 100);
			//	 console.log(newPrice);
			clone.querySelector(".price").style.fontSize = "16px";
			clone.querySelector(".discount-price").textContent = newPrice + " kr. ";
			clone.querySelector(".discount-price").style.fontSize = "2em";
		}
		else {
			clone.querySelector(".discount-price").style.display = "none";
			clone.querySelector(".price").style.textDecoration = "none";
		}
		parent.appendChild(clone);
	});
}

function showDetails(product){

	console.log(product.longdescription);

	modal.querySelector("h2").textContent = product.name;
	modal.querySelector("img").src = imgbase + "medium/" + product.image + "-md.jpg";
	modal.querySelector("p").textContent = product.longdescription;
	modal.classList.remove('hide');

}

modal.addEventListener("click", ()=>modal.classList.add("hide"));

function checkTheBox(x) {
	if (x.matches) {
		document.getElementById("toggle").checked = true;
	}
}
var x = window.matchMedia("(min-width: 1200px)")
checkTheBox(x) // Call listener function at run time
x.addListener(checkTheBox);



//MODAL





// COLLAGE
/*
const images = [
	"1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg", "30.jpg"]


let i = 0


function placeImage(x, y) {

	const nextImage = images[i]

	const img = document.createElement("img")
	img.setAttribute("src", nextImage)
	img.style.left = x + "px"
	img.style.top = y + "px"

	document.querySelector(".main-screen").appendChild(img)

	img.classList.add("collageImg")

	i = i + 1

	if (i >= images.length){

		i = 0

	}

}

document.addEventListener("click", function(event){

	event.preventDefault()
	placeImage(event.pageX, event.pageY)

})

document.addEventListener("touchend", function(event){

	event.preventDefault()
	placeImage(event.pageX, event.pageY)

}
													)


		*/
