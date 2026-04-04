/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, CheckCircle, AlertCircle, Sparkles, Copy, ArrowRight, Code, Layout, Palette, Users, FileText, Settings, X, PlusCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [apiKey, setApiKey] = useState(process.env.GEMINI_API_KEY || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const [formData, setFormData] = useState({
    projectName: '',
    purpose: '',
    targetAudience: '',
    features: '',
    style: '',
    pages: '',
    colors: '',
    additional: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [usage, setUsage] = useState<{ promptTokens: number; candidatesTokens: number } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveApiKey = () => {
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
        다음 정보를 바탕으로 홈페이지 기획안을 완성해주세요.
        - 프로젝트 이름: ${formData.projectName}
        - 웹사이트 목적: ${formData.purpose}

        다음 항목들에 대해 가장 적절하고 매력적인 내용을 제안해주세요:
        1. 타겟 고객
        2. 주요 기능 (3~5개)
        3. 디자인 스타일/분위기
        4. 필요한 페이지 구성
        5. 메인 색상 (배경색과 포인트 컬러 포함)

        응답은 반드시 다음 JSON 형식으로만 출력하세요:
        {
          "targetAudience": "내용",
          "features": "내용",
          "style": "내용",
          "pages": "내용",
          "colors": "내용"
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
      
      const prompt = `
당신은 구글 AI 스튜디오 Build(Vibe Coding)를 위한 완벽한 '고해상도' 프롬프트를 작성하는 수석 프롬프트 엔지니어입니다.
사용자가 제공한 요구사항을 바탕으로, **P.A.S.T. 공식**을 적용하여 AI가 즉시 상용 수준의 웹사이트를 제작할 수 있도록 정교한 프롬프트를 작성해주세요.

[사용자 요구사항]
- 프로젝트 이름: ${formData.projectName || '미정'}
- 웹사이트 목적: ${formData.purpose || '미정'}
- 타겟 고객: ${formData.targetAudience || '미정'}
- 주요 기능: ${formData.features || '미정'}
- 선호하는 디자인 스타일/분위기: ${formData.style || '미정'}
- 필요한 페이지 구성: ${formData.pages || '미정'}
- 메인 색상: ${formData.colors || '미정'}
- 추가 요구사항: ${formData.additional || '없음'}

[프롬프트 생성 지침: P.A.S.T. 공식 적용]
다음 4가지 단계를 포함하여 프롬프트를 구성하세요:

① **Persona (역할 정의)**: 프로젝트 성격에 맞는 구체적인 페르소나를 부여하세요. (예: "너는 세련된 타이포그래피를 중시하는 시니어 UI 개발자야")
② **Action (핵심 기능 및 유저 스토리)**: 앱의 존재 이유와 사용자가 겪을 여정을 명확히 하세요. 입력, 처리, 출력 과정을 상세히 묘사하세요.
③ **Style & Stack (스타일과 기술 스택)**: Tailwind CSS, Lucide-react 등을 명시하고, 시각적 가이드라인(테마, 반응형, 애니메이션)을 구체적으로 제시하세요.
④ **Target/Detail (제약 조건 및 상세 요구사항)**: LocalStorage 사용 여부, 에러 처리, 애니메이션 디테일 등 AI가 놓치기 쉬운 기술적 세부사항을 명시하세요.

[출력 규칙]
1. "이 프롬프트를 복사하여..." 같은 안내 문구 없이, 오직 생성된 **프롬프트 본문**만 출력하세요.
2. 마크다운 형식을 사용하여 구조화하세요.
3. 한국어를 기본으로 하되, 기술 용어는 영어를 혼용하여 정확도를 높이세요.
4. 결과물이 '매력적인 홈페이지'가 될 수 있도록 트렌디한 디자인 요소를 적극 제안하세요.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
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

  const inputFields = [
    { id: 'projectName', label: '프로젝트 이름', icon: <FileText size={18} className="text-indigo-400" />, placeholder: '예: 혁신적인 AI 포트폴리오 사이트' },
    { id: 'purpose', label: '웹사이트 목적', icon: <Layout size={18} className="text-indigo-400" />, placeholder: '예: 개인 포트폴리오 전시 및 프리랜서 문의 접수' },
    { id: 'targetAudience', label: '타겟 고객', icon: <Users size={18} className="text-indigo-400" />, placeholder: '예: IT 기업 채용 담당자, 스타트업 대표' },
    { id: 'features', label: '주요 기능', icon: <Code size={18} className="text-indigo-400" />, placeholder: '예: 다크모드, 프로젝트 갤러리 필터링, 문의 폼' },
    { id: 'style', label: '디자인 스타일/분위기', icon: <Palette size={18} className="text-indigo-400" />, placeholder: '예: 미니멀하고 미래지향적인 다크 테마' },
    { id: 'pages', label: '필요한 페이지', icon: <Layout size={18} className="text-indigo-400" />, placeholder: '예: 홈, 소개, 프로젝트, 이력서, 연락처' },
    { id: 'colors', label: '메인 색상', icon: <Palette size={18} className="text-indigo-400" />, placeholder: '예: 배경은 진한 회색, 포인트 컬러는 네온 퍼플' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 pb-20">
      {/* API Key Status Button */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
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
                웹 배포 환경에서 프롬프트를 생성하려면 Gemini API Key가 필요합니다. 입력하신 키는 브라우저 메모리에만 임시 저장되며 서버로 전송되지 않습니다.
              </p>
              <div className="space-y-2 mb-6">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Gemini API Key</label>
                <input 
                  type="password"
                  placeholder="AIzaSy..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
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
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3" 
              alt="Web Development Background"
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-purple-900/40 to-zinc-950/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6 inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <Sparkles className="text-indigo-400 w-10 h-10 animate-pulse" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            >
              혁신 홈페이지 개발 AI
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-zinc-300 font-medium max-w-2xl mx-auto leading-tight opacity-90"
            >
              복잡한 기획부터 고해상도 프롬프트 생성까지<br className="hidden sm:block"/> 단 한 번의 터치로 완성하세요
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-sm text-zinc-300 flex items-center gap-3 shadow-2xl"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
              <span className="font-bold tracking-widest uppercase text-[10px]">Developer : 정혁신</span>
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

            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                  <Layout className="text-indigo-400" />
                  요구사항 입력
                </h2>
                <p className="text-zinc-400 text-sm">최대한 자세히 입력할수록 더 매력적인 홈페이지 프롬프트가 생성됩니다.</p>
              </div>

              <div className="space-y-5">
                {inputFields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <div className="space-y-2">
                      <label htmlFor={field.id} className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        {field.icon}
                        {field.label}
                      </label>
                      <input
                        type="text"
                        id={field.id}
                        name={field.id}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                      />
                    </div>
                    {index === 1 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAutoPlan}
                        disabled={isPlanning || !formData.projectName || !formData.purpose}
                        className="w-full py-3 px-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPlanning ? (
                          <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                        ) : (
                          <Sparkles size={14} />
                        )}
                        원터치 AI 자동 기획 (나머지 항목 채우기)
                      </motion.button>
                    )}
                  </React.Fragment>
                ))}

                <div className="space-y-2">
                  <label htmlFor="additional" className="flex items-center gap-2 text-sm font-medium text-zinc-300">
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
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
                  />
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
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl h-full min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-1">
                    <Code className="text-purple-400" />
                    생성된 프롬프트
                  </h2>
                  <p className="text-zinc-400 text-sm">이 프롬프트를 구글 AI 스튜디오 Build에 붙여넣으세요.</p>
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

              <div className="flex-grow bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 overflow-auto relative group">
                {generatedPrompt ? (
                  <>
                    <div className="prose prose-invert prose-indigo max-w-none prose-sm sm:prose-base">
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
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/20 border border-indigo-400/30 transition-all font-medium text-sm"
        >
          <Sparkles size={16} />
          혁신AI 플랫폼 바로가기
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInquiryModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full shadow-lg border border-zinc-700 transition-all font-medium text-sm"
        >
          <AlertCircle size={16} />
          오류 및 유지보수 문의
        </motion.button>
      </div>

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
