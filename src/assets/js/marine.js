import { anchorMapPopup } from './modules/map-popup.js';
import { initMapToolbar } from './modules/map-toolbar.js';
import { driftTypes } from '../../data/drift-types.js';
import { images } from '../../data/images.js';

const stage = document.querySelector('.marine-stage');
if (stage) initMarine(stage);

function initMarine(stage) {
  initMapToolbar(stage);
  const query = (selector) => stage.querySelector(selector);
  const queryAll = (selector) => [...stage.querySelectorAll(selector)];
  const imageUrl = (file) => `${stage.dataset.root}/images/${file}`;
  const toggle = (button, attribute = 'aria-pressed') => {
    const active = button.getAttribute(attribute) !== 'true';
    button.setAttribute(attribute, String(active));
    return active;
  };

  queryAll('.date-result__toggle').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById(button.getAttribute('aria-controls')).hidden = !toggle(
        button,
        'aria-expanded',
      );
    });
  });
  query('.marine-tabs .is-active')?.setAttribute('aria-current', 'page');
  query('[data-query]')?.addEventListener('submit', (event) => event.preventDefault());
  query('[data-deselect]')?.addEventListener('click', () => {
    queryAll('[data-set-select]').forEach((input) => {
      input.checked = false;
    });
  });
  const playbackButton = query('[data-playback-toggle]');
  const setPlayback = (playing) => {
    playbackButton.setAttribute('aria-pressed', String(playing));
    playbackButton.setAttribute('aria-label', playing ? '재생 중' : '일시정지');
    playbackButton.querySelector('span').textContent = playing ? '재생 중' : '일시정지';
    playbackButton.querySelector('img').src = imageUrl(playing ? images.play : images.pause);
  };
  playbackButton?.addEventListener('click', () => {
    setPlayback(playbackButton.getAttribute('aria-pressed') !== 'true');
  });

  queryAll(
    '[data-depth], [data-vertical-view], [data-target-visible], [data-target-select]',
  ).forEach((button) => {
    button.addEventListener('click', () => toggle(button));
  });
  const applySymbolSize = (value, markChanged = true) => {
    const input = query('#symbol-size');
    if (!input) return;
    const size = String(value);
    input.value = size;
    const percent =
      ((Number(size) - Number(input.min)) / (Number(input.max) - Number(input.min))) * 100;
    input.style.setProperty('--progress', `${percent}%`);
    input.closest('.range-control')?.classList.toggle('is-changed', markChanged);
    query('[data-symbol-output]').textContent = `${size}px`;
    queryAll('[data-symbol-size]').forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.symbolSize === size)),
    );
  };
  queryAll('[data-single-choice], .playback__speeds, .style-color__palette').forEach((group) => {
    group.addEventListener('click', (event) => {
      const selected = event.target.closest('button');
      if (!selected) return;
      group
        .querySelectorAll('button')
        .forEach((button) => button.setAttribute('aria-pressed', String(button === selected)));
    });
  });
  query('.style-symbol__options')?.addEventListener('click', (event) => {
    const selected = event.target.closest('[data-symbol-size]');
    if (!selected) return;
    applySymbolSize(selected.dataset.symbolSize);
  });
  queryAll('[data-layer-switch]').forEach((button) => {
    button.addEventListener('click', () => {
      const active = toggle(button, 'aria-checked');
      button.querySelector('img').src = imageUrl(active ? images.toggleOn : images.toggleOff);
      button.closest('.layer-option').querySelector('[data-switch-state]').textContent = active
        ? 'ON'
        : 'OFF';
    });
  });

  queryAll('.range-control input[type="range"]').forEach((input) => {
    input.addEventListener('input', () => {
      const percent =
        ((Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min))) * 100;
      input.style.setProperty('--progress', `${percent}%`);
      input.closest('.range-control')?.classList.add('is-changed');
      const output = input.closest('label')?.querySelector('output');
      if (output)
        output.textContent = `${Number(input.value).toLocaleString('ko-KR')}${input.dataset.unit ?? ''}`;
      if (input.name === 'size') applySymbolSize(input.value);
    });
  });

  const camera = query('[data-camera-panel]');
  const cameraButton = query('[data-camera-open]');
  const setCamera = (open) => {
    if (!camera) return;
    camera.hidden = !open;
    cameraButton.setAttribute('aria-expanded', String(open));
  };
  cameraButton?.addEventListener('click', () => setCamera(camera.hidden));
  query('[data-camera-close]')?.addEventListener('click', () => {
    setCamera(false);
    cameraButton.focus();
  });
  setCamera(stage.dataset.cameraInitial === 'true');
  const targetList = query('[data-target-list]');
  query('[data-target-toggle]')?.addEventListener('click', (event) => {
    targetList.hidden = !toggle(event.currentTarget, 'aria-expanded');
  });
  if (stage.dataset.targetInitial === 'true') {
    targetList.hidden = false;
    targetList.children[2]?.classList.add('is-selected');
  }

  const poi = query('[data-poi]');
  if (poi) {
    const anchorPoi = anchorMapPopup(poi);
    let selectedCluster = query('[data-cluster]');
    poi.hidden = stage.dataset.clusterInitial !== 'true';
    anchorPoi(selectedCluster);
    queryAll('[data-cluster]').forEach((button) => {
      button.addEventListener('click', () => {
        poi.hidden = selectedCluster === button && !poi.hidden;
        selectedCluster = button;
        queryAll('[data-cluster]').forEach((marker) => {
          marker.setAttribute('aria-expanded', String(marker === button && !poi.hidden));
        });
        anchorPoi(button);
      });
    });
  }

  const backdrop = query('[data-style-backdrop]');
  const dialog = query('[data-style-dialog]');
  const form = query('[data-style-form]');
  const siblings = [...stage.children].filter((item) => item !== backdrop);
  let lastFocus;
  function openStyle(id) {
    const type = driftTypes.find((item) => item.id === id) ?? driftTypes[0];
    lastFocus = document.activeElement;
    form.reset();
    query('#style-dialog-title').textContent = type.name;
    form.elements.alias.defaultValue = type.name;
    form.elements.alias.value = type.name;
    query('[data-style-dot]').src = imageUrl(type.dot);
    query('[data-style-notice-icon]').src = imageUrl(type.notice);
    query('.style-notice').style.setProperty('--item-color', type.color);
    queryAll('[data-symbol-size] img').forEach((img, index) => {
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
    queryAll('[data-color]').forEach((button, index) =>
      button.setAttribute('aria-pressed', String(index === 0)),
    );
  }
  function closeStyle() {
    backdrop.hidden = true;
    siblings.forEach((item) => {
      item.inert = false;
    });
    if (lastFocus?.isConnected && lastFocus !== document.body)
      lastFocus.focus({ preventScroll: true });
    else query('.standalone-reopen')?.focus({ preventScroll: true });
  }
  queryAll('[data-style-open]').forEach((button) =>
    button.addEventListener('click', () => openStyle(button.dataset.styleOpen)),
  );
  query('[data-style-close]').addEventListener('click', closeStyle);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    closeStyle();
  });
  query('[data-style-reset]').addEventListener('click', () => {
    form.reset();
    resetStyle();
  });
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeStyle();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button,input')].filter((item) => !item.disabled);
    if (
      event.shiftKey &&
      (document.activeElement === controls[0] || document.activeElement === dialog)
    ) {
      event.preventDefault();
      controls.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === controls.at(-1)) {
      event.preventDefault();
      controls[0].focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!backdrop.hidden) closeStyle();
    else if (camera && !camera.hidden) {
      setCamera(false);
      cameraButton.focus();
    } else if (poi) {
      poi.hidden = true;
      queryAll('[data-cluster]').forEach((marker) => marker.setAttribute('aria-expanded', 'false'));
    }
  });

  if (stage.dataset.modalInitial === 'true') openStyle(dialog.dataset.styleType);
  if (stage.dataset.playingInitial === 'true') {
    const icon = query('[data-row-play] img');
    if (icon) icon.src = imageUrl(images.rowPlaying);
  }
  if (stage.dataset.screen === 'drift-style') {
    const icon = query('.result-row [data-style-open="surface"] img');
    if (icon) icon.src = imageUrl(images.rowEditing);
  }
}
