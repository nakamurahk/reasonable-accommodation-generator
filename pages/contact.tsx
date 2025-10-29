import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import emailjs from '@emailjs/browser';
import CommonHeaderNext from '../src/components/layout/CommonHeaderNext';
import CommonFooterNext from '../src/components/layout/CommonFooterNext';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // EmailJSを使用してメール送信
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        type: formData.type
      };

      // EmailJSの設定
      const result = await emailjs.send(
        'service_kot1938', // EmailJSのサービスID
        'template_bcu5sdr', // EmailJSのテンプレートID
        templateParams,
        '7W4Y1oE1pX-_j-SE-' // EmailJSの公開キー
      );

      console.log('メール送信成功:', result);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      console.error('メール送信エラー:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>お問い合わせ - InclusiBridge</title>
        <meta name="description" content="InclusiBridgeに関するお問い合わせはこちらから。ご質問、ご要望、バグ報告など、お気軽にお問い合わせください。" />
        <meta property="og:title" content="お問い合わせ - InclusiBridge" />
        <meta property="og:description" content="InclusiBridgeに関するお問い合わせはこちらから。ご質問、ご要望、バグ報告など、お気軽にお問い合わせください。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inclusibridge.com/contact" />
        <meta property="og:image" content="https://inclusibridge.com/ogp-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Fitty2501" />
        <meta name="twitter:creator" content="@Fitty2501" />
        <link rel="canonical" href="https://inclusibridge.com/contact" />
      </Head>

      <div className="min-h-screen bg-white">
        <CommonHeaderNext />

        {/* Hero Section */}
        <section className="py-20" style={{ backgroundColor: '#14b8a6' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              お問い合わせ
            </h1>
            <p className="text-xl text-white">
              ご質問、ご要望、フィードバックなど、お気軽にお聞かせください
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">お問い合わせ情報</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-teal-600 text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">メール</h3>
                      <p className="text-gray-600">fitty2501@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-teal-600 text-xl">⏰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">回答時間</h3>
                      <p className="text-gray-600">平日2-3営業日以内</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-teal-600 text-xl">💬</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">サポート</h3>
                      <p className="text-gray-600">技術的なご質問もお気軽に</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">メッセージを送る</h2>
                
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800">お問い合わせありがとうございます。内容を確認の上、回答いたします。</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">送信に失敗しました。もう一度お試しください。</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      お名前（HNでも可） <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="山田太郎"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      お問い合わせ種別
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="general">一般的なお問い合わせ</option>
                      <option value="technical">技術的な質問</option>
                      <option value="feedback">フィードバック</option>
                      <option value="partnership">パートナーシップ</option>
                      <option value="media">メディア・取材</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      件名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="お問い合わせの件名"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      メッセージ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="お問い合わせ内容を詳しくお聞かせください"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? '送信中...' : '送信する'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <CommonFooterNext />
      </div>
    </>
  );
};

export default ContactPage;
