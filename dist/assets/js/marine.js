(() => {
const { anchorMapPopup, initMapToolbar } = globalThis;
//#region src/data/images.js
var images = {
	zoomIn: "icons/zoom-in.svg",
	zoomOut: "icons/zoom-out.svg",
	measureDistance: "icons/measure-distance.svg",
	measureDistanceOn: "icons/measure-distance-on.svg",
	headerLogo: "logos/logo.svg",
	headerClose: "icons/header-close.svg",
	headerWave: "backgrounds/header-wave.svg",
	accordionChevron: "icons/accordion-chevron.svg",
	driftMenu: "icons/drift-menu.svg",
	supportMenu: "icons/support-menu.svg",
	menuBackground: "backgrounds/service-tab.svg",
	activeMenuBackground: "backgrounds/service-tab-active.svg",
	clusterMap: "maps/drift-clusters.png",
	selectChevron: "icons/select-chevron.svg",
	selectionCheck: "icons/selection-check.svg",
	clusterPointer: "icons/cluster-pointer.svg",
	measureArea: "icons/measure-area.svg",
	measureAreaOn: "icons/measure-area-on.svg",
	measureDepth: "icons/measure-depth.svg",
	measureDepthOn: "icons/measure-depth-on.svg",
	compass: "icons/compass.svg",
	compassOn: "icons/compass-on.svg",
	fullMap: "icons/full-map.svg",
	fullMapOn: "icons/full-map-on.svg",
	resetMap: "icons/reset-map.svg",
	zoomScale: "icons/zoom-scale.svg",
	routeMap: "maps/drift-routes.png",
	oceanMap: "maps/ocean-currents.png",
	terrainMap: "maps/seabed-terrain.png",
	play: "icons/play.svg",
	pause: "icons/pause.svg",
	rowPlay: "icons/row-play.svg",
	rowStyle: "icons/row-style.svg",
	rowPlaying: "icons/row-playing.svg",
	rowEditing: "icons/row-editing.svg",
	camera: "icons/camera.svg",
	cameraClose: "icons/camera-close.svg",
	check: "icons/check.svg",
	agency: "logos/ministry-oceans-fisheries.png",
	setPlay: "icons/set-play.svg",
	slider: "controls/playback-slider-fill.svg",
	modalSlider: "controls/settings-slider-fill.svg",
	modalClose: "icons/modal-close.svg",
	selectedColor: "icons/selected-color.svg",
	toggleOn: "icons/toggle-on.svg",
	toggleOff: "icons/toggle-off.svg",
	poiArrow: "icons/poi-arrow.svg"
};
var markerImages = {
	surface: {
		pointer: "markers/surface-pointer.svg",
		dot: "markers/surface-dot.svg",
		notice: "icons/surface-notice.svg",
		symbols: [
			"markers/symbol-2px.svg",
			"markers/symbol-4px.svg",
			"markers/symbol-6px.svg",
			"markers/symbol-8px.svg",
			"markers/symbol-10px.svg",
			"markers/symbol-12px.svg",
			"markers/symbol-16px.svg"
		]
	},
	depth10: {
		pointer: "markers/depth10-pointer.svg",
		dot: "markers/depth10-dot.svg",
		notice: "icons/depth10-notice.svg",
		symbols: [
			"markers/symbol-2px.svg",
			"markers/symbol-4px.svg",
			"markers/symbol-6px.svg",
			"markers/symbol-8px.svg",
			"markers/symbol-10px.svg",
			"markers/symbol-12px.svg",
			"markers/symbol-16px.svg"
		]
	},
	depth20: {
		pointer: "markers/depth20-pointer.svg",
		dot: "markers/depth20-dot.svg",
		notice: "icons/depth20-notice.svg",
		symbols: [
			"markers/symbol-2px.svg",
			"markers/symbol-4px.svg",
			"markers/symbol-6px.svg",
			"markers/symbol-8px.svg",
			"markers/symbol-10px.svg",
			"markers/symbol-12px.svg",
			"markers/symbol-16px.svg"
		]
	},
	prediction: {
		pointer: "markers/prediction-pointer.svg",
		dot: "markers/prediction-dot.svg",
		notice: "icons/prediction-notice.svg",
		symbols: [
			"markers/symbol-2px.svg",
			"markers/symbol-4px.svg",
			"markers/symbol-6px.svg",
			"markers/symbol-8px.svg",
			"markers/symbol-10px.svg",
			"markers/symbol-12px.svg",
			"markers/symbol-16px.svg"
		]
	},
	ai: {
		pointer: "markers/ai-pointer.svg",
		dot: "markers/ai-dot.svg",
		notice: "icons/ai-notice.svg",
		symbols: [
			"markers/symbol-2px.svg",
			"markers/symbol-4px.svg",
			"markers/symbol-6px.svg",
			"markers/symbol-8px.svg",
			"markers/symbol-10px.svg",
			"markers/symbol-12px.svg",
			"markers/symbol-16px.svg"
		]
	}
};
//#endregion
//#region src/data/drift-types.js
var driftTypes = [
	{
		id: "surface",
		name: "실측 - 표층",
		short: "실측-표층",
		marker: "표층",
		color: "#569300",
		x: 1266,
		y: 419,
		depth: "surface"
	},
	{
		id: "depth10",
		name: "실측 - 10m",
		short: "실측-10m",
		marker: "침강(10M)",
		color: "#008008",
		x: 1163,
		y: 515,
		depth: "10m"
	},
	{
		id: "depth20",
		name: "실측 - 20m",
		short: "실측-20m",
		marker: "침강(20M)",
		color: "#00828c",
		x: 1033,
		y: 557,
		depth: "20m"
	},
	{
		id: "prediction",
		name: "예측 결과",
		short: "예측 결과 (표층)",
		marker: "예측",
		color: "#e88843",
		x: 920,
		y: 637
	},
	{
		id: "ai",
		name: "AI 분석 결과",
		short: "AI 분석 결과",
		marker: "AI분석",
		color: "#934fce",
		x: 808,
		y: 709
	}
].map((type) => ({
	...type,
	left: type.x / 1920 * 100,
	top: type.y / 1080 * 100,
	arrow: markerImages[type.id].pointer,
	dot: markerImages[type.id].dot,
	notice: markerImages[type.id].notice,
	symbols: [
		2,
		4,
		6,
		8,
		10,
		12,
		16
	].map((size, index) => ({
		file: markerImages[type.id].symbols[index],
		size,
		selected: size === 6
	}))
}));
//#endregion
//#region src/assets/js/marine.js
var stage = document.querySelector(".marine-stage");
if (stage) initMarine(stage);
function initMarine(stage) {
	initMapToolbar(stage);
	const query = (selector) => stage.querySelector(selector);
	const queryAll = (selector) => [...stage.querySelectorAll(selector)];
	const imageUrl = (file) => `${stage.dataset.root}/images/${file}`;
	const toggle = (button, attribute = "aria-pressed") => {
		const active = button.getAttribute(attribute) !== "true";
		button.setAttribute(attribute, String(active));
		return active;
	};
	queryAll(".date-result__toggle").forEach((button) => {
		button.addEventListener("click", () => {
			document.getElementById(button.getAttribute("aria-controls")).hidden = !toggle(button, "aria-expanded");
		});
	});
	query(".marine-tabs .is-active")?.setAttribute("aria-current", "page");
	query("[data-query]")?.addEventListener("submit", (event) => event.preventDefault());
	query("[data-deselect]")?.addEventListener("click", () => {
		queryAll("[data-set-select]").forEach((input) => {
			input.checked = false;
		});
	});
	const playbackButton = query("[data-playback-toggle]");
	const setPlayback = (playing) => {
		playbackButton.setAttribute("aria-pressed", String(playing));
		playbackButton.setAttribute("aria-label", playing ? "재생 중" : "일시정지");
		playbackButton.querySelector("span").textContent = playing ? "재생 중" : "일시정지";
		playbackButton.querySelector("img").src = imageUrl(playing ? images.play : images.pause);
	};
	playbackButton?.addEventListener("click", () => {
		setPlayback(playbackButton.getAttribute("aria-pressed") !== "true");
	});
	queryAll("[data-depth], [data-vertical-view], [data-target-visible], [data-target-select]").forEach((button) => {
		button.addEventListener("click", () => toggle(button));
	});
	const applySymbolSize = (value, markChanged = true) => {
		const input = query("#symbol-size");
		if (!input) return;
		const size = String(value);
		input.value = size;
		const percent = (Number(size) - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100;
		input.style.setProperty("--progress", `${percent}%`);
		input.closest(".range-control")?.classList.toggle("is-changed", markChanged);
		query("[data-symbol-output]").textContent = `${size}px`;
		queryAll("[data-symbol-size]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.symbolSize === size)));
	};
	queryAll("[data-single-choice], .playback__speeds, .style-color__palette").forEach((group) => {
		group.addEventListener("click", (event) => {
			const selected = event.target.closest("button");
			if (!selected) return;
			group.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button === selected)));
		});
	});
	query(".style-symbol__options")?.addEventListener("click", (event) => {
		const selected = event.target.closest("[data-symbol-size]");
		if (!selected) return;
		applySymbolSize(selected.dataset.symbolSize);
	});
	queryAll("[data-layer-switch]").forEach((button) => {
		button.addEventListener("click", () => {
			const active = toggle(button, "aria-checked");
			button.querySelector("img").src = imageUrl(active ? images.toggleOn : images.toggleOff);
			button.closest(".layer-option").querySelector("[data-switch-state]").textContent = active ? "ON" : "OFF";
		});
	});
	queryAll(".range-control input[type=\"range\"]").forEach((input) => {
		input.addEventListener("input", () => {
			const percent = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100;
			input.style.setProperty("--progress", `${percent}%`);
			input.closest(".range-control")?.classList.add("is-changed");
			const output = input.closest("label")?.querySelector("output");
			if (output) output.textContent = `${Number(input.value).toLocaleString("ko-KR")}${input.dataset.unit ?? ""}`;
			if (input.name === "size") applySymbolSize(input.value);
		});
	});
	const camera = query("[data-camera-panel]");
	const cameraButton = query("[data-camera-open]");
	const setCamera = (open) => {
		if (!camera) return;
		camera.hidden = !open;
		cameraButton.setAttribute("aria-expanded", String(open));
	};
	cameraButton?.addEventListener("click", () => setCamera(camera.hidden));
	query("[data-camera-close]")?.addEventListener("click", () => {
		setCamera(false);
		cameraButton.focus();
	});
	setCamera(stage.dataset.cameraInitial === "true");
	const targetList = query("[data-target-list]");
	query("[data-target-toggle]")?.addEventListener("click", (event) => {
		targetList.hidden = !toggle(event.currentTarget, "aria-expanded");
	});
	if (stage.dataset.targetInitial === "true") {
		targetList.hidden = false;
		targetList.children[2]?.classList.add("is-selected");
	}
	const poi = query("[data-poi]");
	if (poi) {
		const anchorPoi = anchorMapPopup(poi);
		let selectedCluster = query("[data-cluster]");
		poi.hidden = stage.dataset.clusterInitial !== "true";
		anchorPoi(selectedCluster);
		queryAll("[data-cluster]").forEach((button) => {
			button.addEventListener("click", () => {
				poi.hidden = selectedCluster === button && !poi.hidden;
				selectedCluster = button;
				queryAll("[data-cluster]").forEach((marker) => {
					marker.setAttribute("aria-expanded", String(marker === button && !poi.hidden));
				});
				anchorPoi(button);
			});
		});
	}
	const backdrop = query("[data-style-backdrop]");
	const dialog = query("[data-style-dialog]");
	const form = query("[data-style-form]");
	const siblings = [...stage.children].filter((item) => item !== backdrop);
	let lastFocus;
	function openStyle(id) {
		const type = driftTypes.find((item) => item.id === id) ?? driftTypes[0];
		lastFocus = document.activeElement;
		form.reset();
		query("#style-dialog-title").textContent = type.name;
		form.elements.alias.defaultValue = type.name;
		form.elements.alias.value = type.name;
		query("[data-style-dot]").src = imageUrl(type.dot);
		query("[data-style-notice-icon]").src = imageUrl(type.notice);
		query(".style-notice").style.setProperty("--item-color", type.color);
		queryAll("[data-symbol-size] img").forEach((img, index) => {
			img.src = imageUrl(type.symbols[index].file);
		});
		resetStyle();
		backdrop.hidden = false;
		siblings.forEach((item) => {
			item.inert = true;
		});
		dialog.focus({ preventScroll: true });
	}
	function resetStyle() {
		applySymbolSize(6, false);
		queryAll("[data-color]").forEach((button, index) => button.setAttribute("aria-pressed", String(index === 0)));
	}
	function closeStyle() {
		backdrop.hidden = true;
		siblings.forEach((item) => {
			item.inert = false;
		});
		if (lastFocus?.isConnected && lastFocus !== document.body) lastFocus.focus({ preventScroll: true });
		else query(".standalone-reopen")?.focus({ preventScroll: true });
	}
	queryAll("[data-style-open]").forEach((button) => button.addEventListener("click", () => openStyle(button.dataset.styleOpen)));
	query("[data-style-close]").addEventListener("click", closeStyle);
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		closeStyle();
	});
	query("[data-style-reset]").addEventListener("click", () => {
		form.reset();
		resetStyle();
	});
	backdrop.addEventListener("click", (event) => {
		if (event.target === backdrop) closeStyle();
	});
	dialog.addEventListener("keydown", (event) => {
		if (event.key !== "Tab") return;
		const controls = [...dialog.querySelectorAll("button,input")].filter((item) => !item.disabled);
		if (event.shiftKey && (document.activeElement === controls[0] || document.activeElement === dialog)) {
			event.preventDefault();
			controls.at(-1).focus();
		} else if (!event.shiftKey && document.activeElement === controls.at(-1)) {
			event.preventDefault();
			controls[0].focus();
		}
	});
	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;
		if (!backdrop.hidden) closeStyle();
		else if (camera && !camera.hidden) {
			setCamera(false);
			cameraButton.focus();
		} else if (poi) {
			poi.hidden = true;
			queryAll("[data-cluster]").forEach((marker) => marker.setAttribute("aria-expanded", "false"));
		}
	});
	if (stage.dataset.modalInitial === "true") openStyle(dialog.dataset.styleType);
	if (stage.dataset.playingInitial === "true") {
		const icon = query("[data-row-play] img");
		if (icon) icon.src = imageUrl(images.rowPlaying);
	}
	if (stage.dataset.screen === "drift-style") {
		const icon = query(".result-row [data-style-open=\"surface\"] img");
		if (icon) icon.src = imageUrl(images.rowEditing);
	}
}
//#endregion
})();
