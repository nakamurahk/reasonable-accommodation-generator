import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CommonHeaderNext from '../src/components/layout/CommonHeaderNext';
import CommonFooterNext from '../src/components/layout/CommonFooterNext';

const PrivacyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>プライバシーポリシー - InclusiBridge</title>
        <meta name="description" content="InclusiBridgeのプライバシーポリシー。利用者の情報の取り扱いについて詳しく説明しています。" />
        <meta property="og:title" content="プライバシーポリシー - InclusiBridge" />
        <meta property="og:description" content="InclusiBridgeのプライバシーポリシー。利用者の情報の取り扱いについて詳しく説明しています。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inclusibridge.com/privacy" />
        <meta property="og:image" content="https://inclusibridge.com/ogp-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Fitty2501" />
        <meta name="twitter:creator" content="@Fitty2501" />
        <link rel="canonical" href="https://inclusibridge.com/privacy" />
      </Head>

      <div className="min-h-screen bg-white">
        <CommonHeaderNext />

        {/* Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
              <p className="text-lg text-gray-600 mb-8">
                制定日：2025年10月2日
              </p>

              <div className="space-y-8">
                <section>
                  <p className="text-gray-700 mb-6">
                    本プライバシーポリシーは、InclusiBridge（以下「本ツール」）における利用者の情報の取り扱いについて定めるものです。利用者は、本ツールを利用することで、本ポリシーに同意したものとみなします。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（収集する情報）</h2>
                  <p className="text-gray-700 mb-4">
                    本ツールは、以下の情報を収集する場合があります。
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>利用時に入力された「困りごと」や「選択内容」等のデータ（匿名化された形で保存・分析されます）</li>
                    <li>任意で回答いただくアンケート情報（操作評価・改善要望等）</li>
                  </ul>
                  <p className="text-gray-700">
                    ※本ツールは、氏名・住所・連絡先などの直接的な個人情報を収集しません。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（利用目的）</h2>
                  <p className="text-gray-700 mb-4">
                    収集した情報は、以下の目的で利用します。
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>本ツールの機能改善および利用状況の分析</li>
                    <li>匿名統計データの作成（個人を特定できない形式で利用）</li>
                    <li>本ツールの品質向上に必要な研究・開発目的</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（アンケートに関する補足）</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>アンケートは任意回答であり、未回答による不利益はありません。</li>
                    <li>アンケートにはGoogleフォームを利用する場合があり、その際はGoogleのプライバシーポリシーも適用されます。</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（第三者提供）</h2>
                  <p className="text-gray-700 mb-4">
                    利用者の同意なく、収集した情報を第三者に提供することはありません。
                  </p>
                  <p className="text-gray-700">
                    ただし、法令に基づく場合、または人の生命・身体・財産の保護のために必要な場合はこの限りではありません。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（データの管理）</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>収集した情報は、適切なセキュリティ対策を講じて管理します。</li>
                    <li>利用者を特定できる形式で保存することはありません。</li>
                    <li>保存期間は目的達成に必要な範囲内とし、不要になった情報は速やかに削除します。</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（Cookie等の利用）</h2>
                  <p className="text-gray-700">
                    本ツールは、利用状況の把握や利便性向上のため、Cookieや類似技術を利用する場合があります。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（ポリシーの変更）</h2>
                  <p className="text-gray-700">
                    本ポリシーの内容は、利用者に通知することなく変更される場合があります。変更後のポリシーは、本ツール上に掲示された時点で効力を生じるものとします。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（お問い合わせ）</h2>
                  <p className="text-gray-700">
                    本ポリシーに関するお問い合わせは、本ツール提供者までご連絡ください。
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

export default PrivacyPage;
