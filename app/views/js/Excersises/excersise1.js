import $ from "jquery";
import anime from "animejs";
import interact from "interactjs";
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle, faVolumeUp, faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faQuestionCircle);
library.add(faVolumeUp);
library.add(faTimes);

const timeline = anime.timeline;
function animationFromStack(card) {
	viewportWidth = window.innerWidth / 2 - $(card).width() / 2;
	viewportHeight = window.innerHeight / 2 - $(card).height() / 2;

	var t1 = anime.timeline({
		targets: card,
	});

	t1.add({
		translateX: viewportWidth,
		translateY: viewportHeight,
		easing: "easeOutQuint",
		duration: 1000,
	});

	t1.add(
		{
			scale: [
				{ value: 1 },
				{ value: 1.2, duration: 400 },
				{ value: 1, duration: 400 },
			],
			rotateX: { delay: 20, value: "+=180", duration: 500 },
			easing: "easeInOutSine",
			duration: 1200,
		},
		"-=200"
	);

	position = { x: viewportWidth, y: viewportHeight };

	return t1.finished;
}

function animationToCenter(card) {
	let translateToX = 0;
	let translateToY = 0;
	if (position.x > centerPosition.x) {
		translateToX = -position.x + centerPosition.x - $(card).width() / 2;
	} else {
		translateToX = centerPosition.x - position.x - $(card).width() / 2;
	}
	if (position.y > centerPosition.y) {
		translateToY = position.y - centerPosition.y + $(card).height() / 2;
	} else {
		translateToY = -centerPosition.y + position.y + $(card).height() / 2;
	}

	var t1 = timeline({
		targets: card,
	});
	//TODO: Ændre slutning til at kortet ender centralt i "maincontent" div.
	t1.add({
		translateX: translateToX,
		translateY: translateToY,
		easing: "easeOutQuint",
		duration: 1000,
	});
	position = {
		x: $(card).position().left,
		y: $(card).position().top,
	};

	return t1.finished;
}

const ord = ["ord1", "ord2", "ord3", "ord4", "ord5", "ord6"];
let viewportWidth = window.innerWidth / 2;
let viewportHeight = window.innerHeight / 2;
let position = {};
let centerPosition = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
};

$(() => {
	let draggable = false;
	let offset = 5;
	ord.forEach((element, index) => {
		let card = `
        <div class='cardcontainer cardcontainer${index}' id='cardcontainer${index}'>
            <div class="card card${index}" id='card${index}'>
                <div class="front">Bagside af kort</div>
                <div class="back">${element}</div>
            </div>
        </div>`;
		$(".cardStack-Container").append(card);
		let zlayer = $(".front").css("z-index");
		$(`#card${index}`).css({
			transform: `translateX(${offset}px)`,
			"z-index": zlayer + index,
		});
		offset += 5;
	});

	let helpIcon = `<div class='helpIcon'>${(icon({prefix: 'fas', iconName: 'question-circle'}).html)}</div>`
	$(".cardStack-Container").append(helpIcon);

	$(window).resize(function () {
		animationToCenter(`.card5`);
	});

	$("#tutorialbutton").on("click", () => {
		$(".tutorial").remove();
		$("#tutorialbutton").remove();
		$("#drawcardContainer").css("visibility", "visible");
		$(".curtain").remove();
		$(".speaker").append(icon({prefix: 'fas', iconName: 'volume-up'}).html);
	});
	//TODO find a method to place the card in a container when the animation is done
	$("#drawCard").on("click", async () => {
		animationFromStack(`.card5`).then(() => {
			draggable = true;
			if (draggable === true) {
				interact(".card5")
					.draggable({
						listeners: {
							start(event) {
								$(".vokalE, .vokalÆ").css({
									opacity: 0.5,
									"border-style": "dashed",
								});
							},
							move(event) {
								position.x += event.dx;
								position.y += event.dy;

								event.target.style.transform = `translate(${position.x}px, ${position.y}px) rotateX(180deg)`;
							},
						},
					})
					.on("dragend", (event) => {
						animationToCenter(".card5").then(() => {
							position = { x: viewportWidth, y: viewportHeight };
						});
						$(".vokalE, .vokalÆ").css({
							opacity: 1,
							"border-style": "none",
						});
					});
			}
		});
	});

	interact(".vokalE").dropzone({
		accept: ".card",
		ondrop: function (event) {
			alert("Hello");
			//Rigtigt eller fokert svar
		},
	});

	interact(".vokalÆ").dropzone({
		accept: ".card",
		ondrop: function (event) {
			alert("Hello");
			//Rigtigt eller fokert svar
		},
	});

	//Indsætning af ikon (krydset)
	$(".close").append(icon({prefix: 'fas', iconName: 'times'}).html);

	$(".close svg").on("click", function() {
		alert("Closing...");
		//Afslut opgaven og gem fremskridt for at kunne fortsætte hvor man slap
	})

	//Viser tutorial igen ved klik på hjælp ikon
	$(".helpIcon").on("click", function() {
		$(".tutorial").css("visibility", "visible");
		$("#tutorialbutton").css("visibility", "visible");
		$("#drawcardContainer").css("visibility", "visible");
		let curtain = `<div class="curtain"></div>`
		$("body").append(curtain);
		$(".speaker").remove();
	})

});
