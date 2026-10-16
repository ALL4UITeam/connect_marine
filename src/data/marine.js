import { supportScreens, supportPages, supportContext } from './support.js';
import { images, markerImages } from './images.js';
export { images } from './images.js';

export const driftTypes = [
  {
    id: 'surface',
    name: '실측 - 표층',
    short: '실측-표층',
    marker: '표층',
    color: '#569300',
    x: 1266,
    y: 419,
    depth: 'surface',
  },
  {
    id: 'depth10',
    name: '실측 - 10m',
    short: '실측-10m',
    marker: '침강(10M)',
    color: '#008008',
    x: 1163,
    y: 515,
    depth: '10m',
  },
  {
    id: 'depth20',
    name: '실측 - 20m',
    short: '실측-20m',
    marker: '침강(20M)',
    color: '#00828c',
    x: 1033,
    y: 557,
    depth: '20m',
  },
  {
    id: 'prediction',
    name: '예측 결과',
    short: '예측 결과 (표층)',
    marker: '예측',
    color: '#e88843',
    x: 920,
    y: 637,
  },
  {
    id: 'ai',
    name: 'AI 분석 결과',
    short: 'AI 분석 결과',
    marker: 'AI분석',
    color: '#934fce',
    x: 808,
    y: 709,
  },
].map((type) => ({
  ...type,
  left: (type.x / 1920) * 100,
  top: (type.y / 1080) * 100,
  arrow: markerImages[type.id].pointer,
  dot: markerImages[type.id].dot,
  notice: markerImages[type.id].notice,
  symbols: [2, 4, 6, 8, 10, 12, 16].map((size, index) => ({
    file: markerImages[type.id].symbols[index],
    size,
    selected: size === 6,
  })),
}));

export const screenList = [
  ['drift', '실측·예측결과 — 기본 화면', '조회조건 · 날짜 목록 · 클러스터', '실측·예측결과'],
  ['drift-cluster', '클러스터 상세 화면', '클러스터 정보 카드', '실측·예측결과'],
  ['drift-date', '날짜 선택', '날짜별 회차 목록 펼침', '실측·예측결과'],
  ['drift-set', '회차(세트) 선택', '세트 체크 · 표류 경로 · 재생 컨트롤', '실측·예측결과'],
  ['drift-play', '회차 재생', '재생 상태 · 속도 · 타임라인', '실측·예측결과'],
  ['drift-style', '스타일 수정', '별칭 · 색상 · 심볼 크기 팝업', '실측·예측결과'],
  ['drift-camera', '표류물 카메라 추적 1', '추적 패널 · 카메라 슬라이더', '실측·예측결과'],
  ['drift-camera-target', '표류물 카메라 추적 2', '추적 대상 목록 펼침', '실측·예측결과'],
  ['ocean', '해양정보', '해양환경 레이어 · 수심 · 범례', '레이어'],
  ['terrain', '지형정보', '컬러링 · 등고선 · 고도 슬라이더', '레이어'],
  ...driftTypes.map((type) => [
    `style-${type.id}`,
    `스타일 수정 — ${type.name}`,
    '유형별 팝업 단독 보기',
    '팝업',
  ]),
].map(([id, title, description, group], index) => ({
  id,
  title,
  description,
  group,
  number: String(index + 1).padStart(2, '0'),
  href: `/pages/${id}.html`,
}));

const days = [
  '1월 10일',
  '2월 18일',
  '3월 5일',
  '4월 12일',
  '5월 25일',
  '6월 3일',
  '7월 11일',
  '7월 25일',
  '8월 6일',
  '8월 20일',
  '9월 5일',
  '3월 7일',
  '6월 4일',
  '7월 12일',
  '5월 27일',
  '5월 28일',
];
const clusterData = [
  [835, 338, 2, '01-10'],
  [882, 488, 2, '04-12'],
  [999, 541, 2, '06-03'],
  [1093, 454, 2, '06-04'],
  [1140, 347, 2, '01-10'],
  [784, 705, 1, '02-18'],
  [952, 790, 1, '09-05'],
  [1191, 768, 1, '08-20'],
  [1084, 673, 2, '08-06'],
];

