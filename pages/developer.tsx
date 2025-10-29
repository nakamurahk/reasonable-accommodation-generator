import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CommonHeaderNext from '../src/components/layout/CommonHeaderNext';
import CommonFooterNext from '../src/components/layout/CommonFooterNext';

const DeveloperPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>開発者紹介 - InclusiBridge</title>
        <meta name="description" content="InclusiBridgeの開発者について。障害者支援の現場経験と技術力を活かし、配慮を言語化できる社会を目指しています。" />
        <meta property="og:title" content="開発者紹介 - InclusiBridge" />
        <meta property="og:description" content="InclusiBridgeの開発者について。障害者支援の現場経験と技術力を活かし、配慮を言語化できる社会を目指しています。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inclusibridge.com/developer" />
        <meta property="og:image" content="https://inclusibridge.com/ogp-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Fitty2501" />
        <meta name="twitter:creator" content="@Fitty2501" />
        <link rel="canonical" href="https://inclusibridge.com/developer" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <CommonHeaderNext />
        
        {/* Hero Section */}
        <section className="py-20 bg-teal-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                開発者紹介
              </h1>
              <p className="text-xl text-white">
                このページでは、InclusiBridgeを開発・運営している個人開発者の情報と、プロジェクトの背景・理念を紹介します。
              </p>
            </div>
          </div>
        </section>

        {/* 1. はじめに */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-teal-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. はじめに</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                InclusiBridgeは、当事者・支援者・企業／学校が合理的配慮を共有・調整しやすくするために開発されたツールです。このページでは、「誰が」「なぜ」このツールを作っているのかを明示します。
              </p>
              <p className="text-sm text-gray-600">
                （※診断や医療的助言を行うものではありません。詳細は
                <Link href="/privacy" className="text-teal-600 hover:text-teal-800 underline">プライバシーポリシー</Link>
                および
                <Link href="/terms" className="text-teal-600 hover:text-teal-800 underline">利用規約</Link>
                をご覧ください。）
              </p>
            </div>
          </div>
        </section>

        {/* 2. 開発・運営者 */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. 開発者情報</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">基本情報</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li><span className="font-semibold">開発・運営：</span>Fitty2501</li>
                    <li><span className="font-semibold">所属：</span>大手IT企業勤務（個人活動として運営）</li>
                    <li><span className="font-semibold">立場：</span>発達当事者／エンジニア</li>
                    <li><span className="font-semibold">活動内容：</span>企画・設計・開発・運営すべてを個人で実施</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">SNS／執筆</h3>
                  <p className="text-gray-600 mb-3">
                    X（旧Twitter）・noteを中心に発達障害や合理的配慮に関する考察を発信しています。
                  </p>
                  <ul className="text-gray-700 space-y-2">
                    <li>
                      <span className="font-semibold">X（旧Twitter）：</span>
                      <a href="https://x.com/Fitty2501" className="text-teal-600 hover:text-teal-800 ml-2" target="_blank" rel="noopener noreferrer">
                        https://x.com/Fitty2501
                      </a>
                    </li>
                    <li>
                      <span className="font-semibold">note（活動ログ）：</span>
                      <a href="https://note.com/inclusive2501" className="text-teal-600 hover:text-teal-800 ml-2" target="_blank" rel="noopener noreferrer">
                        https://note.com/inclusive2501
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    ※勤務環境上、実名や企業名を全面的に公開することは控えています。<br />
                    InclusiBridgeは所属組織とは独立した個人プロジェクトです。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 開発の背景 */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-teal-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. 開発の背景</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  私は発達特性をもつ当事者として働く中で、<br />
                  「配慮を求める」「説明する」「理解を得る」――そのどれもが言葉の壁にぶつかる経験をしてきました。
                </p>
                <p>
                  支援者や企業担当者との対話では、
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>何をどう伝えるか</li>
                  <li>どんな配慮が実現可能か</li>
                  <li>どう合意すれば続くのか</li>
                </ul>
                <p>
                  このあたりが属人的になりすぎて、再現性のないやりとりが多く生じています。
                </p>
                <p>
                  InclusiBridgeは、そうしたやりとりを構造的に整理し、誰でも使える形にしたいという思いから生まれたツールです。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ミッションと方針 */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. ミッションと方針</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-teal-50 p-6 rounded-xl border-l-4 border-teal-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">構造化</h3>
                    <p className="text-gray-700">合理的配慮を、構造化して誰でも扱えるように。</p>
                  </div>
                  <div className="bg-teal-50 p-6 rounded-xl border-l-4 border-teal-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">当事者第一</h3>
                    <p className="text-gray-700">当事者が「自分を説明しやすくなる」ことを第一に。</p>
                  </div>
                  <div className="bg-teal-50 p-6 rounded-xl border-l-4 border-teal-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">検討しやすさ</h3>
                    <p className="text-gray-700">支援者・企業が「検討しやすくなる」仕組みを。</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-gray-700">
                    この3点を軸に、ヒアリングやユーザーテストを重ねながら開発しています。<br />
                    当事者の自己理解と合意形成の前進を目的に当事者向けに無償で公開しています。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. お問い合わせ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-teal-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. お問い合わせ</h2>
              <p className="text-gray-700 mb-6">
                InclusiBridgeや掲載内容に関するご意見・ご相談は、以下よりご連絡ください。
              </p>
              <Link
                href="/contact"
                className="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                お問い合わせフォーム
              </Link>
            </div>
          </div>
        </section>

        {/* 6. 更新履歴 */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. 更新履歴</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 font-mono">2025年10月25日</span>
                  <span className="text-gray-700">開発者紹介ページ公開</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CommonFooterNext />
      </div>
    </>
  );
};

export default DeveloperPage;
