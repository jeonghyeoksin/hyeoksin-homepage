/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, CheckCircle, AlertCircle, Sparkles, Copy, ArrowRight, Code, Layout, Palette, Users, FileText, Settings, X, PlusCircle, Database, Package, Zap, Languages, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || process.env.GEMINI_API_KEY || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPatchNotesModal, setShowPatchNotesModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'branding' | 'design' | 'engineering'>('branding');
  
  const [formData, setFormData] = useState({
    projectName: '',
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
    if (!formData.projectName || !formData.purpose) {
      setError('프로젝트 이름과 웹사이트 목적을 먼저 입력해주세요.');
      return;
    }

    setIsPlanning(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = `
        다음 기초 정보를 바탕으로 웹사이트 기획안을 완성해주세요.
        - 프로젝트 이름: ${formData.projectName}
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
        model: 'gemini-3-flash-preview',
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

  const generatePrompt = async () => {
    if (!apiKey) {
      setError('API Key가 필요합니다. 우측 상단에서 API Key를 입력해주세요.');
      setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const promptText = `
당신은 구글 AI 스튜디오 Build(Vibe Coding)를 위한 완벽한 '고해상도' 프롬프트를 작성하는 수석 프롬프트 엔지니어입니다.
사용자가 제공한 요구사항${formData.images.length > 0 ? '과 첨부된 이미지' : ''}를 바탕으로, **P.A.S.T. 공식**을 적용하여 AI가 즉시 상용 수준의 웹사이트를 제작할 수 있도록 정교한 프롬프트를 작성해주세요.

[사용자 요구사항]
- 프로젝트 이름: ${formData.projectName || '미정'}
- 홈페이지 종류: ${formData.websiteType || '랜딩페이지(1 Page)'}
- 디자인 언어: ${formData.designLanguage || '한국어'}
- 로그인/회원가입 기능 추가 유무: ${formData.requiresAuth === 'O' ? '필요함 (O)' : '필요하지 않음 (X)'}
- 웹사이트 목적: ${formData.purpose || '미정'}
- 핵심 가치/차별점: ${formData.coreValue || '미정'}
- 서비스 형태: ${formData.businessModel || '미정'}
- 참고 사이트: ${formData.references || '미정'}
- 타겟 고객: ${formData.targetAudience || '미정'}
- 브랜드 보이스: ${formData.brandVoice || '미정'}
- 주요 기능: ${formData.features || '미정'}
- 핵심 CTA: ${formData.cta || '미정'}
- 선호하는 디자인 스타일/분위기: ${formData.style || '미정'}
- 필요한 페이지 구성: ${formData.pages || '미정'}
- 메인 색상: ${formData.colors || '미정'}
- 주요 시각적 요소: ${formData.keyAssets || '미정'}
- 애니메이션/상호작용: ${formData.animations || '미정'}
- 데이터 관리 방식: ${formData.dataPersistence || '미정'}
- 필요한 외부 라이브러리: ${formData.libraries || '미정'}
- 추가 요구사항: ${formData.additional || '없음'}
${formData.images.length > 0 ? '\n[시각적 참고 자료]\n사용자가 이미지를 첨부했습니다. 이미지의 레이아웃, 색감, 폰트 스타일, 컴포넌트 구성 등을 분석하여 프롬프트에 반영하세요.' : ''}

[프롬프트 생성 지침: P.A.S.T. 공식 적용]
다음 4가지 단계를 포함하여 프롬프트를 구성하세요:

① **Persona (역할 정의)**: 프로젝트 성격에 맞는 구체적인 페르소나를 부여하세요. (예: "너는 세련된 타이포그래피를 중시하는 시니어 UI 개발자야")
② **Action (핵심 기능 및 유저 스토리)**: 앱의 존재 이유와 사용자가 겪을 여정을 명확히 하세요. 입력, 처리, 출력 과정을 상세히 묘사하세요.
③ **Style & Stack (스타일과 기술 스택)**: Tailwind CSS, Lucide-react 등을 명시하고, 시각적 가이드라인(테마, 반응형, 애니메이션)을 구체적으로 제시하세요. ${formData.images.length > 0 ? '첨부된 이미지의 스타일을 적극적으로 참고하여 묘사하세요.' : ''}
④ **Target/Detail (제약 조건 및 상세 요구사항)**: LocalStorage 사용 여부, 에러 처리, 애니메이션 디테일 등 AI가 놓치기 쉬운 기술적 세부사항을 명시하세요.

[출력 규칙]
1. "이 프롬프트를 복사하여..." 같은 안내 문구 없이, 오직 생성된 **프롬프트 본문**만 출력하세요.
2. 마크다운 형식을 사용하여 구조화하세요.
3. 결과물(웹사이트 전체 레이아웃, 텍스트 콘텐츠, 유저 인터페이스 등)은 반드시 사용자가 선택한 디자인 언어(${formData.designLanguage})로 구현될 수 있도록 정교하게 설계하여 작성하세요. 기술 용어나 설명은 상황공유를 위해 영어를 보조적으로 사용해도 좋습니다.
4. 결과물이 '매력적인 홈페이지'가 될 수 있도록 트렌디한 디자인 요소를 적극 제안하세요.
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
        model: 'gemini-3-flash-preview',
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
    { id: 'websiteType', label: '홈페이지 종류', icon: <Layout size={18} className="text-indigo-400" />, type: 'select', options: ['랜딩페이지(1 Page)', '기업 및 서비스 다중 페이지', '포트폴리오 사이트', '블로그 / 컨텐츠 미디어', 'B2B/B2C SaaS 플랫폼', '쇼핑몰 / 이커머스', '생산성 앱 / 툴', '마케팅 플랫폼', '강의 플랫폼', '포털 / 커뮤니티 및 기타'], required: true },
    { id: 'requiresAuth', label: '로그인/회원가입 기능 추가 유무', icon: <Key size={18} className="text-indigo-400" />, type: 'radio', options: ['O', 'X'], required: true },
    { id: 'designLanguage', label: '디자인 언어', icon: <Languages size={18} className="text-indigo-400" />, type: 'select', options: ['한국어', '영어', '일본어', '중국어', '스페인어', '프랑스어', '독일어', '기타'], required: true },
    { id: 'purpose', label: '웹사이트 목적', icon: <Layout size={18} className="text-indigo-400" />, placeholder: '예: 개인 포트폴리오 전시 및 프리랜서 문의 접수', required: true },
    { id: 'coreValue', label: '핵심 가치 및 차별점', icon: <Sparkles size={18} className="text-indigo-400" />, placeholder: '예: 10배 빠른 처리, 혁신적인 UI/UX' },
    { id: 'businessModel', label: '서비스 형태 / 수익 모델', icon: <Users size={18} className="text-indigo-400" />, placeholder: '예: B2B SaaS 구독형, 무료 커뮤니티' },
    { id: 'references', label: '참고 사이트 / 벤치마킹', icon: <ArrowRight size={18} className="text-indigo-400" />, placeholder: '예: Apple처럼 깔끔한 레이아웃' },
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
                      <label htmlFor={field.id} className="flex items-center gap-2 text-sm font-bold text-zinc-200 w-full">
                        <span className="flex items-center gap-2">
                          {field.icon}
                          {field.label}
                        </span>
                        {field.required ? (
                          <span className="text-red-500 font-black text-sm ml-0.5" title="필수 구성 항목">*</span>
                        ) : (
                          <span className="text-zinc-500 font-semibold text-[11px] ml-auto">(선택)</span>
                        )}
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
                      disabled={isPlanning || !formData.projectName || !formData.purpose}
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
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText size={20} className="text-blue-400" />
                  혁신 홈페이지 개발 AI 사용방법
                </h3>
                <button onClick={() => setShowGuideModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mb-3">1</div>
                    <h4 className="text-white font-bold mb-2 text-sm">API Key 입력</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      우측 상단의 <strong>'API Key 필요'</strong> 버튼을 눌러 본인의 Gemini API Key를 입력하세요. 키는 브라우저에만 저장됩니다.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mb-3">2</div>
                    <h4 className="text-white font-bold mb-2 text-sm">기본 정보 입력</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      만들고 싶은 홈페이지의 <strong>이름</strong>과 <strong>목적</strong>을 간단히 입력하세요. (예: 카페 홍보 사이트)
                    </p>
                  </div>
                  
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mb-3">3</div>
                    <h4 className="text-white font-bold mb-2 text-sm">원터치 AI 자동 기획</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong>[원터치 AI 자동 기획]</strong> 버튼을 누르면 AI가 타겟 고객, 기능, 디자인 스타일 등을 자동으로 채워줍니다.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mb-3">4</div>
                    <h4 className="text-white font-bold mb-2 text-sm">프롬프트 생성 및 복사</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      하단의 <strong>[Build 프롬프트 생성하기]</strong>를 누른 후, 생성된 결과를 복사하여 구글 AI 스튜디오 Build에 붙여넣으세요.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <h4 className="text-blue-400 font-bold mb-2 text-xs flex items-center gap-2">
                    <Sparkles size={14} />
                    꿀팁: 구글 AI 스튜디오 Build란?
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    구글의 최신 AI 기술을 사용하여 자연어 프롬프트만으로 실제 작동하는 웹사이트를 즉석에서 만들어주는 도구입니다. 본 앱은 그 도구에 최적화된 '고해상도 프롬프트'를 만들어 드립니다.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setShowGuideModal(false)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  확인했습니다
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