export const marinePages = Object.fromEntries(
  screenList.map((screen) => {
    const standalone = screen.id.startsWith('style-');
    const isOcean = screen.id === 'ocean';
    const isTerrain = screen.id === 'terrain';
    const isResult = !isOcean && !isTerrain;
    const isRoute = [
      'drift-set',
      'drift-play',
      'drift-style',
      'drift-camera',
      'drift-camera-target',
    ].includes(screen.id);
    const expanded = isRoute || screen.id === 'drift-date';
    const style = driftTypes.find((item) => `style-${item.id}` === screen.id) ?? driftTypes[0];
    const rows = driftTypes
      .slice(0, 3)
      .map((type) => ({ ...type, label: type.short, detail: '26-07-11 08:00 ~ 18:30' }));
    const predicted = [1, 2].map((n) => ({
      ...driftTypes[3],
      label: '예측 1 (MOHID 모델)',
      detail: '해수유동 예측 결과',
      agency: true,
      rowId: `prediction-${n}`,
    }));
    predicted.push({ ...driftTypes[4], label: 'AI 분석 결과' });
    return [
      screen.href,
      {
        title: `${screen.title} | 속초시 해양서비스`,
        description: screen.description,
        ...screen,
        standalone,
        isOcean,
        isTerrain,
        isResult,
        isRoute,
        expanded,
        initialModal: standalone || screen.id === 'drift-style',
        clusterOpen: screen.id === 'drift-cluster',
        cameraOpen: screen.id.startsWith('drift-camera'),
        targetOpen: screen.id === 'drift-camera-target',
        isPlaying: screen.id === 'drift-play',
        map: isOcean
          ? images.oceanMap
          : isTerrain
            ? images.terrainMap
            : isRoute
              ? images.routeMap
              : images.clusterMap,
        style,
        days: days.map((label, index) => ({
          label,
          month: parseInt(label, 10),
          index,
          first: index === 0,
          open: expanded && index === 0,
        })),
        sets: [1, 2].map((number) => ({ number, checked: isRoute, rows, predicted })),
        clusters: clusterData.map(([x, y, count, date], index) => ({
          index,
          left: (x / 1920) * 100,
          top: (y / 1080) * 100,
          count,
          date,
        })),
      },
    ];
  }),
);

Object.assign(marinePages, supportPages);
screenList.push(...supportScreens);

export const marineContext = {
  ...supportContext,
  images,
  screenList,
  driftTypes,
  months: Array.from({ length: 12 }, (_, i) => i + 1),
  palette: [
    '#299d78',
    '#3c89d8',
    '#7f77d8',
    '#659935',
    '#eda03f',
    '#de284a',
    '#2863e4',
    '#1e9388',
    '#d77927',
    '#9135e3',
    '#1b90af',
    '#475568',
  ].map((color, index) => ({ color, first: index === 0 })),
  speeds: [1, 2, 4, 8, 16].map((speed) => ({ speed, active: speed === 1 })),
  depthLayers: [0, 10, 20, 40, 60, 80, 100].map((depth) => ({ depth, checked: depth < 20 })),
  tools: ['거리', '면적', '수심', '방위', '전체지도', '초기화'].map((label, index) => ({
    label,
    id: ['distance', 'area', 'depth', 'bearing', 'overview', 'reset'][index],
    selectable: index < 5,
    icon: [
      images.measureDistance,
      images.measureArea,
      images.measureDepth,
      images.compass,
      images.fullMap,
      images.resetMap,
    ][index],
    iconOn: [
      images.measureDistanceOn,
      images.measureAreaOn,
      images.measureDepthOn,
      images.compassOn,
      images.fullMapOn,
    ][index],
    index,
  })),
};
