import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CommonHeaderNext from '../src/components/layout/CommonHeaderNext';
import CommonFooterNext from '../src/components/layout/CommonFooterNext';

const AboutPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>合理的配慮とは - InclusiBridge</title>
        <meta name="description" content="合理的配慮の定義、法的背景、具体例を詳しく解説。障害のある人が他の者と同等の機会を得るために必要な調整や変更について学びましょう。" />
        <meta property="og:title" content="合理的配慮とは - InclusiBridge" />
        <meta property="og:description" content="合理的配慮の定義、法的背景、具体例を詳しく解説。障害のある人が他の者と同等の機会を得るために必要な調整や変更について学びましょう。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inclusibridge.com/about" />
        <meta property="og:image" content="https://inclusibridge.com/ogp-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Fitty2501" />
        <meta name="twitter:creator" content="@Fitty2501" />
        <link rel="canonical" href="https://inclusibridge.com/about" />
      </Head>

      <div className="min-h-screen bg-white">
        <CommonHeaderNext />

        {/* Hero Section */}
        <section className="py-20" style={{ backgroundColor: 'rgb(20, 184, 166)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              合理的配慮とは
            </h1>
            <p className="text-xl text-white">
              障害のある人と無い人が、対等に社会参加するために
            </p>
          </div>
        </section>

        {/* Definition Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">定義</h2>
            
            <div className="space-y-8">
              {/* Green Definition Card */}
              <div className="p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'rgb(20, 184, 166)' }}>
                <h3 className="text-2xl font-bold text-white mb-4">合理的配慮 (Reasonable Accommodation)</h3>
                <p className="text-white text-lg">
                  障害のある人が、他の者と同等の機会を得るために、必要に応じて提供される調整や変更。
                </p>
              </div>

              {/* White Background Information Card */}
              <div className="p-8 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: '#f7fafc', borderLeft: '4px solid #14b8a6' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">📋 法的背景</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">日本: 障害者差別解消法 (2016年施行)</h4>
                    <p className="text-gray-700">
                      民間企業に対して、障害者への合理的配慮は「努力義務」。2024年の制度改正により、法的に「義務化」へ移行。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">国際: UN障害者権利条約 (UNCRPD)</h4>
                    <p style={{ color: '#4a5568' }}>
                      日本を含む165カ国が批准。「合理的配慮」は基本的人権として規定。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">ポイント:</h4>
                    <ul className="space-y-2" style={{ color: '#4a5568' }}>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        「特別扱い」ではなく、「対等な参加」の実現
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        「過度な負担」でない範囲での対応
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        個人ごと・状況ごとに異なる
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Important Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">なぜ重要か</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300" style={{ borderTop: '4px solid #14b8a6' }}>
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">当事者の視点</h3>
                <p style={{ color: '#4a5568' }}>
                  配慮がないと、能力があっても「参加できない」状態になる。適切な配慮により、本来の力を発揮できます。
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300" style={{ borderTop: '4px solid #14b8a6' }}>
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">企業・組織の視点</h3>
                <p style={{ color: '#4a5568' }}>
                  適切な配慮で、優秀な人材が活躍できる環境に。多様性向上、離職防止、生産性向上を実現。
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300" style={{ borderTop: '4px solid #14b8a6' }}>
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">社会の視点</h3>
                <p style={{ color: '#4a5568' }}>
                  インクルーシブな社会は、すべての人がとってより良い社会。12億人の障害者が活躍できる世界へ。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">具体例</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Example 1 */}
              <div className="p-6 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: '#f7fafc' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#14b8a6' }}>例1: 発達障害 × 営業職</h3>
                
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">困りごと</h4>
                  <p style={{ color: '#4a5568' }}>
                    顧客対応時に、会議の流れを予測できず、パニックになる。
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">配慮の例</h4>
                  <ul className="space-y-1" style={{ color: '#4a5568' }}>
                    <li>• 事前の顧客情報提供</li>
                    <li>• ロールプレイの練習時間</li>
                    <li>• フィードバック会議の定期開催</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(13, 148, 136, 0.05))', borderLeft: '3px solid #14b8a6' }}>
                  <div style={{ color: '#0d9488' }}>
                    <div className="font-semibold mb-1">✅ 結果</div>
                    <div>本人のペースで対応でき、営業成績向上。</div>
                  </div>
                </div>
              </div>

              {/* Example 2 */}
              <div className="p-6 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: '#f7fafc' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#14b8a6' }}>例2: 身体障害 × リモートワーク</h3>
                
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">困りごと</h4>
                  <p style={{ color: '#4a5568' }}>
                    通勤時の移動が困難。朝の支度に時間がかかる。
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">配慮の例</h4>
                  <ul className="space-y-1" style={{ color: '#4a5568' }}>
                    <li>• 週2リモートワークの確保</li>
                    <li>• コアタイムの柔軟化</li>
                    <li>• ヘルパー雇用の支援</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(13, 148, 136, 0.05))', borderLeft: '3px solid #14b8a6' }}>
                  <div style={{ color: '#0d9488' }}>
                    <div className="font-semibold mb-1">✅ 結果</div>
                    <div>集中力向上、出勤日数減でも生産性向上。</div>
                  </div>
                </div>
              </div>

              {/* Example 3 */}
              <div className="p-6 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: '#f7fafc' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#14b8a6' }}>例3: 聴覚障害 × ミーティング</h3>
                
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">困りごと</h4>
                  <p style={{ color: '#4a5568' }}>
                    複数人のミーティングで、誰が話しているか判断しにくい。
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">配慮の例</h4>
                  <ul className="space-y-1" style={{ color: '#4a5568' }}>
                    <li>• 手話通訳の配置</li>
                    <li>• 字幕の自動生成</li>
                    <li>• 事前資料の配布</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(13, 148, 136, 0.05))', borderLeft: '3px solid #14b8a6' }}>
                  <div style={{ color: '#0d9488' }}>
                    <div className="font-semibold mb-1">✅ 結果</div>
                    <div>情報へのアクセス平等化、意思決定に参画可能に。</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misconceptions Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">よくある誤解</h2>
            
            <div className="space-y-8">
              {/* Misconception 1 */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="p-3 rounded-lg flex-1" style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #f56565' }}>
                    <div>
                      <div className="text-red-800 font-bold mb-2">❌ 誤解</div>
                      <div className="text-red-800">「特別扱い」をしている</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg flex-1" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #14b8a6' }}>
                    <div>
                      <div className="text-green-800 font-bold mb-2">✅ 正解</div>
                      <div className="text-green-800">「対等な参加」を実現している</div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-gray-700">
                    健常者と同じルールでは対応できない状況を、その人が健常者と対等にできるような調整をしているだけ。これは「特別扱い」ではなく、「対等」を実現する手段です。
                  </p>
                </div>
              </div>

              {/* Misconception 2 */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="p-3 rounded-lg flex-1" style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #f56565' }}>
                    <div>
                      <div className="text-red-800 font-bold mb-2">❌ 誤解</div>
                      <div className="text-red-800">「過度な負担」になる</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg flex-1" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #14b8a6' }}>
                    <div>
                      <div className="text-green-800 font-bold mb-2">✅ 正解</div>
                      <div className="text-green-800">「合理的な範囲」での対応</div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-gray-700">
                    法律では「過度な負担」を考慮します。企業規模、財政状況、実現可能性を考慮して、バランスの取れた配慮を求めています。
                  </p>
                </div>
              </div>

              {/* Misconception 3 */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="p-3 rounded-lg flex-1" style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #f56565' }}>
                    <div>
                      <div className="text-red-800 font-bold mb-2">❌ 誤解</div>
                      <div className="text-red-800">「画一的」で変わらない</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg flex-1" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #14b8a6' }}>
                    <div>
                      <div className="text-green-800 font-bold mb-2">✅ 正解</div>
                      <div className="text-green-800">「個人ごと」「状況ごと」に異なる</div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-gray-700">
                    同じ障害者でも、個人差は大きい。職場や学校など状況が変われば、必要な配慮も変わります。当事者と支援者が対話して、最適な配慮を決めることが重要です。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20" style={{ backgroundColor: 'rgb(20, 184, 166)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              配慮を「言語化」することから始まる
            </h2>
            <p className="text-xl text-white mb-8">
              InclusiBridgeは、当事者と支援者が対等に配慮を作り上げるツールです。
            </p>
            <a
              href="/app"
              className="inline-block bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
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

export default AboutPage;
