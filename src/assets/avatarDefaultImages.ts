// 处理 Unicode 字符的 Base64 编码
function utf8ToBase64(str: string) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode(parseInt('0x' + p1));
    }));
}

// 内联SVG图片
export const IMAGES = {
  // 简洁的云存储logo
  logo: `data:image/svg+xml;base64,${utf8ToBase64(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19 18H6c-3.3 0-6-2.7-6-6s2.7-6 6-6c.3 0 .7 0 1 .1C7.9 4.2 9.8 3 12 3c3.3 0 6 2.7 6 6v1h1c2.2 0 4 1.8 4 4s-1.8 4-4 4z" 
        fill="none" 
        stroke="#5c6bc0" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
    </svg>
  `)}`,

  // 简约风格的默认头像
  defaultAvatar: `data:image/svg+xml;base64,${utf8ToBase64(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#f4f8fb" stroke="#5c6bc0" stroke-width="2"/>
      <circle cx="12" cy="10" r="3" fill="#5c6bc0"/>
      <path d="M18 18.5c-1.4-2.2-3.8-3.5-6-3.5s-4.6 1.3-6 3.5" 
        stroke="#5c6bc0" 
        stroke-width="2" 
        stroke-linecap="round"/>
    </svg>
  `)}`,

  // 简约风格的hero图片
  heroImage: `data:image/svg+xml;base64,${utf8ToBase64(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#5c6bc0;stop-opacity:0.1"/>
          <stop offset="100%" style="stop-color:#5c6bc0;stop-opacity:0.05"/>
        </linearGradient>
      </defs>
      <rect width="200" height="160" fill="url(#grad)" rx="10"/>
      <g transform="translate(40,30)">
        <path d="M60 20h40M60 40h40M60 60h20" 
          stroke="#5c6bc0" 
          stroke-width="4" 
          stroke-linecap="round"/>
        <path d="M20 80h80v40h-80z" 
          fill="none" 
          stroke="#5c6bc0" 
          stroke-width="2"/>
        <path d="M30 90h60M30 100h40M30 110h20" 
          stroke="#5c6bc0" 
          stroke-opacity="0.5" 
          stroke-width="2" 
          stroke-linecap="round"/>
      </g>
      <text x="100" y="140" 
        font-family="'Microsoft YaHei', Arial" 
        font-size="14" 
        fill="#5c6bc0" 
        text-anchor="middle">云存储</text>
    </svg>
  `)}`
} 