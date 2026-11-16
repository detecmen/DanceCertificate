/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useEffect, useRef, useState} from 'react';
import {Check, ChevronLeft, ChevronRight, Copy, Maximize2, Printer, RotateCcw, Upload, X} from 'lucide-react';

interface CertificateRecord {
  name: string;
  gender: string;
  birthDate: string;
  nationality: string;
  ethnicity: string;
  major: string;
  grade: string;
  gradeRange: string;
  issueDate: string;
  certificateNumber: string;
}

const CERTIFICATE_DATA: CertificateRecord = {
  name: '何耀辉',
  gender: '男',
  birthDate: '1991-12-04',
  nationality: '越南',
  ethnicity: '汉族',
  major: '中国舞',
  grade: '6级',
  gradeRange: '1级-10级',
  issueDate: '2024-06-23',
  certificateNumber: '010121321916265681',
};

const CERTIFICATE_TABS = [
  {
    id: 'inner',
    title: '考级证书内页',
    subtitle: '详细信息页',
    imageSrc: '/assets/aistudio/image_aae93510.png',
    imageAlt: '社会艺术水平考级证书内页 - 何耀辉 中国舞 6级',
  },
  {
    id: 'cover',
    title: '证书封面档案',
    subtitle: '红色封面',
    imageSrc: '/assets/aistudio/image_73f5d0a0.png',
    imageAlt: '中国舞蹈考级证书红色封面',
  },
] as const;

type CertificateSlideId = (typeof CERTIFICATE_TABS)[number]['id'];

