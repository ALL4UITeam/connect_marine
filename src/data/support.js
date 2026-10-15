const definitions = [
  ['traffic', '교통정보', '105:30339'],
  ['traffic-layers', '교통정보 — 해양 레이어', '178:23844'],
  ['traffic-active', '교통정보 — 활성 레이어', '123:13675'],
  ['accident', '해양사고 조회', '105:30529'],
  ['accident-filter', '해양사고 — 사고종류 선택', '135:22314'],
  ['accident-results', '해양사고 — 결과조회', '135:22515'],
  ['accident-selected', '해양사고 — 목록 선택', '139:23726'],
  ['accident-detail', '해양사고 — 상세 정보', '189:17338'],
  ['layer-collapsed', '해양 레이어 — 접힘', '128:17221'],
  ['layer-expanded', '해양 레이어 — 펼침', '128:17258'],
  ['layer-active', '해양 레이어 — 선택 목록', '128:17295'],
];
export const supportScreens = definitions.map(([id, title, figmaNode], index) => ({
  id,
  title,
  figmaNode,
  group: '해양업무지원',
  number: String(index + 16).padStart(2, '0'),
  href: `/pages/${id}.html`,
}));
export const supportPages = Object.fromEntries(
  supportScreens.map((screen) => {
    const isTraffic = screen.id.startsWith('traffic');
    const layerOnly = screen.id.startsWith('layer-');
    const results = ['accident-results', 'accident-selected', 'accident-detail'].includes(
      screen.id,
    );
    return [
      screen.href,
      {
        ...screen,
        title: `${screen.title} | 속초시 해양서비스`,
        isSupport: true,
        isTraffic,
        layerOnly,
        results,
        pins: ['accident-selected', 'accident-detail'].includes(screen.id),
        detail: screen.id === 'accident-detail',
        filtersOpen: screen.id === 'accident-filter',
        layerOpen: layerOnly || ['traffic-layers', 'traffic-active'].includes(screen.id),
        layerExpanded: screen.id !== 'layer-collapsed',
        activeLayers: ['traffic-active', 'layer-active'].includes(screen.id),
        map: isTraffic
          ? screen.id === 'traffic'
            ? 'traffic-map.png'
            : 'traffic-layers-map.png'
          : results
            ? 'accident-results-map.png'
            : 'accident-map.png',
      },
    ];
  }),
);
export const supportContext = {
  trafficRows: [14, 9, 18, 12, 6, 4, 8, 3].map((count, i) => ({
    id: `C${i + 1}`,
    count,
    density: [88, 56, 95, 70, 38, 25, 50, 19][i],
    tone:
      [88, 56, 95, 70, 38, 25, 50, 19][i] >= 80
        ? 'danger'
        : [88, 56, 95, 70, 38, 25, 50, 19][i] >= 50
          ? 'warning'
          : 'success',
    hot: [0, 2, 3].includes(i),
    selected: i === 2,
  })),
  pagination: [1, 2, 3, 4, 5],
  years: Array.from({ length: 10 }, (_, i) => 2017 + i),
  accidentFilters: [
    {
      id: 'kind',
      label: '사고종류',
      open: true,
      options: ['전체', '충돌', '전복', '침몰', '화재·폭발', '안전사고'].map((label, i) => ({
        label,
        checked: i === 0,
      })),
    },
    {
      id: 'damage',
      label: '인명피해',
      open: true,
      options: ['전체', '사망', '실종', '부상'].map((label, i) => ({
        label,
        checked: i === 1 || i === 2,
      })),
    },
    {
      id: 'tonnage',
      label: '톤수별',
      options: ['전체', '20톤 미만', '20~100톤', '100~500톤', '500톤 이상'].map((label) => ({
        label,
      })),
    },
    {
      id: 'purpose',
      label: '선박용도',
      options: ['전체', '어선', '화물선', '여객선', '기타'].map((label) => ({ label })),
    },
  ],
  accidentRows: ['사망 1', '-', '실종 1', '부상 1', '기타 1'].map((damage, index) => ({
    index,
    damage,
    kind: index === 1 ? '해양오염' : '화재·폭발',
    tone: ['danger', '', 'neutral', 'warning', 'info'][index],
  })),
  accidentClusters: [
    [1409, 518, '속초항 인근'],
    [1226, 471, '속초 동방'],
    [1289, 331, '고성 · 북방'],
    [1293, 627, '속초 · 남방'],
  ].map(([x, y, label], index) => ({
    left: x / 19.2,
    top: y / 10.8,
    label,
    index,
    last: index === 3,
  })),
  accidentPins: [
    [1246, 399, 'missing', true],
    [1306, 485, 'death', false],
    [1422, 489, 'death', false],
    [1296, 639, 'injury', true],
    [1350, 542, 'other', true],
  ].map(([x, y, kind, warning], index) => ({
    left: x / 19.2,
    top: y / 10.8,
    kind,
    warning,
    index,
  })),
  damageLegend: [
    ['death', '사망 (빨간색)'],
    ['missing', '실종 (회색)'],
    ['injury', '부상 (주황색)'],
    ['other', '기타/무피해 (파란색)'],
  ].map(([kind, label]) => ({ kind, label })),
  layerGroups: [
    ['항로표지', ['고정표지', '이동표지', '교량등', '레이콘', 'AIS']],
    ['이상물체', ['간출암·암암·세암', '노출암', '어초']],
    ['해상교통', ['정박지_법령', '양길항로부', '진입금지']],
    ['금지해역', ['수중레저활동금지구역']],
  ].map(([label, items]) => ({
    label,
    items: items.map((name) => ({
      name,
      checked: ['고정표지', '교량등', '레이콘', '노출암', '정박지_법령'].includes(name),
      square: ['레이콘', '양길항로부', '진입금지', '수중레저활동금지구역'].includes(name),
      line: name === '이동표지',
    })),
  })),
  layerOther: ['항만경계', '업무지원(인허가관련)', '종합지도'],
};
