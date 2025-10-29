import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface ErrorProps {
  statusCode?: number;
}

const Error: React.FC<ErrorProps> = ({ statusCode }) => {
  return (
    <>
      <Head>
        <title>エラー - InclusiBridge</title>
        <meta name="description" content="ページが見つかりません" />
      </Head>
      
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {statusCode || 'エラー'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {statusCode === 404 
              ? 'ページが見つかりません' 
              : '何か問題が発生しました'
            }
          </p>
          <Link 
            href="/"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </>
  );
};

export default Error;
