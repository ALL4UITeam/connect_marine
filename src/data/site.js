import { marinePages } from './marine.js';
export const site = {
  name: 'CONNECT MARINE',
  description: '속초DT - 해양정보 해양서비스 UI',
  navigation: [
    { label: '홈', path: '/index.html' },
    { label: '퍼블리싱 가이드', path: '/pages/guide.html' },
  ],
};

export const pages = {
  ...marinePages,
  '/list.html': {
    title: '퍼블리싱 목록 | 속초DT 해양서비스',
    description: '표류정보 화면별 퍼블리싱 목록',
  },
  '/index.html': {
    title: '퍼블리싱 목록 | 해양서비스',
    description: '속초DT - 해양정보 해양서비스 UI',
  },
  '/pages/guide.html': {
    title: '퍼블리싱 가이드 | CONNECT MARINE',
    description: '공통 컴포넌트와 페이지 작성 규칙을 확인하세요.',
  },
};
