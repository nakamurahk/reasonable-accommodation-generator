import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Custom404: React.FC = () => {
  return (
    <>
      <Head>
        <title>404 - ページが見つかりません - InclusiBridge</title>
        <meta name="description" content="お探しのページが見つかりませんでした" />
      </Head>
      
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            お探しのページが見つかりませんでした
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

export default Custom404;
