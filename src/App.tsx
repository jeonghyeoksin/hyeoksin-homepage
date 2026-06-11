/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, CheckCircle, AlertCircle, Sparkles, Copy, ArrowRight, Code, Layout, Palette, Users, FileText, Settings, X, PlusCircle, Database, Package, Zap, Languages, ExternalLink, Eye, EyeOff, Loader2, Building, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const PRESET_EXAMPLES = [
  {
    id: 1,
    title: '메종 드 카카오 ☕',
    description: '프렌치 프리미엄 베이커리 카페 다중 페이지',
    projectName: '메종 드 카카오',
    websiteType: '기업 및 서비스 다중 페이지',
    requiresAuth: 'X',
    designLanguage: '한국어',
    purpose: '프리미엄 프랑스식 베이커리 카페의 오프라인 매장 및 시그니처 빵/디저트 라인업 홍보',
    coreValue: '천연 발효종을 사용한 48시간 저온숙성 전통 바게트와 정통 크루아상의 깊은 풍미',
    businessModel: '매장 정보 제공 및 단체 주문 예약 문의를 접수하는 인바운드 마케팅',
    targetAudience: '2030 여성 및 감성 카페와 맛있는 디저트를 즐겨 찾는 트렌디한 식음료 관심층',
    brandVoice: '프렌치 시크, 고풍스럽고 우아하며 따뜻함이 묻어나는 프리미엄 톤앤매너',
    features: '시그니처 디저트 라이브 갤러리, 단체 예약 연동 문의 폼, 매장 위치 상세 지도 안내 및 교통정보',
    cta: '대표 메뉴 확인하기, 단체 주문 상담 신청',
    style: '고풍스러운 다크 브라운, 크림 아이보리, 골드 포인트 컬러를 활용한 감성 레이아웃',
    pages: '홈(Home), 브랜드 소개(About), 대표 메뉴(Menu), 매장 안내 & 예약(Location & Booking)',
    colors: '크림 아이보리, 토스트 베이지, 다크 카카오 브라운, 골드 포인트',
    keyAssets: '고해상도 바게트 크루아상 조리 일러스트, 프랑스식 인테리어 무드 배경 사진',
    animations: '메뉴 이미지 마우스 호버 시 부드러운 스케일 업 및 리스트 스태거 순차 노출 효과',
    dataPersistence: '예약 문의 접수 데이터를 로컬 메모리 및 가상 접수 확인 보드에 연동',
    libraries: 'Tailwind CSS, motion (애니메이션), lucide-react (아이콘)',
    additional: '오프라인 카페의 따뜻함이 웹에서도 느껴지도록 은은하며 감미로운 배경 색감 적용 필요'
  },
  {
    id: 2,
    title: '아트 시그니처 🎨',
    description: 'UX/UI 디자인 개인 포트폴리오 사이트',
    projectName: '아트 시그니처',
    websiteType: '포트폴리오 사이트',
    requiresAuth: 'X',
    designLanguage: '한국어',
    purpose: 'UX/UI 디자이너로서의 상세 커리어 이력, 프로젝트 프로젝트 성과 전시 및 협업 문의 접수',
    coreValue: '사용자 관점의 유용성과 시각적 탁월함을 결합하여 비즈니스 가치를 극대화하는 UI/UX 디자인',
    businessModel: '채용 담당자 제안 수신 및 외주 개발 디자인 외주 문의 확보',
    targetAudience: '새로운 모바일 앱/웹 서비스를 기획 중인 스타트업 대표 및 IT 플랫폼 회사 채용 담당 리더',
    brandVoice: '전문성, 혁신적이며 가벼운 군더더기가 없고 신뢰할 수 있는 테크니컬 크리에이터 톤앤매너',
    features: '프로젝트 카드 그리드뷰(클릭 시 상세 모달 오픈), 실시간 경력 연대표 타임라인, 간편 이메일 연동 문의 폼',
    cta: '포트폴리오 다운로드, 디자인 의뢰하기',
    style: '여유 있는 그리드 여백, 다크 모드 베이스의 미니멀 세련된 무드 레이아웃',
    pages: '메인 포트폴리오 홈(Portfolio Home), 상세 경력 이력(About), 디자인 의뢰 & 연락처(Contact)',
    colors: '딥 블랙, 오프화이트, 하이라이트 일렉트릭 블루',
    keyAssets: '목업 그래픽 이미지, 전문 작가 느낌의 프로필 인물 사진',
    animations: '스크롤 시 상단 헤더 블러 글래스모피즘 트랜지션, 포트폴리오 호버 확대 효과',
    dataPersistence: '문의 접수 시 브라우저 내 확인 얼럿 알림',
    libraries: 'Tailwind CSS, motion (애니메이션), lucide-react (아이콘)',
    additional: '자기 주도적 이력서 다운로드 컴포넌트 탑재'
  },
  {
    id: 3,
    title: '태스크허브 ⚡',
    description: '스타트업 전용 협업 칸반보드 및 태스크 매니저 SaaS',
    projectName: '태스크허브',
    websiteType: 'B2B/B2C SaaS 플랫폼',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '프로젝트 기획부터 개발, 디자인 출시까지 부서 간 실시간 칸반 카드로 협업 효율화',
    coreValue: '학습 비용 제로! 가장 직관적으로 업무 카드를 드래그 앤 드롭하며 소통하는 린(Lean) 협업 툴',
    businessModel: '월 멤버십 형태의 사내 계정 연동 구독형 SaaS 모델 시뮬레이터',
    targetAudience: '속도감 있는 실시간 협업과 직관적인 업무 우선순위 시각화가 필요한 국내 소규모 스타트업 팀',
    brandVoice: '활력 넘치고 신속하며, 협업의 즐거움을 살리는 영하고 테크니컬한 톤',
    features: '드래그 앤 드롭 지원 칸반보드(To-do, In-Progress, Done), 마감일 캘린더 전용 뷰, 실시간 팀 멤버 참여 상태칩',
    cta: '무료로 시작하기, 프리미엄 요금제 혜택',
    style: '메디컬 클린 화이트 배경 위에 선명한 선과 그림자로 영역을 직관적으로 보여주는 노션풍 레이아웃',
    pages: '소개 랜딩페이지, 나의 가상 태스크 대시보드 및 실시간 협업 카드 대형 보드',
    colors: '퓨어 슬레이트, 세련된 아쿠아 블루, 에메랄드 그린',
    keyAssets: '협업 워크스페이스 가상 일러스트 디자인, 깔끔한 사스 서비스 모형 비주얼',
    animations: '카드를 드롭하여 리스트 이동 시 적용되는 통통 튀는 바운스 모션 효과',
    dataPersistence: '로컬스토리지 연동을 통한 브라우저 종료 후에도 작성 카드 그대로 반영',
    libraries: 'Tailwind CSS, motion, lucide-react, HTML5 Drag API',
    additional: '테스크 카드에 우선순위 라벨(High, Medium, Low) 지정 기능 명시'
  },
  {
    id: 4,
    title: '세일즈메이트 📈',
    description: '소상공인용 고객 데이터 CRM 대시보드',
    projectName: '세일즈메이트',
    websiteType: 'CRM(고객 관계 관리)',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '고객 정보 등록, 결제 이력, 최근 상담 내역 메모 및 미팅 스케줄 일정을 한눈에 모니터링',
    coreValue: '어려운 CRM 솔루션 대신, 복잡도를 줄여 필요한 고객 정보만 신속히 검색하고 조회 가능',
    businessModel: '고객 데이터 100건 무료 등록 후 무제한 추가 사용 라이선스 결제 모델',
    targetAudience: '액셀 시트나 수기 장부로 고객 관리를 해와 누락 및 누수가 자주 많던 자영업자 및 영업 어드바이저',
    brandVoice: '체계적이고 견고함, 데이터가 잘 보이며 안심하고 사용할 수 있는 금융 관리 애플리케이션 느낌',
    features: '성명/연락처 등록 데이터 인물 리스트, 실시간 고객 상세 상담 이력 로그, 매출 통계 차트 그래픽 컴포넌트',
    cta: '신규 고객 등록, 고객 데이터 통계 분석',
    style: '밀도 높은 정보 위젯 배치, 고대비 테이블, 깔끔한 통계 그래픽의 정보 중심 디자인',
    pages: 'CRM 대시보드 홈, 실시간 고객 관계 장부, 결제 데이터 내역',
    colors: '스포트 에메랄드 그린, 딥 플래티넘, 화이트',
    keyAssets: '대시보드 통계 카드 아이콘, 깔끔한 그리드 차트 형상',
    animations: '메뉴 전환 시 페이지가 스으윽 슬라이드되며 로드되는 오프셋 애니메이션',
    dataPersistence: 'localStorage를 활용한 세일즈 데이터 영구 저장 엔진',
    libraries: 'Tailwind CSS, motion, lucide-react, recharts (통계 차트 시각화)',
    additional: '테이블 행 클릭 시 해당 고객 카드가 우측 미니 패널에 뜨는 실용 구조 명시'
  },
  {
    id: 5,
    title: '책방구석 📚',
    description: '온오프라인 독서 모임 및 북클럽 커뮤니티',
    projectName: '책방구석',
    websiteType: '소셜 플랫폼 / 커뮤니티',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '책 매니아들이 한 달에 한 번 함께 읽을 파트너를 지정하고 토론, 독후감 에세이를 보드에 투고',
    coreValue: '자유롭고 심도가 깊은 질문을 서로 던지며, 글쓰기를 통해 나의 일상 습관을 돌아보는 공간',
    businessModel: '매주 주말 오프라인 독서 모임 공간 대여 및 도서 특별 패키지 배송 구독 티켓 판매',
    targetAudience: '독서 편식에서 벗어나 철학, 경제학, 에세이 등 다양한 사람들의 가치관을 공유하고 싶은 이들',
    brandVoice: '따뜻한 인센스 향이 나는 듯한 차분하고 감수성 어린 우드 북앤 가드닝 아늑한 스타일',
    features: '이달의 도서 투표 피드, 실시간 도서별 한줄 평 투고 보드, 북클럽 참여 예약 캘린더 컴포넌트',
    cta: '이달의 클럽 참여하기, 독서 솔직 고백 투고',
    style: '톤다운된 마일드 샌드 베이지, 포근한 카키 올리브 그린을 활용한 정적이며 세련된 슬로우 매거진 뷰',
    pages: '책방구석 소개 홈, 활발한 모임 게시판, 책장 보관소',
    colors: '올리브 딥그린, 매트 샌드 베이지, 다크 테라코타',
    keyAssets: '감성적인 라인 일러스트 위주의 책 삽화 이미지',
    animations: '책을 책장에 넣는 듯한 부드러운 스태거링 스무스 드롭 다운 트랜지션',
    dataPersistence: '독후감 작성 및 투표 데이터를 가상 로컬 스토리지에 캐싱 유지',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '책 추천 시 별점 조절 레이팅 바 포함'
  },
  {
    id: 6,
    title: '싱크업 빌리지 🏢',
    description: '중소기업 전자결재 및 공지 인트라넷 그룹웨어',
    projectName: '싱크업 빌리지',
    websiteType: '사내 인트라넷 / 그룹웨어',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '사내 공지사 전파, 주간 부서 일정 공유 및 복잡한 결재 업무를 대폭 통합하는 사내 허브 사이트',
    coreValue: '번거로운 휴가 신청서, 품의 지출 보고를 원클릭 전자서명 및 버튼 한 번으로 결재 기안 승인',
    businessModel: '사내 전용 단독 호스팅 솔루션 및 서버 인프라 유지보수 서비스',
    targetAudience: '종이 결제판 대신 투명하고 합리적으로 업무 프로세스를 연계하고자 하는 중소/스타트업 임직원',
    brandVoice: '공명정대하며 간결하고, 정돈되어 가독성이 매우 뛰어난 비즈니스 포털',
    features: '전자결재 상신 양식 선택(품의서/휴가신청서) 및 실시간 승인 단계 타임라인, 주간 공유 스케줄 캘린더',
    cta: '새 결재 문서 기안하기, 전체 부서 조직원 확인',
    style: '화이트와 슬레이트 그레이 기반의 깔끔한 그리드 보드 구조, 시각적 중요도 위주의 타이포그래피',
    pages: '게시판 홈, 전자결재함, 사내 조직도 주간 일정표',
    colors: '스페이스 네이비, 쿨 그레이, 세련된 하이테크 화이트',
    keyAssets: '결재 스탬프 아이콘, 부서 업무 매뉴얼 가이드 다운로드 링크',
    animations: '결재안 올릴 시 축하 체크 모션과 함께 완료 리스트 슬라이드 피드백',
    dataPersistence: '로컬 저장을 연동한 가상 결재 수신함 실시간 리프레시 반영',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '사원 상세 프로필 연락처 빠른 검색 카드 구현'
  },
  {
    id: 7,
    title: '바디튠 PT 매치 🏋️',
    description: '퍼스널 트레이너 실시간 매칭 및 예약 캘린더 플랫폼',
    projectName: '바디튠',
    websiteType: '예약 및 매칭 플랫폼',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '강사진 프로필, 이전 수강생들의 리얼 후기, 빈 수업 시간대 조회를 통하여 원클릭 PT 매칭 연계',
    coreValue: '헬스장 카운터에 매번 문의 전화를 할 필요 없이 원할 때 바로 자유롭게 세션 클래스 예약 신청',
    businessModel: '선불 티켓 결제 시 강사와 수수료를 쉐어링하는 간편 예약 커머셜 플랫폼',
    targetAudience: '필라테스, 홈트, 크로스핏 등 자신과 케미가 맞는 검증된 트레이너를 직접 선별하려는 헬스 챌린저',
    brandVoice: '파워풀하며 동기부여가 크게 되는, 다이내믹하면서도 정교한 스포트 테크 톤앤매너',
    features: '검증된 트레이너 카드 검색 및 평점 필터링, 실시간 수업 일자 시간대 선택 그리드, 전후 비교 갤러리 슬라이더',
    cta: '나만의 트레이너 매치받기, 주간 세션 일정 예약',
    style: '블랙 오닉스 배경 위에 에너지 넘치는 강렬한 오렌지/옐로우 포인트를 준 하이 콘트라스트 스타일',
    pages: '메인 매칭 홈(Match Home), 상세 트레이너 리스트, 나의 예약 타임테이블',
    colors: '에너제릭 네온 오렌지, 리얼 카본 블랙, 슬레이트',
    keyAssets: '트래이어 운동 프로필 고화질 스틸 컷, 근육 매핑 전문 가이드라인 컴포넌트',
    animations: '예약 일시 선택 시 일렉트릭 웨이브 리플 파동 터치 피드백 모션',
    dataPersistence: 'PT 예약 완료된 데이터를 로컬 스토리지 누적 카운트에 반영',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '트레이너 프로필 클릭 시 상세 소셜 미디어 배지 아이콘 노출 지시'
  },
  {
    id: 8,
    title: '코드마스터 스쿨 💻',
    description: '실용 동영상 코딩 스마트 교육 LMS 플랫폼',
    projectName: '코드마스터',
    websiteType: 'LMS (학습 관리 시스템)',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '강좌 로드맵 제공, 코너별 진척도를 즉각 확인하고 비디오 재생, 질문하기를 통해 학습 격차 해소',
    coreValue: '눈으로만 보는 인강을 넘어, 학습 현황 진도바를 통해 나의 완강 성취를 끝까지 완주 유도',
    businessModel: '강좌당 평생 소장 라이프타임 패스 판매 또는 매주 업데이트되는 연도별 프리패스 멤버십',
    targetAudience: '코딩 학습을 독학으로 시작했으나 도중에 자주 잦게 주저앉던 코린이 직장인 및 취준생들',
    brandVoice: '사이버틱하며 호기심을 유발하는 코딩 테크 클래스 무드, 개발 영감이 솟구치는 톤앤매너',
    features: '진도율 마커 및 코스 시퀀스 리스트, 질문 답변(Q&A) 실시간 피드 투고, 완수 시 획득 기프트 배지 가상 팝업',
    cta: '강좌 무료 맛보기, 나만의 커리큘럼 추천 시작',
    style: '인텔리제이/VS Code 테마가 연상되는 테크니컬하고 눈이 편안한 인디고 퍼플 딥컬러 스킨',
    pages: '강좌 커스텀 홈, 상세 학습 공간(LMS), 강사 피드백 및 나의 리포트',
    colors: '일렉트릭 바이올렛, 딥 인디고 블루, 민트 코드',
    keyAssets: '개발자 장비 목업 일러스트, 강좌 코스 썸네일 목업 이미지',
    animations: '과목 코스를 완강 체크할 때 꽃가루 파티클(Confetti)이 샤르르 퍼지는 모션',
    dataPersistence: '로컬 스토리지를 이용해 강의 진행도 실시간 저장 및 원클릭 복원',
    libraries: 'Tailwind CSS, motion, lucide-react, canvas-confetti (가상)',
    additional: '코드 작성용 다크 테마 에디터 와이어프레임 박스 UI 장착'
  },
  {
    id: 9,
    title: '홈 파인더 전월세 분석 🏠',
    description: '실거래 빅데이터 기반 주택 매물 찾기 및 시세 대시보드',
    projectName: '홈 파인더',
    websiteType: '부동산 / 프롭테크 플랫폼',
    requiresAuth: 'X',
    designLanguage: '한국어',
    purpose: '특정 역세권 주거 매물 리스트업 제공 및 시세 거래 변동액을 그래프를 통해 투명하게 직관적 표시',
    coreValue: '허위 매물에 피곤하지 않도록 직접 필터를 이용해 실거래가 전월세 시세 변동을 d3기반 정밀 예측',
    businessModel: '공인중개사 프리미엄 노출 광고 료 및 상세 세무/금융 대출 계산기 맞춤 수수료',
    targetAudience: '내 집 마련 및 첫 이사를 앞두고 실질 거래 단가를 면밀하게 비교하여 이득을 챙기려는 똑똑한 스마트 정보족',
    brandVoice: '신뢰의 최고봉인 일렉트릭 블루 색상을 기조로 정직하고 투명하면서 수치를 시각화하는 객관적 톤',
    features: '금액 범위를 정하는 인터랙티브 필터 및 슬라이더 디렉터리, 가구원수별 추천, 부동산 실거래 히스토리 변동 그래프',
    cta: '추천 매물 상담 신청, 내 맞춤 시세 분석기 돌리기',
    style: '대비 높고 넓은 뷰포트 영역 사용, 스포트 맵 레이아웃(가상)과 리스트 스플릿이 통합된 부동산 허브 디자인',
    pages: '시세 검색 렌딩홈, 매물 탐색 리포팅, 상세 분석 차트',
    colors: '로열 블루 Blue, 오프 화이트 Platinum, 애쉬 그레이',
    keyAssets: '아파트 단지 비주얼 그래픽 렌더링, 깔끔한 건물 아이콘 세트',
    animations: '필터 슬라이더 조절 시 리스트 카드가 실시간으로 페이드인 아웃되며 교체되는 인터랙션',
    dataPersistence: '관심 매물 하트 찜(Like) 버튼 누를 시 세션 장바구니에 완벽 유지',
    libraries: 'Tailwind CSS, motion, lucide-react, recharts (시세 변동 차트 시각화)',
    additional: '원클릭 담보대출 한도조회(가상) 계산기 세션 장착 지시'
  },
  {
    id: 10,
    title: '룸 인 로브 감성 커머스 🛏️',
    description: '감성 핸드메이드 라이빙 편집숍 및 쇼핑몰',
    projectName: '룸 인 로브',
    websiteType: '쇼핑몰 / 이커머스',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '차분하고 안락한 나만의 내추럴 홈 인테리어를 위한 프리미엄 리빙 제품 컬렉션 및 즉시 주문 결제 접수',
    coreValue: '대량 생산 속 일회성 공산품 대신, 장인의 정성스러운 손길로 빚어낸 따뜻한 슬로우 감성 리빙 제안',
    businessModel: '매주 독점 리미티드 수량 디자이너 콜라보 수공예품 선착순 판매 커머스',
    targetAudience: '집이라는 지친 물리적 공간을 마인드풀니스 치유 공간으로 포근하게 브랜딩하고 싶어하는 직장인 및 신혼부부',
    brandVoice: '은은한 새벽녘 숲속 안개가 떠오르는 마일드 내추럴 샌드 시크, 따뜻함, 감성 잡지 레이아웃',
    features: '세련된 감성 상품 컬렉션 정렬 그리드뷰, 실시간 장바구니 수량 관리, 원클릭 무통장입금 연동 주문 가상 모의 테스트',
    cta: '스페셜 웰컴 쿠폰 받기, 이달의 컬렉션 즉시 구매',
    style: '테크니컬 디자인을 완전히 배제하고 따사로운 샌드스톤 카멜, 테라코타 오렌지 등 온기가 넘쳐나는 따스한 슬로우 숍 매거진',
    pages: '커머스 매거진 빌리지, 상품 카탈로그, 장바구니 결제 시뮬레이션',
    colors: '샌드 카멜 Camel, 테라코타 오렌지 Terracotta, 어스 네이처',
    keyAssets: '자연 채광 속 도자기 식기 썸네일, 감성 리조트 내부 패브릭 사진',
    animations: '장바구니 이동 버튼 누르거나 찜 누를 때 아이콘이 상체 바운싱 팝업 반응 효과',
    dataPersistence: '장바구니에 담아둔 품목 및 개수 로컬 영구저장 완벽 캐싱',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '리액트 컨텍스트 기반 임시 카운트 연동'
  },
  {
    id: 11,
    title: '해빗 빌더 플래너 📅',
    description: '일일 습관 형성 및 스트릭 카운터 플래너',
    projectName: '해빗 빌더',
    websiteType: '생산성 앱 / 툴',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '매일 반복되는 일상 습관(운동, 코딩 공부, 독서 등)을 기록하고, 캘린더 스트릭으로 지속성을 관리',
    coreValue: '시야각이 넓은 그리드 디자인을 통해 스스로의 도전을 가시적으로 확인하고 성취감 극대화',
    businessModel: '가상 멤버십 등급 기능 및 주간 성과 요약 보고서 이메일 발행 기능 데모',
    targetAudience: '새해 목표나 건강하고 생산적인 라이프스타일을 지속가능하게 추구하려는 자기개발 학습자',
    brandVoice: '긍정적이며 성실하고, 성장을 적극 응원하는 경쾌하면서 힘찬 스포츠 스포티브 세련미',
    features: '실시간 오늘의 해빗 카테고리 체크, 달성률 도넛차트, 월간 스트릭 캘린더, 성장에 따른 경험치(XP) 바',
    cta: '오늘의 습관 등록하기, 월간 성적표 인쇄하기',
    style: '은은한 연회색 배경, 심플하고 얇은 보더 라인, 에너제릭한 오렌지와 그린 하이라이트로 구성된 생산성 특화 대형 보드',
    pages: '대시보드 메인, 습관 라이브러리 목록, 나의 업적 및 통계 분석',
    colors: '퓨어 화이트, 엑티브 민트 그린, 선명한 오렌지, 딥 슬레이트',
    keyAssets: '목표 달성을 형상화하는 수려한 격자 픽셀 그래픽 세트',
    animations: '체크박스 클릭 완료 처리 시 초록색 불빛이 은은하게 퍼지며 피로가 풀리는 글로우 트랜지션 효과',
    dataPersistence: 'localStorage 연동으로 접속 상태 및 데일리 스트릭 횟수 정보 완벽 캐싱 유지',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '체크 취소 시에도 안전하게 이전 데이터가 복원되도록 설계'
  },
  {
    id: 12,
    title: '핏파트너 스마트 홈트 🏃',
    description: '초보자용 체계적인 운동 예약 및 전문 루틴 비디오 스트리밍',
    projectName: '핏파트너',
    websiteType: '강의 플랫폼',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '집에서 편안하게 최고의 개인 트레이닝(PT) 및 필라테스 강의 고해상도 영상을 보며 일정을 트래킹',
    coreValue: '일반 인강과 달리 타임라인별 주요 주의 동작(자세 팁)을 실시간 위젯으로 쉽게 확인',
    businessModel: '베이직 프리패스 요금 및 특정 스타 트레이너 1:1 맞춤 피드백 패키지 티켓 시뮬레이션',
    targetAudience: '헬스장에 갈 시간적 여유가 없거나 프라이빗하게 홈트 전문 루틴을 정교하게 다지려는 홈 트레이너',
    brandVoice: '활기차고 힙하며 스포티한 네온 그린 컬러 매치로 언제나 기분 전환이 되는 역동적 톤',
    features: '선택 부위별(상체/하체/유산소) 강좌 목록, 현재 재생 동영상 타임박스, 트레이너 실시간 질문 코너',
    cta: '무료 맛보기 세션 재생, VIP 멤버십 플랜 탐색',
    style: '고기능성 피트니스 브랜드 웹처럼 세련되고 고대비 테마의 인터랙티브 플레이어 위주 화면 배치',
    pages: '클래스 홈, 수강 중인 강좌 재생 룸, 마이 워크아웃 성과 피드',
    colors: '딥 메탈 블랙, 하이라이트 일렉트릭 라임 네온, 화이트',
    keyAssets: '운동 자세 가이드 벡터 로고, 깔끔한 스태츠 카드 아이콘',
    animations: '재생 버튼 클릭 시 미끄러지듯 스무스하게 커지는 플레이어 전체 스크린 모션',
    dataPersistence: 'localStorage를 활용한 영상 일자별 진도 체크율 데이터 영구 보관',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '비디오 플레이 스탑 제어 상태 칩 연동 명시'
  },
  {
    id: 13,
    title: '공간의 가치 🏢',
    description: '소호 사무실, 파티룸, 연습실 통합 예약 및 정보 제공 플랫폼',
    projectName: '공간의 가치',
    websiteType: '예약 및 매칭 플랫폼',
    requiresAuth: 'X',
    designLanguage: '한국어',
    purpose: '회의실, 파티룸, 댄스/음악 연습실 등 원하는 역세권의 대관 장소를 쉽고 편리하게 실시간 예약',
    coreValue: '위치, 시간당 단가, 이용 정원 및 필수 부대시설(와이파이, 빔프로젝터 등)을 완벽 매칭 검증',
    businessModel: '공간 호스트 등록 및 예약 완료당 파격적인 가상 수수료 할인 우대 예약 결제 모델',
    targetAudience: '회의 공간이 필요한 비즈니스 미팅 주최자, 촬영 스튜디오를 찾는 크리에이터, 파티를 계획하는 소모임 그룹',
    brandVoice: '세련되고 감각적이며 정돈된 느낌의 모던 아키텍처 인테리어 무드 톤앤매너',
    features: '조건별(인원, 가격대) 공간 고속 필터링 카드뷰, 상세 날짜-시간대 조율 및 가상 캘린더 오더, 실거래 영수증 시뮬레이터',
    cta: '지금 할인된 공간 찾기, 신규 공간 등록 문의',
    style: '깔끔한 무채색 그리드와 미니멀한 모던 폰트, 여유로운 마진의 스튜디오형 고급스러운 인테리어 슬라이더',
    pages: '대관 플레이스 홈, 매장별 상세 디테일 뷰(위치 및 정원), 나의 가상 예약 목록',
    colors: '쿨 플래티넘 화이트, 딥 애쉬 그레이, 에메랄드 퍼플 포인트',
    keyAssets: '고해상도 실내 공간 그래픽, 감각적인 공간 도면 일러스트',
    animations: '시간대 버튼 토글 시 통통 튀며 선택 상태로 활성화되는 바운싱 체크 모션',
    dataPersistence: '예약 내역 리스트 데이터를 브라우저 내에 누적시켜 원클릭 확인 가능',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '예약 일시 선택 시 실시간 자동 요금 계산 시스템 지침 추가'
  },
  {
    id: 14,
    title: '인사이트 데크 📰',
    description: '마이크로 테크 및 비즈니스 트렌드 전문 뉴스레터 미디어',
    projectName: '인사이트 데크',
    websiteType: '블로그 / 컨텐츠 미디어',
    requiresAuth: 'X',
    designLanguage: '한국어',
    purpose: '글로벌 테크 기업 및 비하인드 비즈니스 트렌드 요약 리포트를 간편 매거진 피드 형태로 무한 열람',
    coreValue: '하루 5분! 직근 커리어 성장에 필요한 대기업 협업 노하우와 주간 신기술 뉴스를 완벽 핵심 요약 제공',
    businessModel: '유료 스페셜 아티클 정기 구독 및 유료 광고 스폰서십 프로모션 모듈',
    targetAudience: '매일 넘치는 인터넷 뉴스 홍수 속에서 고품질 커리어 지식을 핵심만 빠르게 편식 소화하고픈 비즈니스맨',
    brandVoice: '인쇄 아날로그 뉴스 신문 같은 느낌을 지니면서도 모던하고 지적인 뉴욕 에디토리얼 톤',
    features: '인기 테그 검색 및 아티클 필터, 이메일 주소 한 줄 간편 구독 신청 폼, 읽은 시간 표시 바 지시기',
    cta: '매일 아침 인사이트 받아보기, 무료 요약본 읽기',
    style: '세리프 폰트 디스플레이와 깔끔하게 대비되는 모노 무채색 스킨, 모던한 라인 장식이 일품인 매거진형 지면식 레이아웃',
    pages: '인사이트 매거진 홈, 아티클 본문 리딩 페이지(구조화 텍스트), 이달의 발행 아카이브 피드',
    colors: '소프트 아이보리 가벼운 베이지, 깊고 푸른 네이비 슬레이트, 리얼 다크 차콜',
    keyAssets: '만년필 서명 그래픽, 신문 지면 스타일 테크 썸네일 아트웍',
    animations: '스크롤 상단에 현재 글 읽기 진행도를 알려주는 가로 진행바(Progress Line) 부드러운 트랙 모션',
    dataPersistence: '북마크 저장 및 이메일 구독 내역을 로컬 캐시에 즉각 유지',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '원활한 가독성을 위한 최적의 행간과 서체 명세 지시'
  },
  {
    id: 15,
    title: '어반 가든 IoT 🌿',
    description: '반려식물 집사를 위한 실시간 홈 IoT 상태 대시보드',
    projectName: '어반 가든',
    websiteType: '대시보드 / 어드민 페이지',
    requiresAuth: 'X',
    designLanguage: '한국어',
    purpose: '가상 IoT 센서(토양 수분, 온도, 일조량) 정보를 실시간 가독성 높게 모니터링하고 식물 주기 관리 연동',
    coreValue: '내 소중한 반려식물이 갈증을 느끼거나 빛이 필요할 때 직관적인 수치와 이모지로 물주기 경고 제공',
    businessModel: '가정용 지능형 자동 물뿌리개 가상 하드웨어 연동 시뮬레이터 라이선스',
    targetAudience: '바쁜 도심 일상 속 매번 물 주기 타이밍을 놓쳐 식물을 아쉽게 시들게 한 초보 어반 식물 집사들',
    brandVoice: '네이처 그린과 올리브, 싱그럽고 친근하면서도 기술적으로 잘 정돈된 리빙 테크 무드',
    features: '화분별 실시간 수분 온도 도넛 그래프 차트 위젯, 수동 원격 물주기 가상 가동 토글 버튼, 식물 성장 일지 카드보드',
    cta: '내 반려화분 등록하기, 원격 스마트 가동 체험',
    style: '눈이 부시지 않은 네이처 올리브 그린 계열의 부드럽고 가독성 극대화된 웰컴 대시보드 카드 레이아웃',
    pages: '텃밭 원격 대시보드 메인, 나의 정원 반려식물 도감, 관리 일지 히스토리',
    colors: '보태니컬 그린, 부드러운 올리브 베이지, 퓨어 소프트 허브 민트, 라벤더 오프블루',
    keyAssets: '몬스테라, 유칼립투스 라인 드로잉, 물방울 모션 아이콘',
    animations: '물주기 버튼을 누르면 화분 카드의 수분 수치 비주얼 그래프가 쑥 상승하며 물결 일렁이는 웨이브 인터랙션',
    dataPersistence: '수정된 식물 상태값 및 최근 급수 시간 데이터를 localStorage에 연속 저장 연계',
    libraries: 'Tailwind CSS, motion, lucide-react, recharts (실시간 환경수치 차트)',
    additional: '식물의 기분 상태를 감지하는 임시 로직 가이드 동봉'
  },
  {
    id: 16,
    title: '플레이스 매치 ⚽',
    description: '동호인용 동네 풋살 및 체육 장소 매칭 예약 시스템',
    projectName: '플레이스 매치',
    websiteType: '예약 및 매칭 플랫폼',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '개인 및 팀 연동 경기 일정을 조회하고, 함께 대결할 동네 축구/풋살/테니스 상대편을 클릭 매칭',
    coreValue: '인원 부족으로 폐강되던 소모임 매치를 방지하고, 실력 및 매너 수준 등급제를 통해 최상의 동네 체육 매칭 성사',
    businessModel: '경기 구장 대관 패키지 예약 및 게스트 모집 참가비 통합 간편 가상 정산 시뮬레이터',
    targetAudience: '매번 인원이 부족해 경기를 포기하거나 대관에 지친 동네 활력 스포츠 러버 및 조기동호회 장',
    brandVoice: '액티브하며 역동적이고, 팀 플레이의 연대감을 강조하는 강렬하고 신선한 스포츠 매칭 톤',
    features: '금일 긴급 모집 경기 리스트 피드, 전용 매칭 신청 모달 폼, 실시간 유저 매너지수 체크 바 컴포넌트',
    cta: '게스트 참여 매치 신청, 우리 팀 구장 오픈하기',
    style: '스타디움 구장의 생동감이 전해지는 다크 아웃라인 그리드, 에너제릭 스포티브 옐로우를 버무린 시그널 매치 스타일',
    pages: '매칭 피드 찾기 홈, 부서/경기별 상세 구장 목록, 소셜 랭킹 매너보드',
    colors: '피치 블랙, 경기장 잔디 딥그린, 하이라이트 일렉트릭 네온 옐로우',
    keyAssets: '축구장/체육관 벡터 도해, 트로피 및 매치 볼 심볼 이미지',
    animations: '매치 참가 클릭 즉시 매칭 수락 완료가 되며 부드러운 수축-팽창 모션의 승인 알림 팝업',
    dataPersistence: '로컬 스토리지 연동을 통한 내 게스트 참가 대기 상태값 완벽한 로컬 저장 장착',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '종목별 필터(풋살, 신나는 농구, 활기찬 배드민턴) 멀티 조건 검색 명세 포함'
  },
  {
    id: 17,
    title: '이지 빌드 ERP 📊',
    description: '실시간 매출 및 거래처 통합 정산 관리 ERP 솔루션',
    projectName: '이지 빌드 ERP',
    websiteType: 'ERP (전사적 자원 관리)',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '복잡하고 비싼 대기업용 ERP 대신, 소형 소매상도 누구나 쉽고 가볍게 매입, 매출, 거래 대금 잔액을 자동 계산 기록',
    coreValue: '엑셀 복잡한 수식 없이도 거래 내역 한 줄 입력 시 금년 분기 통계 매출이 자동 그래픽 계산 표기',
    businessModel: '무료 데이터 등록 패키지 및 기업 보고서 PDF 변환 기능이 있는 평생 기한 한정 유료 라이선스',
    targetAudience: '거래처 영수증 누락으로 매크로 매입 증빙 처리에 애를 먹는 소형 도소매 사업자 및 외근직 가맹 사장님',
    brandVoice: '안전성 넘치고 전문적인 딥 블루 브랜딩으로, 거래 데이터의 한 치 오차 없음을 보장하는 테크니컬 금융 스킨',
    features: '실시간 입출금 명세 테이블, 분기 매출 추이 차트, 정산 예정 잔액 자동 집계 카드 3선, 신규 거래처 원클릭 스캔 등록',
    cta: '신규 거래 등록 개시, 분기 마감 리포트 출력',
    style: '수치가 한눈에 대조되는 백그라운드 그리드, 높은 채도 대비의 지표 라벨링으로 시인성을 극대화한 인터페이스',
    pages: 'ERP 실시간 모니터, 매입매출 전용 장부, 거래처 연락 및 연말 정산 아카이브',
    colors: '코퍼릿 딥 블루, 은은한 스틸 메탈릭, 토마토 레드 경고, 화이트',
    keyAssets: '회계 장부 전용 컴포넌트 목업, 영수증 바코드 디자인 아이콘',
    animations: '새 거래 항목 추가 완료 시 리스트 맨 위로 스쳐 내려오며 연한 파란색이 하이라이트되는 페이드 슬라이드 트랜지션',
    dataPersistence: 'localStorage 데이터 바인딩을 통해 일일 매출 정보의 연속적인 삭제/추가/수정 트래킹',
    libraries: 'Tailwind CSS, motion, lucide-react, recharts (입출금 그래프)',
    additional: '외화 환율 변동 칩 시뮬레이터 제공 규칙'
  },
  {
    id: 18,
    title: '스마트 핏츠 쇼룸 🛍️',
    description: '취향 기반 맞춤 패션 의류 정기 구독형 온라인 숍',
    projectName: '스마트 핏츠',
    websiteType: '쇼핑몰 / 이커머스',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '매월 나만의 정밀 체형 및 패션 키워드를 설정하면 추천 디자이너의 엄선된 의상이 특별 정기 배송되는 서비스',
    coreValue: '쇼핑하느라 시간 쓸 필요 없이 내 라이프스타일에 100% 매칭되는 고품격 캡슐 워드로브 의상 코디 전송 완료',
    businessModel: '매거진식 단품 즉시 구매 및 월정액 기반 자동 스타일 배송 베이직/프리미엄 요금제 플랜',
    targetAudience: '트렌디한 옷을 입고 싶으나 매번 트렌드 추적이나 옷 고르고 쇼핑몰 다니기가 너무나도 귀찮은 스마트 에디션 직장인',
    brandVoice: '세련된 프랑스 파리 부티크 잡지 레이아웃, 하이퍼 시티 하이엔드 럭셔리 감성의 미니멀 시크 톤앤매너',
    features: '간편 스타일 정밀 자가진단 퀴즈 컴포넌트, 3D 가상 의상 옷장 보관함(가상 갤러리), 이달의 코디 투표 카드 리스트',
    cta: '나만의 무료 스타일링 진단 1분 체크, 이달의 부티크 숍 보기',
    style: '넓은 텍스트 마진, 고화질 흑백/패션 룩북 기반의 정교한 카달로그 나열, 세련되고 차이 있는 미니멀 디자인',
    pages: '이달의 룩 매거진 메인, 가상 스타일 자가 진단 룸, 옷장 보관함 & 장바구니 리포팅',
    colors: '퓨어 크림 베이지, 다크 제트 블랙, 우아한 뮤티드 토프',
    keyAssets: '모델 자켓 및 패브릭 질감 고해상도 사진, 럭셔리 의장 실사 느낌 일러스트',
    animations: '체형 단계를 선택하며 넥스트 버튼 누를 때마다 슬라이드가 부드럽게 한 페이지씩 전방 회전하며 교체되는 플립 효과',
    dataPersistence: '체형 진단 결과 데이터 및 장바구니에 찜한 디자이너 코디 정보 로컬 보존 캐싱',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '체형 맞춤 수치를 미터법 인치법 등으로 실시간 변환하는 가상 칩 연동 명시'
  },
  {
    id: 19,
    title: '웰스 랩 조각 투자 📈',
    description: '분산형 부동산 & 미술품 소액 조각 투자 시뮬레이터',
    projectName: '웰스 랩',
    websiteType: '대시보드 / 어드민 페이지',
    requiresAuth: 'X',
    designLanguage: '한국어',
    purpose: '단돈 만 원으로 빌딩 지분 및 유명 미술품 지분을 쪼개서 분산 소유하고 배당 소이를 시뮬레이션 트래킹',
    coreValue: '고가 부동산 투자의 장벽을 없애고, 누구나 손짓 한 번으로 자산 배당 변동과 펀딩 진행도를 한눈에 실시간 체감',
    businessModel: '매달 조기 완판되는 특별 미술 자산 중개 및 가상 운용 연 수수료 수익 시뮬레이터',
    targetAudience: '예적금 이외에 인플레이션을 방어할 매력적인 조각 투자 및 자산 배분 테크에 목마른 스마트 소액 주주층',
    brandVoice: '신뢰성과 투명한 금융 보상을 대변하는 다크 에메랄드 컬러 베이스의 견고하고 스포티한 자산 대시보드',
    features: '진행 중인 이달의 크라우드 펀딩 진행 바, 모의 투자 수익률 d3 예측 계산 그래프, 자산 현황 소유 비율 파이차트 카드',
    cta: '만원으로 소액 투자 시작하기, 모의 계산기 돌리기',
    style: '수준 높은 금융 트레이딩 부스 느낌의 가독성 대시보드 구조, 소수점 단위와 배지 수치가 또렷하게 대조되는 디테일 뷰',
    pages: '조각 자산 공모 탐색, 실시간 자산 현황 판넬, 모의 복리 금융 계산기',
    colors: '피치 미드나잇 퍼플, 성공의 에메랄드 그린, 플래티넘 메탈, 오프블루',
    keyAssets: '골드 코인 및 랜드마크 고품질 일러스트, 펀딩 체결 완료 도장 아이콘',
    animations: '투자하기 버튼 클릭 시 소유 중인 배당 지분이 사르르 카운팅되며 숫자가 올라가는 롤링 카운터 텍스트 모션',
    dataPersistence: '내가 투자한 공모 매물 지분 내역 데이터를 localStorage에 누계 업데이트 및 리프레시 대응',
    libraries: 'Tailwind CSS, motion, lucide-react, recharts (지분 분배 및 수익 상승선 그래프)',
    additional: '가입 환영 가상 투자금 만 원 즉시 충전 프로세스 로직 전송 명시'
  },
  {
    id: 20,
    title: '커리어 부스터 캠퍼스 💡',
    description: '주니어 개발자/디자이너 실시간 이력서 리뷰 및 스터디 커뮤니티',
    projectName: '커리어 부스터',
    websiteType: '소셜 플랫폼 / 커뮤니티',
    requiresAuth: 'O',
    designLanguage: '한국어',
    purpose: '자신의 이력서 혹은 포트폴리오를 업로드하고 익명의 동종 취준생/현업 멘토에게 실무 피어 리뷰와 조언을 상호 제공',
    coreValue: '외로운 취업 준비 과정을 함께 이겨내고, 격식 없는 정직한 포트폴리오 첨삭을 통해 서류 합격률을 200% 견인',
    businessModel: '현업 빅테크 리드 개발자 및 아트 디렉터의 유료 정밀 매치 첨삭 첨부 가상 세션 요금 연동',
    targetAudience: '첫 포폴을 어설프게 혼자 준비 중이며 자소서 합격 포인트를 명료하게 얻어가지지 못해 갈팡질팡하는 주니어 지망생',
    brandVoice: '친근감 넘치고 성장을 갈구하는 젊고 트렌디한 인디고 딥오프 컬러 계역, 자유분방하고 긍정적인 캠퍼스 커뮤니티',
    features: '이력서 마크다운식 상호 투고 피드, 실시간 댓글 토론 영역, 주간 급상승 스터디 부원 서치 컴포넌트, 가상 실시간 합격률 분석 칩',
    cta: '내 이력서 투고하고 리뷰 받기, 멘토 코멘트 신청',
    style: '가벼운 소통 카드 뷰, 태그별 분류 칩, 피어 리뷰가 달릴 때마다 상단에 빠르게 흘러가는 실시간 메시지 공보 롤링 보드',
    pages: '리뷰 소통 피드 광장, 멘토들의 꿀팁 게시판, 나의 포트폴리오 대형 보관소',
    colors: '인디 블루, 마일드 레몬 파우더 옐로우, 소프트 크림, 다크 퍼플',
    keyAssets: '커리어 성장 비주얼 마일스톤 벡터 일러스트, 합격 보증 체크 일러스트',
    animations: '리뷰 투고 시 하늘에서 사뿐하게 내려오는 슬라이드 엔트리 에코, 호버 시 카드 그림자 고대비 상승 모션',
    dataPersistence: '로컬 스토리지를 바인딩하여 새로 업로드한 내 자소서 및 토론 답변 내역 완전 영구 저장',
    libraries: 'Tailwind CSS, motion, lucide-react',
    additional: '우수 피드백에 하트 추천 점수를 누를 시 명사 순위(랭킹 피드)가 즉시 재정렬되는 로직 가이드 동봉'
  }
];

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || process.env.GEMINI_API_KEY || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPatchNotesModal, setShowPatchNotesModal] = useState(false);
  const [guideTab, setGuideTab] = useState<'beginners' | 'examples'>('beginners');
  const [tempApiKey, setTempApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'branding' | 'design' | 'engineering'>('branding');
  
  const [formData, setFormData] = useState({
    projectName: '',
    companyName: '',
    developerName: '',
    purpose: '',
    websiteType: '랜딩페이지(1 Page)',
    requiresAuth: 'X',
    designLanguage: '한국어',
    coreValue: '',
    businessModel: '',
    references: '',
    targetAudience: '',
    brandVoice: '',
    features: '',
    cta: '',
    style: '',
    pages: '',
    colors: '',
    keyAssets: '',
    animations: '',
    dataPersistence: '',
    libraries: '',
    additional: '',
    images: [] as { data: string; mimeType: string }[]
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [usage, setUsage] = useState<{ promptTokens: number; candidatesTokens: number } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState('');

  const patchNotes = [
    { 
      version: 'v1.18.3', 
      date: '2026-06-11', 
      title: '한 번에 완벽한 홈페이지 개발을 위한 초정밀 체계적 프롬프트 매개 엔진 탑재', 
      changes: [
        'AI 스튜디오 Build 특화형 완벽 싱글/멀티 페이지 아키텍처 및 세이프 레이아웃 가이드가 자동 설계되도록 핵심 프롬프트 엔진 고도화',
        '상태 관리(React hooks, LocalStorage), 액티브 인터랙션 및 프레싱 모션 피드백, 헤더 푸터 개발자 및 회사 크레딧 지침 명확화',
        '다크 및 라이트 모던 테마 타이포그래피, 고밀도 Mock 데이터 사전 주입 규칙을 이끌어내 완성도 극대화'
      ] 
    },
    { 
      version: 'v1.18.2', 
      date: '2026-06-10', 
      title: '기초 정보 내 회사명 및 개발자명 구성 필드 신설', 
      changes: [
        '기초 정보 영역에 회사명(선택) 및 개발자명(필수) 입력 필드를 새롭게 도입하여 커스텀 요구사항 정보력 강화',
        '자동 기획 및 빌드용 프롬프트 메인 프레임워크에 입력된 회사명과 개발자 정보를 유기적으로 매칭하여 프롬프트 완성도 및 개인화 최적화 완료'
      ] 
    },
    { 
      version: 'v1.18.1', 
      date: '2026-06-10', 
      title: '홈페이지 종류 항목 AI 추천 단추 개설', 
      changes: [
        '홈페이지 종류(websiteType) 선택 필드에도 입력된 기초 정보(프로젝트명, 웹사이트 목적) 기준 자동 홈페이지 종류 분류 기능 추가 완료',
        '사용자 편의성을 늘리고 20가지 테마 선정 부담을 덜도록 AI 자동 최적 선택 알고리즘 정교화'
      ] 
    },
    { 
      version: 'v1.18.0', 
      date: '2026-06-10', 
      title: '기초 정보 기반 AI 맞춤 추천 기능 및 폼 배치 최적화', 
      changes: [
        '프로젝트 이름 바로 다음에 웹사이트 목적을 배치하고 홈페이지 종류는 기초 정보 최하단으로 이동하는 구조 최적화',
        '핵심 가치 및 차별점, 서비스 형태/수익 모델, 참고 사이트/벤치마킹 입력란에 입력된 웹사이트 목적 정보를 바탕으로 실시간 추천을 제공하는 AI 개별 추천 단추 탑재',
        '상세 기획 및 개별 추천 로직에 최신 gemini-3.5-flash 모델을 기본 모델로 지정하여 응답성 및 기획력 향상'
      ] 
    },
    { 
      version: 'v1.17.0', 
      date: '2026-06-06', 
      title: '웹사이트 목적 입력란 서술형 텍스트 영역으로 업그레이드', 
      changes: [
        '기존 단일 행 한 줄 입력란 형태의 웹사이트 목적 입력 폼을 글자 수 제한 없는 여러 행 텍스트 영역(Textarea)으로 전면 교체',
        '원스톱 상세 목적 기획 및 장문 서사가 가능하도록 크기 자동 조절(resize-y) 및 사용자 편의성을 높인 레이아웃 적용 완료'
      ] 
    },
    { 
      version: 'v1.16.9', 
      date: '2026-06-06', 
      title: '추천 기획 예시 탭 타이틀 문구 간소화', 
      changes: [
        '사용방법 가이드 내 추천 기획 예시 탭 버튼의 타이틀을 더 간결하고 직관적으로 변경 (\'추천 기획 예시 10선\'에서 \'추천 기획 예시\'로 조정)'
      ] 
    },
    { 
      version: 'v1.16.8', 
      date: '2026-06-06', 
      title: '범용 추천 예시 20대 블루프린트 대폭 완성', 
      changes: [
        '해빗 트래커, 스마트 PT 홈트, 공간 대관 매칭, IoT 식물 대시보드, 유기농 숍, 자산 펀딩, 개발 주니어 커리터스 등 가장 널리 요구되는 실전 도메인 위주의 명인급 기획 템플릿 10선 신규 수립',
        '원클릭 자동 폼 대입 기능과 완동하여 20가지 테마로 왕초보도 신속 영감을 얻고 일품급 프롬프트를 1초만에 축조할 수 있도록 보강 완료'
      ] 
    },
    { 
      version: 'v1.16.7', 
      date: '2026-06-06', 
      title: '왕초보 가이드 및 10대 추천 활용 예시 시스템 탑재', 
      changes: [
        '코딩을 1줄도 모르는 왕초보를 위한 직관적인 4단계 스텝바이스텝 가이드 제공',
        '카페, 포트폴리오, SaaS, CRM, 북클럽 등 일치율 100% 실전 사용 예시 10선 구축',
        '원클릭 자동 폼 완성 기능(Quick Apply)으로 초보자도 1초 만에 멋진 기획 수립 가능'
      ] 
    },
    { 
      version: 'v1.16.6', 
      date: '2026-06-06', 
      title: '프롬프트 규칙 및 홈페이지 종류 대폭 확장', 
      changes: [
        '단일 앱 생성 시 좌측 상단 로고(프로젝트 이름) 지정 규칙을 프롬프트에 추가',
        'ERP, LMS, CMS, 사내 인트라넷/그룹웨어 등 더욱 다양한 홈페이지 종류 옵션 추가'
      ] 
    },
    { 
      version: 'v1.16.5', 
      date: '2026-06-06', 
      title: '홈페이지 종류에 CRM 카테고리 추가', 
      changes: [
        '기초 정보 입력폼의 홈페이지 종류 항목에 CRM (고객 관계 관리)을 선택 옵션으로 추가 완료'
      ] 
    },
    { 
      version: 'v1.16.4', 
      date: '2026-06-03', 
      title: 'API Key 가시성 토글(눈동자 버튼) 기능 추가', 
      changes: [
        'API Key 설정 모달 내 입력 칸 우측에 눈동자 아이콘 버튼 추가',
        '원클릭으로 자신이 입력한 API Key를 텍스트 형태로 간편하게 확인하거나 숨길 수 있도록 토글 인터랙션 구현'
      ] 
    },
    { 
      version: 'v1.16.3', 
      date: '2026-06-03', 
      title: 'API Key 자동 로컬 저장 기능 추가', 
      changes: [
        '사용자가 입력한 Gemini API Key를 브라우저 로컬 저장소(localStorage)에 안전하게 영구 저장',
        '해당 PC에서 다시 접속 시 동일한 API Key를 자동으로 유지하여 매번 입력할 필요 없도록 개선'
      ] 
    },
    { 
      version: 'v1.16.2', 
      date: '2026-06-03', 
      title: '구글 AI 스튜디오 Build 이동 버튼 탑재', 
      changes: [
        '생성된 프롬프트 영역 하단에 구글 AI 스튜디오 Build 바로가기 버튼 추가',
        '버튼 선택 시 해당 페이지(https://aistudio.google.com/apps)로 신규 탭 전환 및 이동하도록 구현'
      ] 
    },
    { 
      version: 'v1.16.1', 
      date: '2026-06-03', 
      title: '브랜드 로고 프로젝트명 실시간 100% 동기화', 
      changes: [
        '좌측 상단 브랜드 로고 및 타이틀 섹션 추가 구현',
        '사용자가 입력한 프로젝트 이름(projectName)과 실시간으로 100% 일치하여 업데이트되도록 연동 완료'
      ] 
    },
    { 
      version: 'v1.16.0', 
      date: '2026-06-03', 
      title: '상세 기획 비주얼 고도화 및 필수 기입란 정밀 표시', 
      changes: [
        '기초 정보 필수 항목(선택 필수) 빨간색 별표(*) 및 선택사항 조절 안내',
        '홈페이지 종류 기본 드롭다운 카테고리에 강의 플랫폼 추가 신설',
        '상세 기획(AI Optimized) 부문의 11가지 상세 설정을 3가지 비주얼 탭 단위로 전면 리비전 개편',
        '상세 기획 각 설정란 하단에 클릭형 추천 에셋 프리셋 칩을 탑재하여 초보자도 원터치로 구성 가능하도록 UI 기능 확장'
      ] 
    },
    { 
      version: 'v1.15.0', 
      date: '2026-06-02', 
      title: '디자인 언어 선택 기능 추가', 
      changes: ['기초 정보 입력란에 기획할 홈페이지의 디자인 언어 선택 드롭다운 추가', '한국어를 기본값으로 설정하고 AI 기획 완성 및 프롬프트 생성 로직에 다국어 지침 연동 완료'] 
    },
    { 
      version: 'v1.14.0', 
      date: '2026-05-22', 
      title: '홈페이지 종류 세분화 추가', 
      changes: ['홈페이지 선택 드롭다운 항목에 생산성 앱/툴, 마케팅 플랫폼 등 자주 쓰이는 홈페이지 종류 추가'] 
    },
    { 
      version: 'v1.13.0', 
      date: '2026-05-21', 
      title: '로그인/회원가입 기능 선택 옵션 추가', 
      changes: ['기초 정보 입력란에 로그인/회원가입 기능 추가 유무(O, X) 선택 섹션 탑재', '기본값으로 일반 비로그인 환경(X) 설정 및 AI 기획 연동 반영'] 
    },
    { 
      version: 'v1.12.0', 
      date: '2026-05-21', 
      title: '홈페이지 종류 선택 기능 추가', 
      changes: ['기초 정보 입력란에 홈페이지 종류 선택 드롭다운 탑재', '기본값으로 랜딩페이지(1 Page) 설정 및 기획 반영'] 
    },
    { 
      version: 'v1.11.0', 
      date: '2026-05-09', 
      title: '기초 입력 항목 추가 및 기획 자동화 고도화', 
      changes: ['핵심 가치, 서비스 형태, 참고 사이트 기초 항목 추가', '원터치 기획 시나리오 최적화'] 
    },
    { 
      version: 'v1.10.0', 
      date: '2026-05-09', 
      title: '완성도 극대화 기획 항목 추가', 
      changes: ['애니메이션 및 상호작용 지침 추가', '데이터 관리 방식 (Persistence) 항목 추가', '특정 프론트엔드 라이브러리 지정 기능 추가'] 
    },
    { 
      version: 'v1.9.0', 
      date: '2026-04-19', 
      title: '패치노트 및 서비스 안정화', 
      changes: ['실시간 패치노트 기능 추가', 'API 비용 예측을 위한 다양한 생성 사례 예시 추가'] 
    },
    { 
      version: 'v1.8.0', 
      date: '2026-04-04', 
      title: '멀티모달 이미지 분석 도입', 
      changes: ['참고 이미지 업로드 기능 추가 (PNG, JPG)', '이미지 기반 시각적 분석 프롬프트 반영', 'Gemini 3 Flash 멀티모달 엔진 최적화'] 
    },
    { 
      version: 'v1.7.0', 
      date: '2026-04-04', 
      title: '기획 정교화 및 UI 가독성 개선', 
      changes: ['브랜드 보이스, CTA, 시각적 요소 항목 추가', '전체적인 텍스트 대비 및 가독성 대폭 개선', '배경 및 입력창 디자인 고도화'] 
    },
    { 
      version: 'v1.6.0', 
      date: '2026-04-04', 
      title: 'UI/UX 리뉴얼 및 사용 가이드', 
      changes: ['히어로 섹션 디자인 강화', '초보자를 위한 상세 사용방법 가이드 모달 추가'] 
    },
    { 
      version: 'v1.5.0', 
      date: '2026-03-19', 
      title: 'P.A.S.T. 프롬프트 프레임워크', 
      changes: ['Persona, Action, Style, Target 기반 고해상도 프롬프트 생성', 'P.A.S.T. 프레임워크 안내 가이드 추가'] 
    },
    { 
      version: 'v1.4.0', 
      date: '2026-03-19', 
      title: '원터치 AI 자동 기획', 
      changes: ['프로젝트 이름과 목적 기반 자동 정보 입력 기능 추가'] 
    },
    { 
      version: 'v1.3.0', 
      date: '2026-03-19', 
      title: '모델 업그레이드 및 실시간 비용', 
      changes: ['Gemini 3 Flash Preview 모델 적용', '프롬프트 생성 시 소모 토큰 및 예상 비용 실시간 표시'] 
    },
    { 
      version: 'v1.2.0', 
      date: '2026-03-19', 
      title: '운영 편의 기능 추가', 
      changes: ['API 상세 비용 안내 모달 추가', '우측 하단 문의 및 플랫폼 바로가기 버튼 추가'] 
    },
    { 
      version: 'v1.0.0', 
      date: '2026-03-19', 
      title: '혁신 홈페이지 개발 AI 런칭', 
      changes: ['홈페이지 요구사항 기반 AI 프롬프트 생성 엔진 구축', 'Gemini API 연동 및 API Key 보안 관리'] 
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyExample = (example: typeof PRESET_EXAMPLES[0]) => {
    setFormData({
      projectName: example.projectName,
      companyName: '',
      developerName: '',
      purpose: example.purpose,
      websiteType: example.websiteType,
      requiresAuth: example.requiresAuth,
      designLanguage: example.designLanguage,
      coreValue: example.coreValue,
      businessModel: example.businessModel,
      references: '',
      targetAudience: example.targetAudience,
      brandVoice: example.brandVoice,
      features: example.features,
      cta: example.cta,
      style: example.style,
      pages: example.pages,
      colors: example.colors,
      keyAssets: example.keyAssets,
      animations: example.animations,
      dataPersistence: example.dataPersistence,
      libraries: example.libraries,
      additional: example.additional || '',
      images: []
    });
    setShowGuideModal(false);
    alert(`🎉 '${example.projectName}' 기획 양식이 100% 자동 적용되었습니다!\n하단의 '[Build 프롬프트 생성하기]' 버튼만 누르면 바로 완벽한 개발 프롬프트가 제작됩니다!`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { data: base64String, mimeType: file.type }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('gemini_api_key', tempApiKey);
    setApiKey(tempApiKey);
    setShowApiKeyModal(false);
  };

  const handleAutoPlan = async () => {
    if (!apiKey) {
      setError('API Key가 필요합니다. 우측 상단에서 API Key를 입력해주세요.');
      setShowApiKeyModal(true);
      return;
    }
    if (!formData.projectName || !formData.purpose || !formData.developerName) {
      setError('프로젝트 이름, 개발자명, 웹사이트 목적을 먼저 입력해주세요.');
      return;
    }

    setIsPlanning(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = `
        다음 기초 정보를 바탕으로 웹사이트 기획안을 완성해주세요.
        - 프로젝트 이름: ${formData.projectName}
        - 회사명: ${formData.companyName || '개인/비지정'}
        - 개발자명: ${formData.developerName}
        - 홈페이지 종류: ${formData.websiteType}
        - 디자인 언어: ${formData.designLanguage}
        - 로그인/회원가입 기능 추가 유무: ${formData.requiresAuth === 'O' ? '필요함 (O)' : '필요하지 않음 (X)'}
        - 웹사이트 목적: ${formData.purpose}
        - 핵심 가치/차별점: ${formData.coreValue || '특별히 지정되지 않음'}
        - 서비스 형태/비즈니스 모델: ${formData.businessModel || '특별히 지정되지 않음'}
        - 참고 사이트/벤치마킹: ${formData.references || '특별히 지정되지 않음'}

        **중요**: 기획안의 모든 세부 제안 내용(타겟 고객, 브랜드 보이스, 주요 기능, 핵심 호출 문구 등 모든 필드의 텍스트 값)은 반드시 사용자가 선택한 디자인 언어(${formData.designLanguage})로 작성해 주십시오.

        다음 항목들에 대해 가장 적절하고 매력적인 내용을 제안해주세요:
        1. 타겟 고객
        2. 브랜드 보이스/톤 (예: 전문적인, 친근한, 대담한 등)
        3. 주요 기능 (3~5개)
        4. 핵심 호출 문구 (CTA - 예: 지금 시작하기, 무료 상담받기)
        5. 디자인 스타일/분위기
        6. 필요한 페이지 구성
        7. 메인 색상 (배경색과 포인트 컬러 포함)
        8. 주요 시각적 요소 (예: 고해상도 사진, 3D 일러스트, 미니멀 아이콘)
        9. 애니메이션 및 상호작용 효과 (예: 부드러운 페이지 전환, 호버 이펙트)
        10. 데이터 관리 및 저장 방식 (예: UI용 Mock 데이터, LocalStorage, 또는 백엔드 연동 구조)
        11. 추천하는 특정 프론트엔드 라이브러리 (예: Framer Motion, shadcn/ui, Recharts)

        응답은 반드시 다음 JSON 형식으로만 출력하세요:
        {
          "targetAudience": "내용",
          "brandVoice": "내용",
          "features": "내용",
          "cta": "내용",
          "style": "내용",
          "pages": "내용",
          "colors": "내용",
          "keyAssets": "내용",
          "animations": "내용",
          "dataPersistence": "내용",
          "libraries": "내용"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const result = JSON.parse(response.text || '{}');
      setFormData(prev => ({
        ...prev,
        ...result
      }));
    } catch (err) {
      console.error(err);
      setError('자동 기획 중 오류가 발생했습니다. API Key를 확인해주세요.');
    } finally {
      setIsPlanning(false);
    }
  };

  const [recommendingField, setRecommendingField] = useState<string | null>(null);

  const handleRecommendField = async (fieldId: string) => {
    if (!apiKey) {
      setError('API Key가 필요합니다. 우측 상단에서 API Key를 입력해주세요.');
      setShowApiKeyModal(true);
      return;
    }
    if (!formData.projectName || !formData.purpose || !formData.developerName) {
      setError('프로젝트 이름, 개발자명, 웹사이트 목적을 먼저 입력해주세요.');
      return;
    }

    setRecommendingField(fieldId);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      let systemPrompt = '';
      if (fieldId === 'websiteType') {
        systemPrompt = `
          프로젝트 이름: "${formData.projectName}"
          웹사이트 목적: "${formData.purpose}"

          위 정보를 토대로 아래 정의된 홈페이지 종류 목록 중에서 이 웹사이트에 가장 적합한 종류를 정확히 딱 1개 골라 그 텍스트 그대로 골라주세요.
          
          선택 가능한 후보 목록:
          ['랜딩페이지(1 Page)', '기업 및 서비스 다중 페이지', '포트폴리오 사이트', '블로그 / 컨텐츠 미디어', 'B2B/B2C SaaS 플랫폼', '쇼핑몰 / 이커머스', '생산성 앱 / 툴', 'CRM(고객 관계 관리)', 'ERP (전사적 자원 관리)', 'LMS (학습 관리 시스템)', 'CMS (콘텐츠 관리 시스템)', '대시보드 / 어드민 페이지', '예약 및 매칭 플랫폼', '사내 인트라넷 / 그룹웨어', '마케팅 플랫폼', '강의 플랫폼', '부동산 / 프롭테크 플랫폼', '소셜 플랫폼 / 커뮤니티', '포털 / 기타']

          질문, 인사말, 마크다운, 대괄호, 따옴표, 백틱 등 추가 텍스트를 절대 출력하지 마십시오. 오직 후보 목록에 있는 글자(예: "쇼핑몰 / 이커머스")와 100% 동일한 이름만 단독 출력하십시오.
        `;
      } else if (fieldId === 'coreValue') {
        systemPrompt = `
          프로젝트 이름: "${formData.projectName}"
          웹사이트 목적: "${formData.purpose}"

          위 정보를 토대로 이 웹사이트가 가져갈 수 있는 매력적이고 차별화된 "핵심 가치 및 차별점"을 요약해서 딱 1~2문장의 한글 완성형 텍스트로 추천해주세요. 
          반드시 사용자가 적은 '웹사이트 목적'에 정교하게 정렬되어야 합니다. (예: "10배 빠른 처리와 사용자 맞춤형 분석으로 일 평균 30분 시간 절약")
          질문, 인사말, 추가 설명, 마크다운(따옴표, 백틱 등)은 절대 출력하지 말고 오직 한 개의 실전 완성 문어체 추천 텍스트 내용만 직접 출력하십시오.
        `;
      } else if (fieldId === 'businessModel') {
        systemPrompt = `
          프로젝트 이름: "${formData.projectName}"
          웹사이트 목적: "${formData.purpose}"

          위 정보를 토대로 이 웹사이트에 가장 적합한 실용적인 "서비스 형태 및 비즈니스/수익 모델"을 1~2문장 내외의 한글 완성형 텍스트로 추천해주세요. 
          (예: "기본 기능 무료 제공 및 프리미엄 분석 보고서 유료 구독제(Freemium)"처럼 도메인 맞춤 설계)
          질문, 인사말, 추가 설명, 마크다운(따옴표, 백틱 등)은 절대 출력하지 말고 오직 실전 완성형 추천 텍스트 내용만 직접 출력하십시오.
        `;
      } else if (fieldId === 'references') {
        systemPrompt = `
          프로젝트 이름: "${formData.projectName}"
          웹사이트 목적: "${formData.purpose}"

          위 정보를 토대로 이 웹사이트가 벤치마킹 혹은 기획 레퍼런스로 삼기 좋은 유명 실제 서비스 브랜드를 2~3개 추천하고 각각 대표적인 한글 벤치마킹 이유를 짧게 추천해주세요. (예: "Toss처럼 극도로 직관적인 데이터 레이아웃 및 미니멀 UI 벤치마킹")
          질문, 인사말, 추가 설명, 마크다운(따옴표, 백틱 등)은 절대 출력하지 말고 오직 추천 텍스트 내용만 직접 출력하십시오.
        `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: systemPrompt,
      });

      const recommendation = (response.text || '').trim().replace(/^['"`\s\[\]]+|['"`\s\[\]]+$/g, '');
      if (recommendation) {
        setFormData(prev => ({
          ...prev,
          [fieldId]: recommendation
        }));
      }
    } catch (err) {
      console.error(err);
      setError('AI 추천 중 오류가 발생했습니다. API Key를 확인해 주세요.');
    } finally {
      setRecommendingField(null);
    }
  };

  const generatePrompt = async () => {
    if (!apiKey) {
      setError('API Key가 필요합니다. 우측 상단에서 API Key를 입력해주세요.');
      setShowApiKeyModal(true);
      return;
    }
    if (!formData.projectName || !formData.purpose || !formData.developerName) {
      setError('프로젝트 이름, 개발자명, 웹사이트 목적을 먼저 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const promptText = `
당신은 구글 AI 스튜디오 Build(Vibe Coding) 환경에서 단 한 번의 빌드로 에러 없는 완전무결하고 극도로 세련된 상용 수준의 홈페이지를 구현해내는 세계 최고의 수석 프롬프트 엔지니어이자 솔루션 아키텍트입니다.

사용자의 요구사항${formData.images.length > 0 ? ' 및 첨부된 시각적 이미지 데이터' : ''}을 분석하여, AI가 다른 소스코드 도움 없이 한눈에 완벽해 보이는 완성도 높은 웹 애플리케이션 소스코드를 작성하도록 극도로 세밀하게 체계화된 "홈페이지 제작 마스터 프롬프트"를 작성해주세요.

[사용자 입력 기본 명세]
- 프로젝트 이름: ${formData.projectName || '미정'}
- 회사명: ${formData.companyName || '개인/비지정'}
- 개발자명: ${formData.developerName || '미정'}
- 홈페이지 종류: ${formData.websiteType || '랜딩페이지(1 Page)'}
- 디자인 언어: ${formData.designLanguage || '한국어'}
- 로그인/회원가입 기능 추가 유무: ${formData.requiresAuth === 'O' ? '필요함 (O) - 클라이언트 모달 또는 데모 기능으로 완벽히 구현' : '필요하지 않음 (X)'}
- 웹사이트 목적: ${formData.purpose || '미정'}
- 핵심 가치/차별점: ${formData.coreValue || '미정'}
- 서비스 형태 / 수익 모델: ${formData.businessModel || '미정'}
- 참고 사이트 / 벤치마킹: ${formData.references || '미정'}
- 타겟 고객: ${formData.targetAudience || '미정'}
- 브랜드 보이스: ${formData.brandVoice || '미정'}
- 주요 기능 명세: ${formData.features || '미정'}
- 핵심 CTA 문구: ${formData.cta || '미정'}
- 선호 디자인/분위기: ${formData.style || '미정'}
- 필요한 페이지 구조: ${formData.pages || '미정'}
- 메인 색상 정보: ${formData.colors || '미정'}
- 주요 시각적 기호: ${formData.keyAssets || '미정'}
- 애니메이션 효과: ${formData.animations || '미정'}
- 데이터 관리 기법: ${formData.dataPersistence || '미정'}
- 외부 가용 라이브러리: ${formData.libraries || '미정'}
- 기타 특이 요구사항: ${formData.additional || '없음'}
${formData.images.length > 0 ? '\n[시각적 참고 자원]\n유저가 참조용 이미지를 첨부했습니다. 이 이미지의 프리미엄 레이아웃, 컬러 베리에이션, 그리드 정렬 형태를 고스란히 영감받아 코드로 녹여낼 수 있도록 프롬프트에 설계 지침으로 정밀 이식하세요.' : ''}

[생성되는 최종 프롬프트의 체계적 구조 포맷 레시피]
당신이 출력해야 할 프롬프트는 아래의 7단계 아키텍처 스키마를 엄격히 전개하여 작성되어야 합니다. (이 포맷을 그대로 포함한 마스터 프롬프트를 풍부한 기술적 제약과 함께 구성하세요):

### 1단계: Core Persona & Role Mastery (수석 마스터 페르소나 설정)
- "너는 전 세계에서 가장 세련된 컴포넌트 설계 철학과 탁월한 타이포그래피 정렬 감각을 보유한 시니어 에스더틱(Aesthetic) 인터랙티브 웹 앱 개발자야."로 시작하는 전임 개발자 자격 정의.
- 사용자 경험(UX) 및 모바일-데스크톱 정밀 드로잉에 대한 완벽한 세심함 탑재 명령.

### 2단계: Complete Page Architecture & Layout Guide (완성형 아키텍처 정보)
- ${formData.websiteType} 양식에 걸맞은 단일/다중 페이지 그리드 레이아웃 명시.
- 상단 고정식 미니멀 글래스모피즘(Glassmorphism) 네비게이션 헤더, 본문 히어로 섹션, 특장점 대시보드, 핵심 상호작용 위젯, 고객 리뷰, 완성형 FAQ, 그리고 신뢰감을 주는 푸터까지 포함하는 체계적인 구조 지정.
- 본문의 최대 폭을 \`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\` 등의 패턴으로 바운딩하고, 여백과 패딩을 박진감 있게 제어하여 휑해 보이거나 반대로 너무 답답하지 않도록 세밀한 레이아웃 가이드 제시.

### 3단계: Exquisite Visual Theme & Typography Pairing (극강의 비주얼 제어)
- 메인 컬러 색상(${formData.colors})과 지향 스타일(${formData.style})을 활용한 완벽한 테마 구축 가이드라인. (예: 다크 모드 시 단순 검은색이 아닌 세련된 슬레이트 블랙 \`bg-zinc-950\` 계열, 라이트 모드 시 따뜻한 소프트 화이트 \`bg-stone-50/50\` 계열과 포인트 액센트 대비 제안)
- 폰트 위계(\`tracking-tight font-medium\`, 볼드 처리 및 텍스트 밝기 레이어 간 격차)를 정확히 정돈하는 타이포그래피 규칙.
- 아이콘은 오직 \`lucide-react\`에서 엄선하고, 고해상도 시청각 자원(이미지 플레이스홀더를 고품격 테마에 맞는 Unsplash 이미지 URL로 지정하여 실시간 로드)을 매핑하도록 프롬프트에 상세 묘사.

### 4단계: High-Density Business Mock Data Pre-Injection (고밀도 데이터 실재화 규칙 - 절대 중요!)
- **절대적 규칙**: 빈 화면이나 성의 없는 플레이스홀더 대신, 웹사이트의 목적(${formData.purpose}) 및 타겟 고객에 특화된 실존감 넘치는 Mock 데이터셋(최소 3~5개 이상의 완전한 형태의 상용 데이터를 내포하는 상세 JSON 객체 어레이)을 프로그램 내에 아예 직접 하드코딩 형태로 이식하도록 지시하세요.
- 사용자가 페이지를 열었을 때, 마치 실시간 운영 중인 고급 앱/웹사이트에 들어온 것과 같은 고도의 몰입감과 웅장한 로딩 화면을 선사해야 합니다.

### 5단계: Robust State Management & Interactive Motion Design (강력한 상태제어 및 인터랙션)
- React 18의 모던 훅을 부작용(무한 재렌더링 등) 없이 안전하게 구현하도록 강제하는 에러 프리 상태 관리 지침.
- 데이터를 단순히 보기만 하는 것에 그치지 않고, 추가/조회/정렬/필터링/좋아요/보관함 담기 등 완전하게 동작하는 CRUD 시나리오를 갖추도록 유도.
- 브라우저를 새로고침해도 기획 데이터가 소멸하지 않도록 \`localStorage\` 영속 자동 동기화 로직을 소스코드 수준에서 온전히 짜 넣으라는 상세 조항 명기.
- \`motion\`(from \`motion/react\`) 라이브러리를 사용해 우아한 모션 레이아웃(히어로 섹션 스태거드 진입 효과, 카드 호버 스케일 업 \`whileHover={{ scale: 1.02 }}\`, 버튼 마우스 다운 피드백 \`whileTap={{ scale: 0.98 }}\`)을 즉시 구동 가능한 형태로 적용하도록 설계 지침 이식.

### 6단계: Zero-Error Implementation & Technical Constraints (에러 방지 제약)
- CSS 클래스는 100% Tailwind CSS 유틸리티 단독 사용 (외부 인라인 스타일 및 CSS 중첩 작성 절대 금지).
- \`window.alert\`나 \`window.prompt\` 같은 올드하고 조잡한 브라우저 자체 API 사용을 엄격히 제한하고, 모던 컴포넌트 기반 맞춤형 인앱 모달(Dialog)과 상냥한 무동작 경고 대신 멋진 피드백 UI 혹은 가벼운 토스트 알림으로 세련되게 우회 제작하라는 개발 룰 추가.
- UI 터치 타겟은 최소 44px 이상으로 확보하며 가독성 높게 에러 바운더리를 설정하는 요건.

### 7단계: Professional Brand Identity & Placement Credits (브랜드 배치 및 푸터 크레딧 명문화)
- **헤더 브랜드 로고 가이드**: 웹사이트 최상단 좌측 네비게이션 헤더에 프로젝트 이름 \`"${formData.projectName}"\`을 트렌디한 데코레이션 아이콘과 함께 마크하여 명확한 브랜드 아이덴티티를 확립시킬 것.
- **개발자 및 회사 크레딧**: 최하단 푸터 영역에 개발자명 \`"${formData.developerName}"\`과 회사명 \`${formData.companyName ? `"${formData.companyName}"` : '개인/프리랜서'}\` 정보가 조화로운 폰트 페어링(\`font-mono text-xs text-zinc-500\`)과 깔끔한 카피라이트 텍스트 형태로 조화롭게 명시되도록 할 것. 푸터 레이아웃은 세련된 보더라인 경계와 간격 설계로 디자인에 완전히 밀착 적용되어야 함.

[최종 프롬프트 출력 제약 사항]
1. 복사 활용 방법이나 인사말("여기에 사용하실 프롬프트를 제공합니다" 등)은 전부 삭제하고, **오직 위의 1단계부터 7단계까지 체계적으로 서술된 템플릿 마크다운 텍스트 본문 전체만** 직접 반환하십시오.
2. 결과물 프롬프트는 완전히 상용 홈페이지가 되도록 극도로 디테일하게, 아주 구체적이고 전문적인 웹 개발자 용어를 사용해 체계적 지시사항으로 상세화하십시오.
3. 결과물(웹사이트 전체 레이아웃, 텍스트 콘텐츠, 유저 인터페이스 등)은 반드시 사용자가 선택한 디자인 언어(${formData.designLanguage})로 구현될 수 있도록 정교하게 설계하여 작성하세요.
`;

      const contents = formData.images.length > 0 
        ? {
            parts: [
              { text: promptText },
              ...formData.images.map(img => ({
                inlineData: {
                  data: img.data,
                  mimeType: img.mimeType
                }
              }))
            ]
          }
        : promptText;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
      });

      setGeneratedPrompt(response.text || '');
      if (response.usageMetadata) {
        setUsage({
          promptTokens: response.usageMetadata.promptTokenCount,
          candidatesTokens: response.usageMetadata.candidatesTokenCount
        });
      }
    } catch (err) {
      console.error(err);
      setError('프롬프트 생성 중 오류가 발생했습니다. API Key가 유효한지 확인해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('프롬프트가 클립보드에 복사되었습니다. 구글 AI 스튜디오 Build에 붙여넣어주세요!');
  };

  const basicFields = [
    { id: 'projectName', label: '프로젝트 이름', icon: <FileText size={18} className="text-indigo-400" />, placeholder: '예: 혁신적인 AI 포트폴리오 사이트', required: true },
    { id: 'companyName', label: '회사명', icon: <Building size={18} className="text-indigo-400" />, placeholder: '예: 넥스트인 (선택사항)', required: false },
    { id: 'developerName', label: '개발자명', icon: <User size={18} className="text-indigo-400" />, placeholder: '예: 홍길동', required: true },
    { id: 'purpose', label: '웹사이트 목적', icon: <Layout size={18} className="text-indigo-400" />, type: 'textarea', placeholder: '예: 개인 포트폴리오 전시 및 프리랜서 문의 접수', required: true },
    { id: 'requiresAuth', label: '로그인/회원가입 기능 추가 유무', icon: <Key size={18} className="text-indigo-400" />, type: 'radio', options: ['O', 'X'], required: true },
    { id: 'designLanguage', label: '디자인 언어', icon: <Languages size={18} className="text-indigo-400" />, type: 'select', options: ['한국어', '영어', '일본어', '중국어', '스페인어', '프랑스어', '독일어', '기타'], required: true },
    { id: 'coreValue', label: '핵심 가치 및 차별점', icon: <Sparkles size={18} className="text-indigo-400" />, placeholder: '예: 10배 빠른 처리, 혁신적인 UI/UX' },
    { id: 'businessModel', label: '서비스 형태 / 수익 모델', icon: <Users size={18} className="text-indigo-400" />, placeholder: '예: B2B SaaS 구독형, 무료 커뮤니티' },
    { id: 'references', label: '참고 사이트 / 벤치마킹', icon: <ArrowRight size={18} className="text-indigo-400" />, placeholder: '예: Apple처럼 깔끔한 레이아웃' },
    { id: 'websiteType', label: '홈페이지 종류', icon: <Layout size={18} className="text-indigo-400" />, type: 'select', options: ['랜딩페이지(1 Page)', '기업 및 서비스 다중 페이지', '포트폴리오 사이트', '블로그 / 컨텐츠 미디어', 'B2B/B2C SaaS 플랫폼', '쇼핑몰 / 이커머스', '생산성 앱 / 툴', 'CRM(고객 관계 관리)', 'ERP (전사적 자원 관리)', 'LMS (학습 관리 시스템)', 'CMS (콘텐츠 관리 시스템)', '대시보드 / 어드민 페이지', '예약 및 매칭 플랫폼', '사내 인트라넷 / 그룹웨어', '마케팅 플랫폼', '강의 플랫폼', '부동산 / 프롭테크 플랫폼', '소셜 플랫폼 / 커뮤니티', '포털 / 기타'], required: true },
  ];

  const detailFields = [
    { id: 'targetAudience', label: '타겟 고객', icon: <Users size={18} className="text-indigo-400" />, group: 'branding', placeholder: '예: IT 기업 채용 담당자, 스타트업 대표', presets: ["2030 직장인", "대학생 및 취준생", "소상공인 및 자영업자", "IT 기업 고위 임원"] },
    { id: 'brandVoice', label: '브랜드 보이스/톤', icon: <Sparkles size={18} className="text-indigo-400" />, group: 'branding', placeholder: '예: 신뢰감 있는 전문적인 톤, 혹은 친근하고 따뜻한 톤', presets: ["전문적이고 신뢰성 높은 톤", "친근하고 상냥한 대화형 톤", "감각적이고 세련된 트렌디 톤", "절제되고 직관적인 기술전문가 톤"] },
    { id: 'cta', label: '핵심 호출 문구 (CTA)', icon: <ArrowRight size={18} className="text-indigo-400" />, group: 'branding', placeholder: '예: 지금 시작하기, 무료 상담 신청', presets: ["지금 무료로 시작하기", "더 상세히 알아보기", "포트폴리오 바로 감상하기", "맞춤형 1:1 상담 예약하기"] },
    { id: 'features', label: '주요 기능', icon: <Code size={18} className="text-indigo-400" />, group: 'branding', placeholder: '예: 다크모드, 프로젝트 갤러리 필터링, 문의 폼', presets: ["실시간 동적 데이터 대시보드", "인터랙션 그리드 포트폴리오 갤러리", "사용자 맞춤 이메일 상담 접수 폼", "간편 소셜 로그인 및 마이페이지 통합"] },
    
    { id: 'style', label: '디자인 스타일/분위기', icon: <Palette size={18} className="text-indigo-400" />, group: 'design', placeholder: '예: 미니멀하고 미래지향적인 다크 테마', presets: ["미니멀하고 극도로 정교한 현대적 레이아웃", "미래지향적이고 입체적인 네온 다크 테마", "포근하고 정겨운 내추럴 감성 웹스타일", "비비드하고 에너지 넘치는 스타일링"] },
    { id: 'colors', label: '메인 색상', icon: <Palette size={18} className="text-indigo-400" />, group: 'design', placeholder: '예: 배경은 진한 회색, 포인트 컬러는 네온 퍼플', presets: ["배경: 완벽한 블랙, 포인트: 라이트 일렉트릭 블루", "배경: 부드러운 우유빛 아이보리, 포인트: 올리브 그린", "배경: 깔끔한 화이트, 포인트: 클래식 로열 블루", "배경: 다크 슬레이트 그레이, 포인트: 에너제틱 오렌지"] },
    { id: 'keyAssets', label: '주요 시각적 요소', icon: <Sparkles size={18} className="text-indigo-400" />, group: 'design', placeholder: '예: 고해상도 인물 사진, 추상적인 3D 그래픽', presets: ["고해상도 리얼리티 인물/스튜디오 라이브 포토", "초격차 테크니컬 3D 렌더링 일러스트", "심플하고 가시성 높은 미니멀 플랫 아이콘", "추상적인 유동형 그라데이션 기하학 백그라운드"] },
    { id: 'pages', label: '필요한 페이지', icon: <Layout size={18} className="text-indigo-400" />, group: 'design', placeholder: '예: 홈, 소개, 프로젝트, 이력서, 연락처', presets: ["원페이지(1 Page) 롱스크롤 구성", "소개 - 서비스 목록 - 요금 플랜 - Q&A - 문의", "회원가입 - 대시보드 제어판 - 마이페이지 데이터", "포트폴리오 요약 그리드 - 작품 전문 상세 화면"] },
    
    { id: 'animations', label: '애니메이션 및 상호작용', icon: <Zap size={18} className="text-indigo-400" />, group: 'engineering', placeholder: '예: 부드러운 스크롤, Framer Motion을 활용한 요소 등장 효과', presets: ["Framer Motion 고퀄리티 스태거 스무스 페이드", "스크롤 바인딩 패럴랙스 & 스티키 헤더 고정", "3D 입체 카드 플립 극대화 마우스호버 마이크로 인터랙션", "심플 스무딩 무빙 & 로딩 트랜지션 시그널"] },
    { id: 'dataPersistence', label: '데이터 관리 방식', icon: <Database size={18} className="text-indigo-400" />, group: 'engineering', placeholder: '예: LocalStorage를 활용한 데이터 유지, 상태 관리', presets: ["영구 브라우저 LocalStorage 이용 상태 보존", "순수 React Context API 임시 캐싱 컨트롤", "실시간 데이터 전용 Firebase Firestore 클라우드 원격 저장", "Express 백엔드 독립 REST API 및 세키리티 미들웨어 연동"] },
    { id: 'libraries', label: '필요한 컴포넌트/라이브러리', icon: <Package size={18} className="text-indigo-400" />, group: 'engineering', placeholder: '예: shadcn/ui, Recharts, Lucide-react', presets: ["framer-motion, lucide-react", "shadcn/ui, @radix-ui, tailwindcss", "recharts, d3 for dynamic charts", "zustand, @tanstack/react-query for api"] },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30 pb-20">
      {/* Top-Left Dynamic Brand Logo & Project Name */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md border border-zinc-800 bg-zinc-900/50 text-white shadow-lg">
        <div className="p-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20 flex items-center justify-center">
          <Sparkles size={16} className="text-indigo-400 animate-pulse" />
        </div>
        <span className="text-sm font-bold tracking-tight text-zinc-200">
          {formData.projectName || '혁신 홈페이지 개발 AI'}
        </span>
      </div>

      {/* API Key Status Button */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setShowPatchNotesModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 transition-all shadow-lg"
        >
          <Settings size={16} className="text-zinc-400" />
          <span className="text-sm font-medium hidden sm:inline">패치노트</span>
        </button>

        <button 
          onClick={() => setShowGuideModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 transition-all shadow-lg"
        >
          <FileText size={16} className="text-blue-400" />
          <span className="text-sm font-medium hidden sm:inline">사용방법</span>
        </button>

        <button 
          onClick={() => setShowCostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 transition-all shadow-lg"
        >
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-sm font-medium hidden sm:inline">API 비용</span>
        </button>

        <button 
          onClick={() => {
            setTempApiKey(apiKey);
            setShowApiKeyModal(true);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border transition-all shadow-lg ${
            apiKey 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
              : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 animate-pulse'
          }`}
        >
          <Key size={16} />
          <span className="text-sm font-medium hidden sm:inline">
            {apiKey ? 'API Key 적용됨' : 'API Key 필요'}
          </span>
          {apiKey ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
        </button>
      </div>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings size={20} className="text-indigo-400" />
                  API Key 설정
                </h3>
                <button onClick={() => setShowApiKeyModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                웹 배포 환경에서 프롬프트를 생성하려면 Gemini API Key가 필요합니다. 입력하신 키는 브라우저 로컬 저장소(localStorage)에 안전하게 자동 저장되어 해당 PC에서 계속 유지되며, 서버로 전혀 전송되지 않습니다.
              </p>
              <div className="space-y-2 mb-6">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Gemini API Key</label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-11 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={handleSaveApiKey}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                >
                  저장하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full aspect-video max-h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10 group"
        >
          {/* Enhanced Background Image/Gradient */}
          <div className="absolute inset-0 bg-zinc-950">
            <img 
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3" 
              alt="Web Development Background"
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/95 via-purple-900/60 to-zinc-950/95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6 inline-flex items-center justify-center p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl"
            >
              <Sparkles className="text-indigo-300 w-10 h-10 animate-pulse" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              혁신 홈페이지 개발 AI
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-white font-bold max-w-2xl mx-auto leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            >
              복잡한 기획부터 고해상도 프롬프트 생성까지<br className="hidden sm:block"/> 단 한 번의 터치로 완성하세요
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-sm text-white flex items-center gap-3 shadow-2xl font-bold"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
              <span className="tracking-widest uppercase text-[11px]">Developer : 정혁신</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* P.A.S.T. Framework Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-sm"
            >
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-3">
                <Sparkles size={16} />
                고해상도 프롬프트 공식: P.A.S.T.
              </h3>
              <div className="grid grid-cols-2 gap-3 text-[11px] text-zinc-400">
                <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
                  <span className="text-indigo-400 font-bold block mb-1">① Persona</span>
                  누구에게 시킬 것인가? (역할 정의)
                </div>
                <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
                  <span className="text-indigo-400 font-bold block mb-1">② Action</span>
                  무엇을 할 수 있는가? (유저 스토리)
                </div>
                <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
                  <span className="text-indigo-400 font-bold block mb-1">③ Style & Stack</span>
                  어떤 느낌으로, 무엇을 써서?
                </div>
                <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
                  <span className="text-indigo-400 font-bold block mb-1">④ Target/Detail</span>
                  놓치지 말아야 할 제약 조건
                </div>
              </div>
            </motion.div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                  <Layout className="text-indigo-400" />
                  요구사항 입력
                </h2>
                <p className="text-zinc-300 text-sm font-medium">최대한 자세히 입력할수록 더 매력적인 홈페이지 프롬프트가 생성됩니다.</p>
              </div>

              <div className="space-y-10">
                {/* 기초 정보 섹션 */}
                <div className="space-y-5">
                  <div className="mb-4 space-y-1 pb-3 border-b border-zinc-800">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layout className="text-indigo-400" size={18} /> 
                      1. 기초 정보 (Foundation)
                    </h3>
                    <p className="text-sm text-zinc-400">명확한 기획을 위해 필수적인 기초 정보를 입력해주세요.</p>
                  </div>
                  
                  {basicFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={field.id} className="flex items-center gap-2 text-sm font-bold text-zinc-200 w-full justify-between">
                        <span className="flex items-center gap-1">
                          {field.icon}
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 font-black text-sm ml-0.5" title="필수 구성 항목">*</span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          {['websiteType', 'coreValue', 'businessModel', 'references'].includes(field.id) && (
                            <button
                              type="button"
                              onClick={() => handleRecommendField(field.id)}
                              disabled={recommendingField !== null || !formData.projectName || !formData.purpose || !formData.developerName}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                recommendingField === field.id
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40'
                              }`}
                              title={(!formData.projectName || !formData.purpose || !formData.developerName) ? "프로젝트 이름, 개발자명 및 웹사이트 목적을 입력해야 작동합니다." : "이 항목을 인공지능으로 자동 추천 받습니다."}
                            >
                              {recommendingField === field.id ? (
                                <>
                                  <Loader2 className="animate-spin text-white" size={10} />
                                  <span>추천 중...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles size={10} className="text-indigo-400" />
                                  <span>AI 추천받기</span>
                                </>
                              )}
                            </button>
                          )}
                          {!field.required && (
                            <span className="text-zinc-500 font-semibold text-[11px] ml-auto">(선택)</span>
                          )}
                        </div>
                      </label>
                      {field.type === 'select' ? (
                        <select
                          id={field.id}
                          name={field.id}
                          value={formData[field.id as keyof typeof formData] as string}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                        >
                          {field.options?.map((option) => (
                            <option key={option} value={option} className="bg-zinc-900 text-white">
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'radio' ? (
                        <div className="flex gap-4">
                          {field.options?.map((option) => {
                            const isSelected = formData[field.id as keyof typeof formData] === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, [field.id]: option }))}
                                className={`flex-1 py-3 px-4 rounded-xl text-center font-bold text-sm transition-all border flex items-center justify-center gap-2 ${
                                  isSelected
                                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-extrabold shadow-lg shadow-indigo-500/5'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-500/20' : 'border-zinc-700'}`}>
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                                </span>
                                {option === 'O' ? '필요함 (O)' : '필요없음 (X)'}
                              </button>
                            );
                          })}
                        </div>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={field.id}
                          name={field.id}
                          value={formData[field.id as keyof typeof formData] as string}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium resize-y min-h-[100px]"
                        />
                      ) : (
                        <input
                          type="text"
                          id={field.id}
                          name={field.id}
                          value={formData[field.id as keyof typeof formData] as string}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                        />
                      )}
                    </div>
                  ))}

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAutoPlan}
                      disabled={isPlanning || !formData.projectName || !formData.purpose || !formData.developerName}
                      className="w-full py-4 px-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/5 group"
                    >
                      {isPlanning ? (
                        <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={18} className="group-hover:animate-pulse" />
                      )}
                      기초 정보를 바탕으로 AI 상세 기획 자동 완성하기
                    </motion.button>
                  </div>
                </div>

                {/* 상세 기획 안내 섹션 */}
                <div className="space-y-5">
                  <div className="mb-4 space-y-1 pb-3 border-b border-zinc-800">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="text-indigo-400" size={18} /> 
                      2. 상세 기획 (AI Optimized)
                    </h3>
                    <p className="text-sm text-zinc-400">AI가 자동으로 채워주거나 직접 구성하는 상세 페이지입니다. (선택사항)</p>
                  </div>

                  {/* 세련된 Tab 디자인 */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 border border-zinc-900 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveDetailTab('branding')}
                      className={`py-2.5 px-1 text-center font-bold text-[11px] sm:text-xs rounded-lg transition-all ${
                        activeDetailTab === 'branding'
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-600/5'
                          : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                      }`}
                    >
                      브랜딩 & 콘텐츠
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDetailTab('design')}
                      className={`py-2.5 px-1 text-center font-bold text-[11px] sm:text-xs rounded-lg transition-all ${
                        activeDetailTab === 'design'
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-600/5'
                          : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                      }`}
                    >
                      비주얼 & 디자인
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDetailTab('engineering')}
                      className={`py-2.5 px-1 text-center font-bold text-[11px] sm:text-xs rounded-lg transition-all ${
                        activeDetailTab === 'engineering'
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-600/5'
                          : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                      }`}
                    >
                      인터랙션 & 개발
                    </button>
                  </div>

                  {/* 탭별 컨텐츠 필드 뷰포트 */}
                  <div className="space-y-5">
                    {detailFields
                      .filter((field) => field.group === activeDetailTab)
                      .map((field) => {
                        const currentValue = (formData[field.id as keyof typeof formData] as string) || '';
                        return (
                          <div 
                            key={field.id} 
                            className="space-y-2 p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700/60 transition-all shadow-inner group"
                          >
                            <label htmlFor={field.id} className="flex items-center gap-2 text-xs font-bold text-zinc-300 w-full uppercase tracking-wider">
                              <span className="flex items-center gap-2 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                                {field.icon}
                                {field.label}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-semibold ml-auto">(선택)</span>
                            </label>
                            
                            <input
                              type="text"
                              id={field.id}
                              name={field.id}
                              value={currentValue}
                              onChange={handleInputChange}
                              placeholder={field.placeholder}
                              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium"
                            />

                            {/* Preset Chips */}
                            {field.presets && (
                              <div className="pt-2">
                                <span className="text-[9px] text-zinc-500 font-bold block mb-1.5 uppercase tracking-widest">실시간 추천 에셋</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {field.presets.map((preset) => {
                                    const isSelected = currentValue === preset;
                                    return (
                                      <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, [field.id]: preset }))}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                          isSelected
                                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500 font-extrabold shadow-sm shadow-indigo-500/10'
                                            : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                        }`}
                                      >
                                        {preset}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="additional" className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                      <PlusCircle size={18} className="text-indigo-400" />
                      추가 요구사항
                    </label>
                    <textarea
                      id="additional"
                      name="additional"
                      value={formData.additional}
                      onChange={handleInputChange}
                      placeholder="기타 특별히 원하는 기능이나 참고할 만한 사이트 URL 등을 자유롭게 적어주세요."
                      rows={4}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium resize-none"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                      <Palette size={18} className="text-indigo-400" />
                      참고 이미지 첨부 (PNG, JPG)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 group">
                          <img 
                            src={`data:${img.mimeType};base64,${img.data}`} 
                            alt={`Reference ${idx}`} 
                            className="w-full h-full object-cover"
                          />
                          <button 
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-500/5 group">
                        <PlusCircle size={24} className="text-zinc-600 group-hover:text-indigo-400 mb-2" />
                        <span className="text-[10px] text-zinc-500 group-hover:text-indigo-300 font-bold uppercase tracking-widest">이미지 추가</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/png, image/jpeg" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-zinc-500">※ 첨부된 이미지는 AI가 디자인 스타일 및 레이아웃 분석용으로 참고합니다.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={generatePrompt}
                disabled={isGenerating}
                className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    프롬프트 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:animate-pulse" />
                    Build 프롬프트 생성하기
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Output Display */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl h-full min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-1">
                    <Code className="text-purple-400" />
                    생성된 프롬프트
                  </h2>
                  <p className="text-zinc-300 text-sm font-medium">이 프롬프트를 구글 AI 스튜디오 Build에 붙여넣으세요.</p>
                </div>
                
                {generatedPrompt && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors text-sm font-medium border border-zinc-700"
                  >
                    <Copy size={16} />
                    <span className="hidden sm:inline">복사하기</span>
                  </button>
                )}
              </div>

              <div className="flex-grow bg-zinc-950 border border-zinc-800 rounded-2xl p-6 overflow-auto relative group shadow-inner">
                {generatedPrompt ? (
                  <>
                    <div className="prose prose-invert prose-indigo max-w-none prose-sm sm:prose-base prose-p:text-zinc-200 prose-headings:text-white prose-strong:text-indigo-300 prose-li:text-zinc-200">
                      <ReactMarkdown>{generatedPrompt}</ReactMarkdown>
                    </div>
                    
                    {usage && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 pt-6 border-t border-zinc-800"
                      >
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertCircle size={14} />
                          이번 생성 비용 상세
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                            <p className="text-[10px] text-zinc-500 mb-1">입력 토큰</p>
                            <p className="text-sm font-mono text-zinc-300">{usage.promptTokens.toLocaleString()} tokens</p>
                          </div>
                          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                            <p className="text-[10px] text-zinc-500 mb-1">출력 토큰</p>
                            <p className="text-sm font-mono text-zinc-300">{usage.candidatesTokens.toLocaleString()} tokens</p>
                          </div>
                          <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 col-span-2 sm:col-span-1">
                            <p className="text-[10px] text-indigo-400 mb-1 font-bold">합계 비용 (예상)</p>
                            <p className="text-sm font-mono text-indigo-300 font-bold">
                              약 {((usage.promptTokens * 0.000101) + (usage.candidatesTokens * 0.000405)).toFixed(3)}원
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                    <Sparkles size={48} className="mb-4 opacity-20" />
                    <p>좌측에서 요구사항을 입력하고 생성 버튼을 누르면</p>
                    <p>여기에 완벽한 프롬프트가 나타납니다.</p>
                  </div>
                )}
              </div>

              {/* 구글 AI 스튜디오 Build 바로가기 버튼 */}
              <div className="mt-5">
                <a
                  href="https://aistudio.google.com/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] group/btn border border-indigo-400/30"
                >
                  <Sparkles size={16} className="text-white shrink-0 animate-pulse" />
                  <span>구글 AI 스튜디오 Build 바로가기</span>
                  <ExternalLink size={15} className="text-indigo-200 shrink-0 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Buttons Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open('https://hyeoksinai.com', '_blank')}
          className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-xl shadow-indigo-500/30 border border-indigo-400/40 transition-all font-bold text-sm"
        >
          <Sparkles size={18} />
          혁신AI 플랫폼 바로가기
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInquiryModal(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full shadow-xl border border-zinc-600 transition-all font-bold text-sm"
        >
          <AlertCircle size={18} />
          오류 및 유지보수 문의
        </motion.button>
      </div>

      {/* How to Use Modal */}
      <AnimatePresence>
        {showPatchNotesModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings size={20} className="text-zinc-400" />
                  혁신 AI 패치노트
                </h3>
                <button onClick={() => setShowPatchNotesModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {patchNotes.map((note) => (
                  <div key={note.version} className="border-b border-zinc-800 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-indigo-400 font-black text-lg">{note.version}</span>
                        <h4 className="text-white font-bold">{note.title}</h4>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono italic">{note.date}</span>
                    </div>
                    <ul className="space-y-2">
                      {note.changes.map((change, idx) => (
                        <li key={idx} className="text-sm text-zinc-400 flex items-start gap-2">
                          <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setShowPatchNotesModal(false)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* How to Use Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600/10 rounded-xl text-indigo-400">
                    <Sparkles size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      혁신 AI 가이드 & 추천 프로젝트
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">왕초보도 10분 만에 전문가 수준의 앱을 빌드하는 꿀팁 장착</p>
                  </div>
                </div>
                <button onClick={() => setShowGuideModal(false)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-zinc-800 mb-6 gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setGuideTab('beginners')}
                  className={`pb-3 px-4 text-sm font-bold transition-all relative ${
                    guideTab === 'beginners' 
                      ? 'text-white' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  ⭐ 왕초보 필독 가이드 (3분 마스터)
                  {guideTab === 'beginners' && (
                    <motion.div layoutId="guideActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideTab('examples')}
                  className={`pb-3 px-4 text-sm font-bold transition-all relative ${
                    guideTab === 'examples' 
                      ? 'text-white' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  🔥 추천 기획 예시 (원클릭 자동 채우기)
                  {guideTab === 'examples' && (
                    <motion.div layoutId="guideActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
              </div>
              
              <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {guideTab === 'beginners' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">1</div>
                        <h4 className="text-white font-bold mb-2 text-sm flex items-center gap-1.5">
                          <Key size={14} className="text-indigo-400" />
                          Gemini API Key 입력 (로컬 자동 저장)
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          우측 상단의 <strong>'API Key 필요'</strong>를 클릭해 키를 입력해 주세요. 입력한 키는 <strong>본인 PC 브라우저에만 영구 저장</strong>되며, 다른 사람과 절대 공유되지 않아 안심하고 안전하게 영구 사용이 가능합니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">2</div>
                        <h4 className="text-white font-bold mb-2 text-sm flex items-center gap-1.5">
                          <FileText size={14} className="text-indigo-400" />
                          기초 아이디어 2가지만 적기
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          만들고자 하는 앱의 <strong>'프로젝트 이름'</strong>과 <strong>'웹사이트 목적'</strong>을 한글로 자유롭고 심플하게 기입하세요. (예: '나만의 디저트 홈가드닝 샵', '꽃 배달 및 식물 가이드 제공 사이트')
                        </p>
                      </div>
                      
                      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">3</div>
                        <h4 className="text-white font-bold mb-2 text-sm flex items-center gap-1.5">
                          <Sparkles size={14} className="text-indigo-400" />
                          원터치 AI 자동 기획 실행
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          복잡한 설정을 혼자서 고민할 필요가 전혀 없습니다! 필수 정보를 채운 후 <strong>[원터치 AI 자동 기획]</strong>을 한 번만 클릭하면, AI가 타겟 고객, 컬러 테마, 핵심 기능 명세까지 최고의 맞춤형 비즈니스 상세 기획안을 단 3초 만에 설계해 드립니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">4</div>
                        <h4 className="text-white font-bold mb-2 text-sm flex items-center gap-1.5">
                          <Zap size={14} className="text-indigo-400" />
                          프롬프트 복사 & 1초 빌드하기
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          기획이 완료되면 하단의 <strong>[Build 프롬프트 생성하기]</strong> 버튼을 꾹 누르세요. 생성된 복제 결과 본문을 클립보드에 복사하고, <strong>[구글 AI 스튜디오 Build 바로가기]</strong>를 통해 이동한 뒤 입력창에 고스란히 붙여넣으면 고성능 맞춤형 홈페이지가 리액트 전용으로 완벽 빌드됩니다!
                        </p>
                      </div>
                    </div>

                    <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-3">
                      <h4 className="text-white font-bold text-sm flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-400" />
                        💡 구글 AI 스튜디오 Build 활용 3대 꿀팁
                      </h4>
                      <ul className="space-y-2.5 text-xs text-zinc-300 list-disc pl-5 leading-relaxed">
                        <li>
                          <strong>오류 및 수정도 한글로 간편하게:</strong> 빌드된 홈페이지에 추가하고 싶은 기능이 생겼을 때, "우측 상단에 로그아웃 버튼 하나 추가해줘", "메인 테마 컬러를 청록색으로 바꿔줘"처럼 편하게 한글 채팅으로 지시하면 알아서 코드를 전면 복원 보정해 줍니다.
                        </li>
                        <li>
                          <strong>프로젝트명 로고 규칙 유지:</strong> AI 스튜디오 Build는 한글 브랜드명을 로고 영역에 완벽 표기합니다. 본 플랫폼은 사용자가 설정한 '프로젝트 이름'을 로고 위치에 정밀 매칭하도록 프롬프트를 제어하므로 브랜드의 통일성을 지켜줍니다.
                        </li>
                        <li>
                          <strong>이미지 프롬프트 활용하기:</strong> 만약 참고하고 싶은 손그림 기획 도안이나 영감을 주는 레이아웃 화면 캡쳐본이 있다면, 하단의 <strong>이미지 첨부란</strong>에 업로드해 보세요! AI가 이를 선제 분석하여 디자인 실사 형태를 프롬프트에 입체적으로 추가 탑재합니다.
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl mb-4 flex items-start gap-3">
                      <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        아래의 10종 실전 사용 예시는 다양한 홈페이지 종류에 최적화된 모범 기획 포맷입니다. 기획해보고 싶은 주제의 카드를 골라 <strong className="text-white">[이 예시 양식 자동 로드]</strong>를 눌러보세요. 모든 입력 필드가 최적의 기획안으로 1초 만에 자동 완성됩니다!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PRESET_EXAMPLES.map((example) => (
                        <div 
                          key={example.id} 
                          className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1 mb-2">
                              <h4 className="text-white font-bold text-base group-hover:text-indigo-300 transition-colors">
                                {example.title}
                              </h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 shrink-0 font-mono">
                                Type: {example.websiteType === 'CRM(고객 관계 관리)' ? 'CRM' : example.websiteType.split(' ')[0]}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 font-semibold mb-3">
                              {example.description}
                            </p>
                            <div className="space-y-2 text-[11px] text-zinc-400 border-t border-zinc-900 pt-3 mb-5">
                              <div>
                                <span className="text-zinc-500 font-bold block mb-0.5">📌 기획 목적</span>
                                <p className="leading-relaxed line-clamp-2 text-zinc-300">{example.purpose}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <div>
                                  <span className="text-zinc-500 font-bold block mb-0.5">🎨 대표 컬러</span>
                                  <span className="text-zinc-300">{example.colors.split(',')[0]} 계열</span>
                                </div>
                                <div>
                                  <span className="text-zinc-500 font-bold block mb-0.5">🔒 로그인 여부</span>
                                  <span className="text-zinc-300">{example.requiresAuth === 'O' ? '필요 (OAuth/Email)' : '불필요 (오프라인)'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleApplyExample(example)}
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Sparkles size={12} />
                            <span>이 예시 양식 자동 로드하기</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3 shrink-0 border-t border-zinc-800 pt-5">
                <button 
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  가이드 닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* API Cost Modal */}
      <AnimatePresence>
        {showCostModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-400" />
                  Gemini API 비용 안내 (예상)
                </h3>
                <button onClick={() => setShowCostModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <p className="text-sm text-indigo-300 leading-relaxed">
                    본 앱은 <strong>Gemini 3 Flash Preview</strong> 모델을 사용합니다. 아래 비용은 Google Cloud 공식 단가를 기준으로 1,350원의 환율을 적용한 예상 금액입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                    <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                      <Sparkles size={16} />
                      Gemini 3 Flash Preview
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400">입력 (100만 토큰당)</span>
                        <span className="text-white font-mono">약 101원 ($0.075)</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400">출력 (100만 토큰당)</span>
                        <span className="text-white font-mono">약 405원 ($0.30)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                  <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                    <Code size={16} />
                    생성 프롬프트별 예상 비용 예시
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/50">
                        <p className="text-[11px] text-zinc-500 mb-1">단순 홍보용 (약 1,500토큰)</p>
                        <p className="text-sm text-white font-mono">약 0.9원</p>
                      </div>
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/50">
                        <p className="text-[11px] text-zinc-500 mb-1">비즈니스 플랫폼 (약 3,000토큰)</p>
                        <p className="text-sm text-white font-mono">약 1.8원</p>
                      </div>
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/50">
                        <p className="text-[11px] text-zinc-500 mb-1">복잡한 SaaS 앱 (약 5,000토큰)</p>
                        <p className="text-sm text-white font-mono">약 3.0원</p>
                      </div>
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/50">
                        <p className="text-[11px] text-zinc-500 mb-1">기획 정보가 많은 경우 (약 8,000토큰)</p>
                        <p className="text-sm text-white font-mono">약 4.8원</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 italic">
                      ※ 위 예시는 평균적인 프롬프트 길이를 기준으로 하며, 이미지 분석 사용 시 토큰 소모가 증가할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700">
                  <h4 className="text-white font-bold mb-3 text-sm">💡 비용 절약 팁</h4>
                  <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4">
                    <li>요구사항을 명확하고 간결하게 입력하면 입력 토큰을 줄일 수 있습니다.</li>
                    <li>불필요하게 긴 추가 요구사항은 비용 상승의 원인이 됩니다.</li>
                    <li>Google AI Studio의 무료 티어(Pay-as-you-go 이전)를 활용하면 일일 한도 내에서 무료로 사용 가능합니다.</li>
                  </ul>
                </div>

                <p className="text-[11px] text-zinc-500 italic text-center">
                  ※ 실제 청구 금액은 환율 변동 및 Google의 정책 변경에 따라 달라질 수 있습니다.
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setShowCostModal(false)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertCircle size={20} className="text-indigo-400" />
                  오류 및 유지보수 문의
                </h3>
                <button onClick={() => setShowInquiryModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  오류 및 유지보수 요청사항이 있으실 경우 아래 메일로 어떤 부분의 오류 개선 또는 유지보수를 요청하시는지 상세하게 기입하여 보내주시면, 정혁신이 실시간으로 확인하여 답변 드리겠습니다.
                </p>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between group">
                  <span className="text-indigo-400 font-mono font-bold">info@nextin.ai.kr</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('info@nextin.ai.kr');
                      alert('이메일 주소가 복사되었습니다.');
                    }}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-zinc-300"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setShowInquiryModal(false)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
