import { marinePages } from './marine.js';
export const site = {
  name: 'CONNECT MARINE',
  description: '속초DT - 해양정보 해양서비스 UI',
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
};
