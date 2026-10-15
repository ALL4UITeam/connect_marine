import { anchorMapPopup } from './modules/map-popup.js';
import { initMapToolbar } from './modules/map-toolbar.js';

const stage = document.querySelector('.support-stage');
if (stage) {
  ['hidden', 'checked', 'open'].forEach((attribute) => {
    stage.querySelectorAll('[data-initial-' + attribute + ']').forEach((element) => {
      element[attribute] = element.getAttribute('data-initial-' + attribute) === 'true';
      element.removeAttribute('data-initial-' + attribute);
    });
  });
  initMapToolbar(stage);
  const q = (selector) => stage.querySelector(selector);
  const all = (selector) => [...stage.querySelectorAll(selector)];
  const image = (file) => `${stage.dataset.root}/images/support/${file}`;
  q('.marine-tabs .is-active')?.setAttribute('aria-current', 'page');
  const layerPanel = q('[data-layer-panel]');
  let layerFocus;
  function setLayers(open) {
    layerPanel.hidden = !open;
    all('[data-layer-toggle]').forEach((button) =>
      button.setAttribute('aria-expanded', String(open)),
    );
    if (open) {
      layerFocus = document.activeElement;
      layerPanel.focus({ preventScroll: true });
    } else layerFocus?.focus({ preventScroll: true });
  }
  all('[data-layer-toggle]').forEach((button) =>
    button.addEventListener('click', () => setLayers(layerPanel.hidden)),
  );
  q('[data-layer-close]').addEventListener('click', () => setLayers(false));
  function updateLayers() {
    const checked = all('[data-support-layer]:checked');
    all('[data-layer-count]').forEach((node) => {
      const scope = node.closest('.layer-category') || layerPanel;
      node.textContent = scope.querySelectorAll('[data-support-layer]:checked').length || '';
    });
    q('[data-layer-chips]').hidden = checked.length === 0;
    const list = q('[data-layer-chip-list]');
    list.replaceChildren();
    checked.forEach((input) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.chip = input.value;
      button.setAttribute('aria-label', `${input.value} 선택 해제`);
      button.append(document.createTextNode(input.value));
      const icon = document.createElement('img');
      icon.src = image('chip-close.svg');
      icon.alt = '';
      button.append(icon);
      button.addEventListener('click', () => {
        input.checked = false;
        updateLayers();
        input.focus();
      });
      list.append(button);
    });
  }
  all('[data-support-layer]').forEach((input) => input.addEventListener('change', updateLayers));
  q('[data-layer-reset]').addEventListener('click', () => {
    all('[data-support-layer]').forEach((input) => {
      input.checked = false;
    });
    updateLayers();
  });
  updateLayers();
  all('[data-layer-toggle]').forEach((button) =>
    button.setAttribute('aria-expanded', String(!layerPanel.hidden)),
  );
  all('[data-grid]').forEach((button) =>
    button.addEventListener('click', () => {
      all('[data-grid]').forEach((row) => {
        row.classList.toggle('is-selected', row === button);
        row.setAttribute('aria-pressed', String(row === button));
      });
    }),
  );
  all('.support-pagination').forEach((nav) => {
    let current = 1;
    const update = () =>
      nav.querySelectorAll('[data-page]').forEach((button) => {
        if (Number(button.dataset.page) === current) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
    nav.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      current = button.dataset.page
        ? Number(button.dataset.page)
        : Math.min(5, Math.max(1, current + Number(button.dataset.pageStep)));
      update();
    });
    update();
  });
  const form = q('[data-accident-query]');
  const results = q('[data-accident-results]');
  const detail = q('[data-accident-detail]');
  const anchorDetail = detail ? anchorMapPopup(detail) : null;
  let detailFocus;
  const closeDetail = () => {
    if (!detail) return;
    detail.hidden = true;
    detailFocus?.focus({ preventScroll: true });
  };
  function showResults() {
    if (!form) return;
    form.hidden = true;
    results.hidden = false;
    q('[data-accident-pins]').hidden = true;
    detail.hidden = true;
    q('[data-accident-clusters]').hidden = false;
    all('[data-accident-cluster]').forEach((button, index) => {
      button.hidden = index !== 3;
      button.querySelector('b').textContent = '5';
    });
    all('[data-accident-row]').forEach((row) => {
      row.classList.remove('is-selected');
      row.setAttribute('aria-pressed', 'false');
    });
    q('[data-query-back]').focus();
  }
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const end = form.elements.endYear;
    end.setCustomValidity(
      Number(form.elements.startYear.value) > Number(end.value)
        ? '종료 연도는 시작 연도 이후로 선택하세요.'
        : '',
    );
    if (form.reportValidity()) showResults();
  });
  function updateFilters() {
    all('.support-filter').forEach((group) => {
      const count = [...group.querySelectorAll('input:checked')].filter(
        (input) => input.value !== '전체',
      ).length;
      group.querySelector('[data-filter-count]').textContent = count || '';
    });
  }
  form?.addEventListener('change', (event) => {
    form.elements.endYear.setCustomValidity('');
    const input = event.target;
    if (input.type === 'checkbox') {
      const group = input.closest('.support-filter');
      if (input.value === '전체' && input.checked)
        group.querySelectorAll('input').forEach((item) => {
          if (item !== input) item.checked = false;
        });
      else if (input.checked) group.querySelector('input[value="전체"]').checked = false;
    }
    updateFilters();
  });
  form?.addEventListener('reset', () =>
    queueMicrotask(() => {
      all('.support-filter').forEach((group) => {
        group.open = false;
        group.querySelectorAll('input').forEach((input) => {
          input.checked = false;
        });
      });
      form.elements.startYear.value = '2017';
      form.elements.endYear.value = '2025';
      form.elements.endYear.setCustomValidity('');
      updateFilters();
    }),
  );
  updateFilters();
  q('[data-query-back]')?.addEventListener('click', () => {
    form.hidden = false;
    results.hidden = true;
    detail.hidden = true;
    q('[data-accident-pins]').hidden = true;
    q('[data-accident-clusters]').hidden = false;
    all('[data-accident-cluster]').forEach((button) => {
      button.hidden = false;
      button.querySelector('b').textContent = '4';
    });
    form.elements.startYear.focus();
  });
  all('[data-accident-cluster]').forEach((button) => button.addEventListener('click', showResults));
  function selectAccident(index) {
    all('[data-accident-row]').forEach((row) => {
      const selected = Number(row.dataset.accidentRow) === index;
      row.classList.toggle('is-selected', selected);
      row.setAttribute('aria-pressed', String(selected));
    });
    q('[data-accident-clusters]').hidden = true;
    q('[data-accident-pins]').hidden = false;
  }
  all('[data-accident-row]').forEach((button) =>
    button.addEventListener('click', () => {
      selectAccident(Number(button.dataset.accidentRow));
      detail.hidden = true;
    }),
  );
  all('[data-accident-pin]').forEach((button) =>
    button.addEventListener('click', () => {
      detailFocus = button;
      detail.hidden = false;
      anchorDetail(button);
      detail.focus({ preventScroll: true });
    }),
  );
  q('[data-detail-close]')?.addEventListener('click', closeDetail);
  if (stage.dataset.pins === 'true') selectAccident(0);
  if (detail && !detail.hidden) {
    detailFocus = q('[data-accident-pin]');
    anchorDetail(detailFocus);
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (detail && !detail.hidden) closeDetail();
      else if (!layerPanel.hidden) setLayers(false);
    }
  });
}
