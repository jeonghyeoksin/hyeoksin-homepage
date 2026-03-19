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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setShowApiKeyModal(false);
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
당신은 구글 AI 스튜디오 Build(Vibe Coding)를 위한 완벽한 프롬프트를 작성하는 수석 프롬프트 엔지니어입니다.
사용자가 제공한 다음 홈페이지 개발 요구사항을 바탕으로, AI가 즉시 훌륭하고 매력적인 웹사이트를 만들어낼 수 있도록 구체적이고 전문적인 프롬프트를 작성해주세요.

[요구사항]
- 프로젝트 이름: ${formData.projectName || '미정'}
- 웹사이트 목적: ${formData.purpose || '미정'}
- 타겟 고객: ${formData.targetAudience || '미정'}
- 주요 기능: ${formData.features || '미정'}
- 선호하는 디자인 스타일/분위기: ${formData.style || '미정'}
- 필요한 페이지 구성: ${formData.pages || '미정'}
- 메인 색상: ${formData.colors || '미정'}
- 추가 요구사항: ${formData.additional || '없음'}

[프롬프트 작성 규칙]
1. AI가 이해하기 쉽도록 명확하고 구조화된 마크다운 형식으로 작성하세요.
2. UI/UX 디자인 지침(Tailwind CSS 클래스 제안, 색상 코드, 여백, 애니메이션 효과 등)을 구체적으로 포함하세요.
3. 필요한 React 컴포넌트 구조와 상태 관리(State)에 대한 아이디어를 포함하세요.
4. "이 프롬프트를 복사하여 구글 AI 스튜디오 Build에 붙여넣으세요" 같은 안내 문구는 제외하고, 오직 '프롬프트 본문'만 출력하세요.
5. 프롬프트 자체는 한국어로 작성하되, 기술적인 용어(React, Tailwind, Component, Framer Motion 등)는 영어를 혼용하여 명확히 하세요.
6. 결과물이 '매력적인 홈페이지'가 될 수 있도록, 트렌디한 웹 디자인 요소(Glassmorphism, Bento grid, Dark mode 등 요구사항에 어울리는 것)를 적극적으로 제안하는 내용을 프롬프트에 포함하세요.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      setGeneratedPrompt(response.text || '');
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
      <div className="fixed top-4 right-4 z-50">
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
          className="relative w-full aspect-video max-h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900/80 to-zinc-950"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6 inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl"
            >
              <Sparkles className="text-indigo-400 w-8 h-8" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-6 tracking-tight drop-shadow-sm"
            >
              혁신 홈페이지 개발 AI
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-zinc-300 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              당신의 아이디어를 구글 AI 스튜디오를 위한<br className="hidden sm:block"/> 완벽한 프롬프트로 변환합니다
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 px-5 py-2.5 bg-zinc-950/50 backdrop-blur-md rounded-full border border-white/10 text-sm text-zinc-300 flex items-center gap-2 shadow-inner"
            >
              <Code size={16} className="text-indigo-400" />
              <span className="font-medium tracking-wide">개발자: 정혁신</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                  <Layout className="text-indigo-400" />
                  요구사항 입력
                </h2>
                <p className="text-zinc-400 text-sm">최대한 자세히 입력할수록 더 매력적인 홈페이지 프롬프트가 생성됩니다.</p>
              </div>

              <div className="space-y-5">
                {inputFields.map((field) => (
                  <div key={field.id} className="space-y-2">
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
                  <div className="prose prose-invert prose-indigo max-w-none prose-sm sm:prose-base">
                    <ReactMarkdown>{generatedPrompt}</ReactMarkdown>
                  </div>
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
    </div>
  );
}
