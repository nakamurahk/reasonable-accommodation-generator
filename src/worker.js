/**
 * InclusiBridge Router - Cloudflare Worker (hardened)
 * - /app/* → React (ORIGIN_APP)
 * - /step* → React (ORIGIN_APP) - アプリ内のステップページ
 * - /deckbuilding → React (ORIGIN_APP) - アプリ内のデッキビルディングページ
 * - others → Next LP (ORIGIN_NEXT)
 *
 * Env:
 *   ORIGIN_APP  e.g. https://app.inclusibridge.com
 *   ORIGIN_NEXT e.g. https://next.inclusibridge.com
 */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Reactアプリに送るパスの判定
      const isApp = url.pathname.startsWith('/app') || 
                   url.pathname.startsWith('/step') || 
                   url.pathname.startsWith('/deckbuilding') ||
                   url.pathname === '/app';

      console.log('Request details:', { 
        pathname: url.pathname, 
        isApp, 
        ORIGIN_APP: env.ORIGIN_APP, 
        ORIGIN_NEXT: env.ORIGIN_NEXT,
        fullUrl: request.url
      });

      const targetOrigin = new URL(isApp ? env.ORIGIN_APP : env.ORIGIN_NEXT);
      
      // Reactアプリの場合、/appプレフィックスを削除
      let targetPath = url.pathname;
      if (isApp && targetPath.startsWith('/app')) {
        targetPath = targetPath.substring(4); // '/app'を削除
        if (targetPath === '') targetPath = '/'; // 空の場合はルートに
      }
      
      const targetUrl = new URL(targetPath + url.search, targetOrigin);

      // 元リクエストからヘッダを複製。ただし hop-by-hop 系は落とす
      const headers = new Headers(request.headers);
      headers.delete('host');
      headers.delete('connection');
      headers.delete('keep-alive');
      headers.delete('proxy-authenticate');
      headers.delete('proxy-authorization');
      headers.delete('te');
      headers.delete('trailers');
      headers.delete('transfer-encoding');
      headers.delete('upgrade');

      // GET/HEAD 以外のみ body を転送（ReadableStream は 1 回きり）
      const method = request.method || 'GET';
      const body = (method === 'GET' || method === 'HEAD') ? undefined : request.body;

      // 軽いキャッシュ方針（静的アセットのみ）
      const isStatic = /\.(?:png|jpe?g|gif|webp|svg|ico|css|js|mjs|txt|woff2?)$/i.test(url.pathname);

      console.log('Fetching from:', targetUrl.toString());
      
      const upstreamResp = await fetch(new Request(targetUrl.toString(), {
        method,
        headers,
        body,
        redirect: 'manual', // 307/308 等はクライアント側に委ねる
      }), {
        cf: isStatic ? { cacheEverything: true, cacheTtl: 86400 } : undefined,
      });
      
      console.log('Response status:', upstreamResp.status, 'Content-Type:', upstreamResp.headers.get('content-type'));

      // レスポンスヘッダ調整（任意）
      const respHeaders = new Headers(upstreamResp.headers);
      if (isStatic && !respHeaders.has('Cache-Control')) {
        respHeaders.set('Cache-Control', 'public, max-age=86400, immutable');
      }

      // Reactアプリの場合、レスポンス内の相対パスを修正
      if (isApp) {
        const contentType = respHeaders.get('content-type') || '';
        console.log('Processing React app response:', { contentType, isApp, targetUrl: targetUrl.toString() });
        
        if (contentType.includes('text/html') || contentType.includes('text/css') || contentType.includes('application/javascript')) {
          let body = await upstreamResp.text();
          console.log('Original body contains /static/:', body.includes('/static/'));
          
          // 相対パスを app.inclusibridge.com に書き換え
          body = body.replace(/\/static\//g, `${env.ORIGIN_APP}/static/`);
          body = body.replace(/\/assets\//g, `${env.ORIGIN_APP}/assets/`);
          
          console.log('Modified body contains app.inclusibridge.com:', body.includes('app.inclusibridge.com'));
          
          return new Response(body, {
            status: upstreamResp.status,
            statusText: upstreamResp.statusText,
            headers: respHeaders,
          });
        }
      }

      return new Response(upstreamResp.body, {
        status: upstreamResp.status,
        statusText: upstreamResp.statusText,
        headers: respHeaders,
      });
    } catch (err) {
      // 失敗時は 502 で可視化
      return new Response(
        JSON.stringify({ error: 'Upstream fetch failed', detail: String(err?.message || err) }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};