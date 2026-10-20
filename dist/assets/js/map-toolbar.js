//#region src/assets/js/modules/map-popup.js
function anchorMapPopup(popup) {
	let anchor;
	const position = () => {
		if (!anchor || popup.hidden) return;
		const parent = popup.offsetParent;
		if (!parent) return;
		const pin = anchor.getBoundingClientRect();
		const bounds = parent.getBoundingClientRect();
		const scaleX = bounds.width / parent.offsetWidth || 1;
		const scaleY = bounds.height / parent.offsetHeight || 1;
		popup.style.left = `${(pin.left + pin.width / 2 - bounds.left) / scaleX - parent.clientLeft + parent.scrollLeft}px`;
		popup.style.top = `${(pin.top - bounds.top) / scaleY - parent.clientTop + parent.scrollTop - 8}px`;
	};
	const observer = new ResizeObserver(position);
	observer.observe(popup.parentElement);
	window.addEventListener("resize", position);
	return (pin) => {
		if (anchor) observer.unobserve(anchor);
		anchor = pin;
		if (anchor) observer.observe(anchor);
		position();
	};
}
//#endregion
//#region src/assets/js/modules/map-toolbar.js
function initMapToolbar(stage) {
	const toolbar = stage.querySelector(".map-toolbar");
	if (!toolbar) return;
	const tools = [...toolbar.querySelectorAll("[data-map-tool]")];
	const slider = toolbar.querySelector("[data-zoom]");
	const output = toolbar.querySelector("[data-zoom-output]");
	const stepButtons = [...toolbar.querySelectorAll("[data-zoom-step]")];
	const minimum = Number(slider.min);
	const maximum = Number(slider.max);
	function updateLevel(value) {
		const level = Math.min(maximum, Math.max(minimum, Number(value)));
		slider.value = String(level);
		slider.style.setProperty("--progress", `${(level - minimum) / (maximum - minimum) * 100}%`);
		slider.setAttribute("aria-valuetext", `${level}단계`);
		output.value = `Lv.${level}`;
		stepButtons.forEach((button) => {
			button.disabled = Number(button.dataset.zoomStep) > 0 ? level === maximum : level === minimum;
		});
	}
	const paintTool = (tool) => {
		const image = tool.querySelector("img");
		if (!image?.dataset.iconOn) return;
		image.src = tool.getAttribute("aria-pressed") === "true" ? image.dataset.iconOn : image.dataset.iconOff;
	};
	tools.forEach((button) => {
		button.addEventListener("click", () => {
			const selected = button.getAttribute("aria-pressed") !== "true";
			tools.forEach((tool) => {
				tool.setAttribute("aria-pressed", String(tool === button && selected));
				paintTool(tool);
			});
			if (button.dataset.mapTool === "overview" && selected) updateLevel(slider.defaultValue);
		});
	});
	toolbar.querySelectorAll("[data-map-action]").forEach((button) => {
		button.addEventListener("click", () => {
			tools.forEach((tool) => {
				tool.setAttribute("aria-pressed", "false");
				paintTool(tool);
			});
			updateLevel(slider.defaultValue);
		});
	});
	slider.addEventListener("input", () => updateLevel(slider.value));
	stepButtons.forEach((button) => {
		button.addEventListener("click", () => updateLevel(Number(slider.value) + Number(button.dataset.zoomStep)));
	});
	updateLevel(slider.value);
}
//#endregion
globalThis.anchorMapPopup = anchorMapPopup;
globalThis.initMapToolbar = initMapToolbar;