function CertificateImageFrame({
  tab,
  portraitUrl,
  interactive = false,
  compact = false,
}: {
  tab: (typeof CERTIFICATE_TABS)[number];
  portraitUrl: string | null;
  interactive?: boolean;
  compact?: boolean;
}) {
  const isInner = tab.id === 'inner';

  return (
    <div
      className={`relative w-full overflow-hidden bg-stone-100 flex items-center justify-center ${
        compact ? 'aspect-[4/3]' : ''
      }`}
    >
      <div className="relative w-full">
        <img
          src={tab.imageSrc}
          alt={tab.imageAlt}
          referrerPolicy="no-referrer"
          className="block w-full h-auto select-none"
        />

        {/* Enlarged ID photo overlay covering the printed 照片 box on image_aae93510.png (1024x765) */}
        {isInner && (
          <div
            style={{
              left: '66.8%',
              top: '10.2%',
              width: '10.5%',
              height: '20.2%',
            }}
            className={`absolute overflow-hidden ${
              portraitUrl ? 'shadow-[0_1px_3px_rgba(0,0,0,0.18)]' : ''
            }`}
          >
            {portraitUrl ? (
              <img
                src={portraitUrl}
                alt={`${CERTIFICATE_DATA.name} 证书证件照`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : null}

            {interactive && (
              <label
                htmlFor="portrait-upload"
                onClick={(e) => e.stopPropagation()}
                title={portraitUrl ? '点击更换证书照片' : '点击上传证件照填入此处'}
                className={`no-print absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${
                  portraitUrl
                    ? 'bg-black/0 hover:bg-black/35 text-transparent hover:text-white'
                    : 'bg-[#9b1c18]/0 hover:bg-[#9b1c18]/12 border border-transparent hover:border-[#9b1c18]/70 text-transparent hover:text-[#9b1c18]'
                }`}
              >
                <span className="px-1 text-center text-[10px] sm:text-xs font-medium leading-tight">
                  {portraitUrl ? '更换' : '上传'}
                </span>
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_PORTRAIT_URL = '/assets/aistudio/Gemini_Generated_Image_onis7onis7onis7o_62c02927.png';

export default function App() {
  const [activeSlide, setActiveSlide] = useState<CertificateSlideId>('inner');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState<string>(DEFAULT_PORTRAIT_URL);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (portraitUrl.startsWith('blob:')) {
        URL.revokeObjectURL(portraitUrl);
      }
    };
  }, [portraitUrl]);

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(CERTIFICATE_DATA.certificateNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be blocked in restricted contexts; ignore silently
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (portraitUrl.startsWith('blob:')) {
      URL.revokeObjectURL(portraitUrl);
    }
    const nextUrl = URL.createObjectURL(file);
    setPortraitUrl(nextUrl);
  };

  const handleResetPhoto = () => {
    if (portraitUrl.startsWith('blob:')) {
      URL.revokeObjectURL(portraitUrl);
    }
    setPortraitUrl(DEFAULT_PORTRAIT_URL);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 'inner' ? 'cover' : 'inner'));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === 'inner' ? 'cover' : 'inner'));
  };

  const infoRows: Array<{label: string; value: string; mono?: boolean; highlight?: boolean; copyable?: boolean}> = [
    {label: '姓　　名', value: CERTIFICATE_DATA.name},
    {label: '性　　别', value: CERTIFICATE_DATA.gender},
    {label: '出生日期', value: CERTIFICATE_DATA.birthDate, mono: true},
    {label: '国　　籍', value: CERTIFICATE_DATA.nationality},
    {label: '民　　族', value: CERTIFICATE_DATA.ethnicity},
    {label: '考级专业', value: CERTIFICATE_DATA.major},
    {label: '等　　级', value: CERTIFICATE_DATA.grade, highlight: true},
    {label: '起 止 级', value: CERTIFICATE_DATA.gradeRange, mono: true},
    {label: '发证日期', value: CERTIFICATE_DATA.issueDate, mono: true},
    {label: '证书编号', value: CERTIFICATE_DATA.certificateNumber, mono: true, copyable: true},
  ];

  return (
    <div className="min-h-screen bg-[#f3f1ed] py-0 sm:py-6 px-0 sm:px-4">
      <main className="mx-auto max-w-[1040px] bg-white border border-stone-200 shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
        {/* Top Silk Banner */}
        <header className="relative overflow-hidden bg-[#faf6f3] border-b border-stone-200">
          <div className="relative h-28 sm:h-40 flex items-center justify-end px-6 sm:px-10 overflow-hidden">
            {/* User-provided flowing silk banner image (top silk portion framed cleanly) */}
            <img
              src="/assets/aistudio/image_4616d6f7.png"
              alt="中国舞考级信息档案横幅背景"
              referrerPolicy="no-referrer"
              className="pointer-events-none absolute top-0 left-0 h-[124%] w-full object-cover object-right-top select-none"
            />
            {/* Soft right-side readability scrim for narrow viewports */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#fffaf7]/80 via-[#fffaf7]/30 to-transparent sm:from-[#fffaf7]/45 sm:via-transparent"
            />

            {/* Right-positioned, center-aligned Chinese title block matching screenshot */}
            <div className="relative z-10 text-center">
              <h1 className="font-editorial text-2xl sm:text-[32px] font-bold tracking-[0.06em] text-[#9b1c18]">
                中国舞蹈家协会教学网
              </h1>
              <p className="mt-0.5 text-[#9b1c18] text-sm sm:text-[17px] font-medium tracking-[0.09em] scale-x-110 scale-y-90 origin-center">
                www.danceinchina.org
              </p>
            </div>
          </div>

          {/* Crimson Navigation Bar with flowing silk highlight texture */}
          <nav
            aria-label="页面位置"
            className="relative overflow-hidden flex flex-wrap items-center justify-between gap-4 px-5 sm:px-8 py-2.5 text-[#fdf7f3] bg-[#96120b] border-t border-[#d85c37]/35"
          >
            <svg
              viewBox="0 0 960 48"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="navBase" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#99150e" />
                  <stop offset="35%" stopColor="#b92716" />
                  <stop offset="68%" stopColor="#9d160e" />
                  <stop offset="100%" stopColor="#850e08" />
                </linearGradient>
                <linearGradient id="navRibbon1" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#df622c" stopOpacity="0.48" />
                  <stop offset="50%" stopColor="#e87b38" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#b01f12" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="navRibbon2" x1="20%" y1="0%" x2="90%" y2="100%">
                  <stop offset="0%" stopColor="#f08f49" stopOpacity="0.35" />
                  <stop offset="55%" stopColor="#c73519" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#7a0d08" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="960" height="48" fill="url(#navBase)" />
              <path
                d="M0,48 C130,30 260,8 430,22 C580,35 720,6 960,18 L960,48 Z"
                fill="url(#navRibbon1)"
              />
              <path
                d="M160,0 C310,24 440,42 610,16 C730,-2 840,22 960,38 L960,0 Z"
                fill="url(#navRibbon2)"
              />
              <path
                d="M0,12 C180,44 360,4 540,30 C690,50 830,14 960,24"
                fill="none"
                stroke="#f5a562"
                strokeOpacity="0.22"
                strokeWidth="3"
              />
            </svg>

            <div className="relative z-10 font-editorial text-sm sm:text-[15px] font-medium tracking-wide whitespace-nowrap shrink-0 drop-shadow-[0_1px_1px_rgba(60,5,3,0.45)]">
              外籍考级证书信息
            </div>
            <div className="relative z-10 text-xs text-[#fdf7f3]/95 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(60,5,3,0.45)]">
              您现在的位置：个人首页 &gt; <span className="underline underline-offset-4">外籍考级证书信息</span>
            </div>
          </nav>
        </header>

        {/* Main Body */}
        <div className="px-5 sm:px-10 py-8 sm:py-10 space-y-10">
          {/* Section 1: Detailed Information */}
          <section aria-labelledby="section-details">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 id="section-details" className="text-lg sm:text-xl font-bold text-stone-900 tracking-wide">
                详细信息
              </h2>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#9b1c18] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b1c18]"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>打印信息</span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-8 items-start">
              {/* Left Key-Value Registry Rows */}
              <dl className="divide-y divide-stone-100 text-[15px]">
                {infoRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[100px_1fr] sm:grid-cols-[116px_1fr] items-center py-2.5 gap-2"
                  >
                    <dt className="text-stone-600 select-none whitespace-nowrap">
                      {row.label}：
                    </dt>
                    <dd className="flex flex-wrap items-center gap-3 text-stone-900">
                      <span
                        className={`${row.mono ? 'font-code-num tracking-tight' : ''} ${
                          row.highlight ? 'font-semibold text-[#9b1c18]' : 'font-medium'
                        }`}
                      >
                        {row.value}
                      </span>

                      {row.copyable && (
                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="no-print inline-flex items-center gap-1 text-xs text-stone-500 hover:text-[#9b1c18] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b1c18]"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[#9b1c18]" />
                              <span className="text-[#9b1c18]">已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>复制编号</span>
                            </>
                          )}
                        </button>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Right Blue ID Portrait Frame */}
              <div className="flex flex-col items-center md:items-end">
                <div className="w-[140px] border border-stone-300 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <div className="relative h-[184px] w-full overflow-hidden bg-[#4282c8]">
                    {portraitUrl ? (
                      <img
                        src={portraitUrl}
                        alt={`${CERTIFICATE_DATA.name} 证件照`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 140 184"
                        className="h-full w-full"
                        role="img"
                        aria-label={`${CERTIFICATE_DATA.name} 默认蓝色背景证件照占位图`}
                      >
                        <defs>
                          <radialGradient id="idPhotoBackdrop" cx="50%" cy="38%" r="65%">
                            <stop offset="0%" stopColor="#5a9be0" />
                            <stop offset="100%" stopColor="#356eb0" />
                          </radialGradient>
                        </defs>
                        <rect width="140" height="184" fill="url(#idPhotoBackdrop)" />
                        <circle cx="70" cy="64" r="24" fill="#eef4fb" opacity="0.92" />
                        <path
                          d="M28 158 C28 116, 112 116, 112 158 L112 184 L28 184 Z"
                          fill="#eef4fb"
                          opacity="0.92"
                        />
                        <text
                          x="70"
                          y="172"
                          textAnchor="middle"
                          fill="#2f5f96"
                          fontSize="11"
                          fontWeight="500"
                        >
                          二寸证件照
                        </text>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Local photo upload controls */}
                <div className="no-print mt-2.5 flex items-center gap-3 text-xs">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                    id="portrait-upload"
                  />
                  <label
                    htmlFor="portrait-upload"
                    className="inline-flex items-center gap-1 text-[#2d63a8] hover:text-[#9b1c18] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="h-3 w-3" />
                    <span>{portraitUrl ? '更换照片' : '上传证件照'}</span>
                  </label>
                  {portraitUrl !== DEFAULT_PORTRAIT_URL && (
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-800 cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>还原</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Certificate Preview Strip */}
          <section aria-labelledby="section-certificate">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 id="section-certificate" className="text-lg sm:text-xl font-bold text-stone-900 tracking-wide">
                证书
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-[#2d63a8] hover:text-[#9b1c18] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b1c18]"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>查看大图</span>
              </button>
            </div>

            {/* Thumbnail Strip matching screenshot layout */}
            <div className="mt-6 flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="上一张证书"
                className="no-print flex h-10 w-10 shrink-0 items-center justify-center text-[#9b1c18] hover:bg-stone-100 rounded transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b1c18]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full max-w-[460px]">
                {CERTIFICATE_TABS.map((tab) => {
                  const isActive = activeSlide === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSlide(tab.id)}
                      className={`group text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b1c18] ${
                        isActive
                          ? 'ring-2 ring-[#9b1c18] ring-offset-2'
                          : 'border border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <CertificateImageFrame tab={tab} portraitUrl={portraitUrl} compact />
                      <div className="border-t border-stone-200 bg-stone-50 px-2 py-1.5 text-center text-[11px] font-medium text-stone-700">
                        {tab.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="下一张证书"
                className="no-print flex h-10 w-10 shrink-0 items-center justify-center text-[#9b1c18] hover:bg-stone-100 rounded transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b1c18]"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Active Full Preview */}
            <div className="mt-6 border border-stone-200 bg-stone-50 p-2 sm:p-4">
              <div
                onClick={() => setIsModalOpen(true)}
                className="w-full shadow-sm border border-stone-200 bg-white cursor-zoom-in"
              >
                <CertificateImageFrame
                  tab={CERTIFICATE_TABS.find((t) => t.id === activeSlide) ?? CERTIFICATE_TABS[0]}
                  portraitUrl={portraitUrl}
                  interactive
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                <span>
                  当前预览：{CERTIFICATE_TABS.find((t) => t.id === activeSlide)?.title} ·{' '}
                  {CERTIFICATE_DATA.major} {CERTIFICATE_DATA.grade}
                  {activeSlide === 'inner' && !portraitUrl
                    ? '（点击证书右上「照片」框可上传证件照）'
                    : ''}
                </span>
                <span className="font-code-num">编号 {CERTIFICATE_DATA.certificateNumber}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-[#faf9f6] px-5 sm:px-10 py-4 text-xs text-stone-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>个人中国舞考级信息展示页（非官方认证网站，仅供个人记录与查阅）</span>
          <span className="font-code-num">证书编号：{CERTIFICATE_DATA.certificateNumber}</span>
        </footer>
      </main>

      {/* Enlarged Certificate Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="证书大图预览"
          onClick={() => setIsModalOpen(false)}
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[980px] bg-white p-3 sm:p-5 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between border-b border-stone-200 pb-2.5">
              <div className="text-sm font-semibold text-stone-900">
                {CERTIFICATE_TABS.find((t) => t.id === activeSlide)?.title} — {CERTIFICATE_DATA.name}
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="关闭大图预览"
                className="inline-flex h-8 w-8 items-center justify-center rounded text-stone-500 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <CertificateImageFrame
              tab={CERTIFICATE_TABS.find((t) => t.id === activeSlide) ?? CERTIFICATE_TABS[0]}
              portraitUrl={portraitUrl}
              interactive
            />

            <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>切换视图</span>
              </button>
              <span className="font-code-num">NO. {CERTIFICATE_DATA.certificateNumber}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
