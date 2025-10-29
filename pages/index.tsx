import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CommonHeaderNext from '../src/components/layout/CommonHeaderNext';
import CommonFooterNext from '../src/components/layout/CommonFooterNext';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>InclusiBridge（インクルージブリッジ）| 合理的配慮を言語化するツール</title>
        <meta name="description" content="困りごとを整理し、あなたに合う合理的配慮の形を見つけるツール。当事者・支援者・企業が合理的配慮を共有・調整しやすくするプラットフォームです。" />
        <meta name="keywords" content="合理的配慮,発達障害,支援,困りごと,配慮案,当事者,支援者,企業,学校" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inclusibridge.com/" />
        <meta property="og:title" content="InclusiBridge（インクルージブリッジ）| 合理的配慮を言語化するツール" />
        <meta property="og:description" content="困りごとを整理し、あなたに合う合理的配慮の形を見つけるツール。当事者・支援者・企業が合理的配慮を共有・調整しやすくするプラットフォームです。" />
        <meta property="og:image" content="https://inclusibridge.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://inclusibridge.com/" />
        <meta property="twitter:title" content="InclusiBridge（インクルージブリッジ）| 合理的配慮を言語化するツール" />
        <meta property="twitter:description" content="困りごとを整理し、あなたに合う合理的配慮の形を見つけるツール。当事者・支援者・企業が合理的配慮を共有・調整しやすくするプラットフォームです。" />
        <meta property="twitter:image" content="https://inclusibridge.com/og-image.jpg" />
        
        {/* 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "InclusiBridge",
              "url": "https://inclusibridge.com",
              "description": "困りごとを整理し、あなたに合う合理的配慮の形を見つけるツール",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://inclusibridge.com/app",
                "query-input": "required"
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-white">
        <CommonHeaderNext />

        {/* Hero Section */}
        <section className="py-20" style={{ backgroundColor: '#14b8a6' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 
                className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up"
                style={{
                  animation: 'fadeInUp 1s ease-out 0.2s both'
                }}
              >
                困りごとを整理して、<br />
                あなたに合う合理的配慮の形を見つけよう。
              </h1>
              <p 
                className="text-sm text-white mb-2 animate-fade-in-up"
                style={{
                  animation: 'fadeInUp 1s ease-out 0.4s both'
                }}
              >
                💚 すべての当事者向けサービスは<span style={{ color: '#ef4444', fontWeight: 'bold' }}>完全無料</span>です
              </p>
              <p 
                className="text-sm text-white mb-8 animate-fade-in-up"
                style={{
                  animation: 'fadeInUp 1s ease-out 0.5s both'
                }}
              >
                💡<span style={{ color: '#ef4444', fontWeight: 'bold' }}>登録不要・5分</span>であなたに合った支援案がわかる
              </p>
              <div 
                className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
                style={{
                  animation: 'fadeInUp 1s ease-out 0.6s both'
                }}
              >
                <a 
                  href="http://localhost:3001/app" 
                  className="bg-white text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  無料で使ってみる
                </a>
                <Link 
                  href="/concept" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:bg-opacity-30 hover:-translate-y-1 transition-all duration-200 bg-white bg-opacity-20"
                >
                  もっと知る
                </Link>
              </div>
            </div>
          </div>
          
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">3,500+</div>
                <div className="text-lg font-semibold text-gray-700">ユーザーが利用</div>
                <div className="text-sm text-gray-500">（公開一週間）</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">130+</div>
                <div className="text-lg font-semibold text-gray-700">困りごとデータ</div>
                <div className="text-sm text-gray-500">（継続追加中）</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">1,200+</div>
                <div className="text-lg font-semibold text-gray-700">配慮案を生成</div>
                <div className="text-sm text-gray-500">（実利用データ）</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">✨ このツールでできること ✨</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-300 hover:border-teal-500 hover:shadow-teal-300 hover:shadow-lg transition-all duration-200 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">困りごとを探す</h3>
                <p className="text-gray-600">
                  特性と環境から、あなたに当てはまる困りごとをリストアップ。「これだ」という瞬間を体験してください。
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-300 hover:border-teal-500 hover:shadow-teal-300 hover:shadow-lg transition-all duration-200 text-center">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">配慮案を見つける</h3>
                <p className="text-gray-600">
                  困りごとに対する配慮案が自動で提案されます。職場や学校で「何をしてほしいか」を言語化できます。
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-300 hover:border-teal-500 hover:shadow-teal-300 hover:shadow-lg transition-all duration-200 text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">相談を準備する</h3>
                <p className="text-gray-600">
                  見つけた配慮案をAIでまとめて、上司や先生との相談に活用。対等な話し合いを実現します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-16">InclusiBridge について</h2>
              <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-teal-500 max-w-4xl mx-auto text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">合理的配慮を「言語化できる社会をつくる」</h3>
                <p className="text-lg text-gray-600 mb-6">
                  配慮は本来、当事者と支援者が対等に作り上げるもの。 でも多くの場合、「何を求めるか」を言語化できず、 支援者側の「勘」や「経験」に依存しています。
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  InclusiBridge は、困りごと＋配慮のデータベースと AI の力で、あなたの「見えない困難」を可視化。 当事者が主体的に、支援を「選べる」社会を目指します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-teal-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              困りごとを整理する一歩を、今から始めよう
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              無料で利用できるベータ版で、あなたの困りごとを整理してみませんか？
            </p>
            <a 
              href="http://localhost:3001/app" 
              className="bg-white text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 shadow-md hover:shadow-2xl inline-block"
            >
              ベータアプリを試す
            </a>
          </div>
        </section>

        <CommonFooterNext />
      </div>
    </>
  );
};

export default HomePage;
