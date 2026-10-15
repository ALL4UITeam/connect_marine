export function initMapToolbar(stage) {
  const toolbar = stage.querySelector('.map-toolbar');
  if (!toolbar) return;

  const tools = [...toolbar.querySelectorAll('[data-map-tool]')];
  const slider = toolbar.querySelector('[data-zoom]');
  const output = toolbar.querySelector('[data-zoom-output]');
  const stepButtons = [...toolbar.querySelectorAll('[data-zoom-step]')];
  const minimum = Number(slider.min);
  const maximum = Number(slider.max);

  function updateLevel(value) {
    const level = Math.min(maximum, Math.max(minimum, Number(value)));
    slider.value = String(level);
    slider.style.setProperty('--progress', `${((level - minimum) / (maximum - minimum)) * 100}%`);
    slider.setAttribute('aria-valuetext', `${level}단계`);
    output.value = `Lv.${level}`;
    stepButtons.forEach((button) => {
      button.disabled = Number(button.dataset.zoomStep) > 0 ? level === maximum : level === minimum;
    });
  }

  tools.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.getAttribute('aria-pressed') !== 'true';
      tools.forEach((tool) =>
        tool.setAttribute('aria-pressed', String(tool === button && selected)),
      );
    });
  });
  toolbar.querySelectorAll('[data-map-action]').forEach((button) => {
    button.addEventListener('click', () => {
      tools.forEach((tool) => tool.setAttribute('aria-pressed', 'false'));
      updateLevel(slider.defaultValue);
    });
  });
  slider.addEventListener('input', () => updateLevel(slider.value));
  stepButtons.forEach((button) => {
    button.addEventListener('click', () =>
      updateLevel(Number(slider.value) + Number(button.dataset.zoomStep)),
    );
  });
  updateLevel(slider.value);
}
