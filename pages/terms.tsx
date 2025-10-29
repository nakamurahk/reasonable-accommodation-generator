import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CommonHeaderNext from '../src/components/layout/CommonHeaderNext';
import CommonFooterNext from '../src/components/layout/CommonFooterNext';

const TermsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>利用規約 - InclusiBridge</title>
        <meta name="description" content="InclusiBridgeの利用規約。本ツールの利用条件について詳しく説明しています。" />
        <meta property="og:title" content="利用規約 - InclusiBridge" />
        <meta property="og:description" content="InclusiBridgeの利用規約。本ツールの利用条件について詳しく説明しています。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inclusibridge.com/terms" />
        <meta property="og:image" content="https://inclusibridge.com/ogp-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Fitty2501" />
        <meta name="twitter:creator" content="@Fitty2501" />
        <link rel="canonical" href="https://inclusibridge.com/terms" />
      </Head>

      <div className="min-h-screen bg-white">
        <CommonHeaderNext />

        {/* Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">利用規約</h1>
              <p className="text-lg text-gray-600 mb-8">
                制定日：2025年10月2日
              </p>

              <div className="space-y-8">
                <section>
                  <p className="text-gray-700 mb-6">
                    この利用規約（以下「本規約」）は、InclusiBridge（以下「本ツール」）の利用条件を定めるものです。利用者は、本ツールを利用することにより、本規約に同意したものとみなします。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（適用）</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>本規約は、利用者と本ツール提供者との間の一切の関係に適用されます。</li>
                    <li>本規約に同意いただけない場合、本ツールを利用することはできません。</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（利用環境）</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>利用者は、自らの責任と費用で本ツールを利用するために必要な通信機器・環境を整備するものとします。</li>
                    <li>通信費等の費用はすべて利用者が負担するものとします。</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（禁止事項）</h2>
                  <p className="text-gray-700 mb-4">
                    利用者は、本ツールの利用にあたり、以下の行為をしてはなりません。
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>法令または公序良俗に違反する行為</li>
                    <li>他者の権利を侵害する行為</li>
                    <li>本ツールの運営を妨害する行為</li>
                    <li>不正アクセスや不正利用を試みる行為</li>
                    <li>本ツールを商業目的で無断利用する行為</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（免責事項）</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>本ツールは、合理的配慮に関する理解や調整の補助を目的とするものであり、医学的助言、法律的助言、労務上の正式判断を提供するものではありません。</li>
                    <li>本ツールの内容はあくまで参考情報であり、企業・学校・支援機関等における合意形成や法的効力を保証するものではありません。</li>
                    <li>本ツールの利用によって生じた一切の損害（精神的・身体的・経済的損害を含むがこれに限らない）について、提供者は責任を負いません。</li>
                    <li>提供者は、本ツールの内容や提供方法を予告なく変更・中止する場合があり、それに伴って利用者に損害が生じても責任を負いません。</li>
                    <li>利用者は、本ツールを利用するにあたり、最終的な判断や責任は自己にあることを承諾するものとします。</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（収集データの取り扱い）</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>本ツールは、利用者の入力データや選択内容を匿名化して収集・分析する場合があります。</li>
                    <li>任意で回答いただくアンケート情報は、機能改善や研究開発の目的で利用されます。</li>
                    <li>収集データの詳細については、別途定める「プライバシーポリシー」に従うものとします。</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（知的財産権）</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>本ツールに関する著作権、商標権その他の知的財産権は、提供者に帰属します。</li>
                    <li>利用者は、本ツールを私的利用の範囲内で使用することができます。無断での複製、転載、配布は禁止します。</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（規約の変更）</h2>
                  <p className="text-gray-700">
                    提供者は、必要と判断した場合、利用者に通知することなく本規約を変更できるものとします。変更後の規約は、本ツール上に掲示された時点で効力を生じます。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（準拠法）</h2>
                  <p className="text-gray-700">
                    本規約は、日本法に準拠し解釈されるものとします。
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>

        <CommonFooterNext />
      </div>
    </>
  );
};

export default TermsPage;
