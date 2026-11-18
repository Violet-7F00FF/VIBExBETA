/* MIGDAL BAVEL · Excerpt boards — shared script
   판(board) 하나 = 발췌 하나. 각 페이지(index / chat / novel)는 <body data-mode="..."> 와 #seed 데이터만 다르고,
   판·편집 패널·스타일·PNG 저장은 모두 이 파일이 만듭니다. */
(function(){
'use strict';
const MODE = document.body.dataset.mode || 'chat';   // home | chat | novel
const KEY  = 'migdal-bavel-board-' + MODE + '-v2';
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pad = n => String(n).padStart(2,'0');
const clone = o => JSON.parse(JSON.stringify(o));
const wide = () => window.innerWidth > 980;

/* ------------------------------------------------------------------ fonts */
const G = (fam, w) => 'https://fonts.googleapis.com/css2?family=' + fam.replace(/ /g,'+') + (w ? ':wght@' + w : '') + '&display=swap';
const FONTS = {
  ko: [
    {n:'Pretendard',         url:'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css', s:'"Pretendard Variable","Pretendard","Noto Sans KR",sans-serif'},
    {n:'Noto Sans KR',       url:G('Noto Sans KR','300;400;500;600;700;800'), s:'"Noto Sans KR",sans-serif'},
    {n:'IBM Plex Sans KR',   url:G('IBM Plex Sans KR','300;400;500;600;700'), s:'"IBM Plex Sans KR",sans-serif'},
    {n:'Nanum Gothic',       url:G('Nanum Gothic','400;700;800'), s:'"Nanum Gothic",sans-serif'},
    {n:'Gowun Dodum',        url:G('Gowun Dodum'), s:'"Gowun Dodum",sans-serif'},
    {n:'Noto Serif KR',      url:G('Noto Serif KR','300;400;500;600;700;800'), s:'"Noto Serif KR",serif'},
    {n:'Nanum Myeongjo',     url:G('Nanum Myeongjo','400;700;800'), s:'"Nanum Myeongjo",serif'},
    {n:'Gowun Batang',       url:G('Gowun Batang','400;700'), s:'"Gowun Batang",serif'},
    {n:'Hahmlet',            url:G('Hahmlet','300;400;500;600;700;800'), s:'"Hahmlet",serif'},
    {n:'Song Myung',         url:G('Song Myung'), s:'"Song Myung",serif'},
    {n:'Orbit',              url:G('Orbit'), s:'"Orbit",sans-serif'},
    {n:'Gaegu',              url:G('Gaegu','300;400;700'), s:'"Gaegu",cursive'},
    {n:'Nanum Pen Script',   url:G('Nanum Pen Script'), s:'"Nanum Pen Script",cursive'}
  ],
  en: [
    {n:'Outfit',             url:G('Outfit','300;400;500;600;700'), s:'"Outfit"'},
    {n:'Montserrat',         url:G('Montserrat','300;400;500;600;700'), s:'"Montserrat"'},
    {n:'Space Grotesk',      url:G('Space Grotesk','300;400;500;600;700'), s:'"Space Grotesk"'},
    {n:'Josefin Sans',       url:G('Josefin Sans','300;400;600;700'), s:'"Josefin Sans"'},
    {n:'Unbounded',          url:G('Unbounded','300;400;600'), s:'"Unbounded"'},
    {n:'Syncopate',          url:G('Syncopate','400;700'), s:'"Syncopate"'},
    {n:'Cormorant Garamond', url:G('Cormorant Garamond','400;500;600;700'), s:'"Cormorant Garamond"'},
    {n:'Italiana',           url:G('Italiana'), s:'"Italiana"'},
    {n:'JetBrains Mono',     url:G('JetBrains Mono','300;400;600'), s:'"JetBrains Mono"'}
  ]
};
const loaded = {};
function loadFont(f){ if(!f || loaded[f.n]) return; loaded[f.n]=1; const l=document.createElement('link'); l.rel='stylesheet'; l.href=f.url; l.crossOrigin='anonymous'; l.onload=()=>setTimeout(fit,60); document.head.appendChild(l); }
const fontBy = (kind, name) => FONTS[kind].find(f => f.n === name) || FONTS[kind][0];
loadFont(fontBy('ko','Noto Sans KR')); loadFont(fontBy('en','Outfit'));

/* ------------------------------------------------------------------ defaults */
const PRESETS = [
  {n:'바벨 라이트', c:{page:'#E4E7EC',bg:'#F7F8FA',dotc:'#E3E7EC',ink:'#3A3F4B',sub:'#5D6370',mute:'#8A909C',act:'#8A909C',card:'#FFFFFF',line:'#C9CFD8',cL:'#2EC4B6',cR:'#A66BE8'}},
  {n:'밤의 탑',     c:{page:'#0B0D11',bg:'#15171D',dotc:'#262A33',ink:'#E6E8EE',sub:'#B4B9C4',mute:'#7D8391',act:'#8E95A3',card:'#1D2028',line:'#3A3F4B',cL:'#3FE0D0',cR:'#B98CFF'}},
  {n:'라벤더 안개', c:{page:'#E7E3F0',bg:'#F6F4FA',dotc:'#E4DFEF',ink:'#3A3550',sub:'#5E5878',mute:'#9A93B3',act:'#9A93B3',card:'#FFFFFF',line:'#D3CCE6',cL:'#7C6CF0',cR:'#E0739B'}},
  {n:'민트 크림',   c:{page:'#DDEBE6',bg:'#F2F8F5',dotc:'#DCEBE4',ink:'#2E3D38',sub:'#4F625B',mute:'#89A097',act:'#89A097',card:'#FFFFFF',line:'#C2D9CF',cL:'#2FB58E',cR:'#5B8DEF'}},
  {n:'선셋',        c:{page:'#F0E0D6',bg:'#FBF3EE',dotc:'#F1E1D6',ink:'#43322A',sub:'#6E5649',mute:'#A88F80',act:'#A88F80',card:'#FFFFFF',line:'#E5CDBE',cL:'#F08A4B',cR:'#C2508A'}},
  {n:'버터',        c:{page:'#EFE7CF',bg:'#FBF7EA',dotc:'#EEE6CC',ink:'#3D3826',sub:'#645D45',mute:'#9F977B',act:'#9F977B',card:'#FFFFFF',line:'#DDD3B0',cL:'#E0A82E',cR:'#5C9E7A'}},
  {n:'양피지',      c:{page:'#E6DDCB',bg:'#F3EDE2',dotc:'#E3D9C6',ink:'#3B3226',sub:'#5E5242',mute:'#9A8C76',act:'#9A8C76',card:'#FBF7EF',line:'#CDBFA6',cL:'#3E8E87',cR:'#8C5A9E'}},
  {n:'새벽',        c:{page:'#DDE3EF',bg:'#EEF1F8',dotc:'#DCE2EF',ink:'#2B3150',sub:'#4F577A',mute:'#8A91AD',act:'#8A91AD',card:'#FFFFFF',line:'#C3CAE0',cL:'#4C7DFF',cR:'#FF6B9A'}},
  {n:'벚꽃',        c:{page:'#F0E2E5',bg:'#FBF4F5',dotc:'#F0DFE2',ink:'#4A3A3F',sub:'#6E5A60',mute:'#A08C92',act:'#A08C92',card:'#FFFFFF',line:'#E2CCD1',cL:'#E87A9A',cR:'#8E7AE8'}},
  {n:'올리브',      c:{page:'#E5E3D6',bg:'#F4F3EC',dotc:'#E3E1D3',ink:'#34362B',sub:'#575A49',mute:'#8F917E',act:'#8F917E',card:'#FFFFFC',line:'#CFCDB8',cL:'#7A8F3C',cR:'#C27C3A'}},
  {n:'모노',        c:{page:'#E3E3E3',bg:'#F5F5F5',dotc:'#E2E2E2',ink:'#1E1E1E',sub:'#4A4A4A',mute:'#8A8A8A',act:'#8A8A8A',card:'#FFFFFF',line:'#C8C8C8',cL:'#1E1E1E',cR:'#6E6E6E'}},
  {n:'미드나잇',    c:{page:'#070A12',bg:'#101626',dotc:'#1E2638',ink:'#E3E8F4',sub:'#AEB7CC',mute:'#6F7A94',act:'#8590AA',card:'#172036',line:'#2E3A55',cL:'#6AD5FF',cR:'#FF8FB8'}},
  {n:'오션 딥',     c:{page:'#07161C',bg:'#0E2129',dotc:'#1B333D',ink:'#E0F0F4',sub:'#A6C3CB',mute:'#6D8D97',act:'#7F9EA8',card:'#132B35',line:'#2A4A56',cL:'#4FE3C1',cR:'#7AA8FF'}},
  {n:'블러드 문',   c:{page:'#0E0909',bg:'#1A1212',dotc:'#2C1E1E',ink:'#EFE4E4',sub:'#C2AFAF',mute:'#8A7474',act:'#9A8585',card:'#231818',line:'#4A3434',cL:'#FF5A5F',cR:'#E3B04B'}},
  {n:'차콜',        c:{page:'#0F0F0F',bg:'#1B1B1B',dotc:'#2A2A2A',ink:'#EDEDED',sub:'#BDBDBD',mute:'#7E7E7E',act:'#8E8E8E',card:'#222222',line:'#3D3D3D',cL:'#FFFFFF',cR:'#9E9E9E'}}
];
const SIZES = {'1:1':[1080,1080], '4:5':[1080,1350], '3:4':[1080,1440], '9:16':[1080,1920], '16:9':[1920,1080]};
const BASE_STYLE = Object.assign({}, PRESETS[0].c, {
  dots:true, fontBody:'Pretendard', fontFrame:'Outfit', ratio:'1:1', va:'center', ta:'left', autofit:true, px2:false,
  fs:24, fw:400, nw:600, lh:1.6, ls:0, w:940, rad:0, ts:1.1, tw:600, hl:.25, pg:0
});
const DEF_STYLE = {
  home:  Object.assign({}, BASE_STYLE, {fs:26, tw:500}),
  chat:  Object.assign({}, BASE_STYLE, {fs:20, ts:1.5, tw:500, lh:1.7, w:900}),
  novel: Object.assign({}, BASE_STYLE, {fs:25, ts:1.05, lh:1.55, ls:-.03, indent:false, dropcap:false, showTag:true})
};
const DEF_SITE = {
  left:'VIBE, 바이브', leftSub:'AERO', right:'BETA, 베타', rightSub:'FULMEN',
  top:'MIGDAL BAVEL · GENESIS 11', footL:'MIGDAL BAVEL', footR:'ETERNAL, UNTIL RUIN.', ruin:'RUIN · 32.5364° N',
  hybris:'87.4%', showEdit:true,
  homeTitle:'MIGDAL BAVEL', homeSub:'소개 문구',
  chatDesc:'대화 그대로. 말풍선으로 남긴 발췌.', novelDesc:'문장으로 다시 쓴 장면들. 소설 형식의 발췌.'
};

/* ------------------------------------------------------------------ data */
let seed = {};
try { seed = JSON.parse($('seed').textContent); } catch(e){ seed = {}; }
let local = null;
try { local = JSON.parse(localStorage.getItem(KEY)); } catch(e){}
let data = clone((local && (local.savedAt||0) >= (seed.savedAt||0)) ? local : seed);
const LOCKABLE = ['genre','chara','maker','tag','hybris'];
const DEF_TPL = {
  home:  {},
  chat:  {title:'제목', sub:'', genre:'장르', chara:'캐릭터', maker:'제작자', tag:'ETERNAL', hybris:'87.4%', log:'N: 나레이션\nVIBE: 대사\nBETA: 대사'},
  novel: {title:'제목', sub:'부제', genre:'장르', chara:'캐릭터', maker:'제작자', tag:'ETERNAL', hybris:'87.4%', log:'본문'}
};
function normalize(){
  data.tpl  = Object.assign({}, DEF_TPL[MODE], data.tpl || {});
  data.lock = Object.assign({}, data.lock || {});
  /* 다른 페이지(CHAT/NOVEL)에서 보내온 템플릿이 있으면 적용 */
  try{ const pk = 'migdal-bavel-tplpush-' + MODE, push = JSON.parse(localStorage.getItem(pk));
    if(push){ LOCKABLE.forEach(k => { if(k in push.tpl) data.tpl[k] = push.tpl[k]; data.lock[k] = !!push.lock[k]; }); localStorage.removeItem(pk); data._pushed = 1; } }catch(e){}
  (data.items || []).forEach(it => {
    if(it.genre == null && it.source != null){ it.genre = it.source; }
    if(it.maker == null && it.author != null){ it.maker = it.author; }
    delete it.source; delete it.author;
    if(it.chara == null) it.chara = '';
  });
  data.site  = Object.assign({}, DEF_SITE, data.site || {});
  data.style = Object.assign({}, DEF_STYLE[MODE], data.style || {});
  if(!SIZES[data.style.ratio]) data.style.ratio = '1:1';
  if(!Array.isArray(data.items)) data.items = [];
}
normalize();
let idx = 0;
function save(){ delete data._pushed; data.savedAt = Date.now(); try{ localStorage.setItem(KEY, JSON.stringify(data)); }catch(e){} }
if(data._pushed) save();
/* 고정(잠금)된 항목은 템플릿 값을, 아니면 판의 값을 씀 */
const val = (it, k) => String((LOCKABLE.includes(k) && data.lock[k]) ? (data.tpl[k] || '') : ((it && it[k]) || ''));
const newItem = () => { const t = data.tpl; return {title:t.title||'', sub:t.sub||'', tag:t.tag||'', hybris:t.hybris||'', genre:t.genre||'', chara:t.chara||'', maker:t.maker||'', log:t.log||''}; };

/* ------------------------------------------------------------------ svg bits */
const SP = (c, s=20) => `<svg width="${s}" height="${s}" viewBox="-10 -10 20 20"><path d="M0-10Q0 0 10 0Q0 0 0 10Q0 0-10 0Q0 0 0-10Z" style="fill:${c}"/></svg>`;
const TOWER_P = `<path d="M10 46H40M12 38.8L10 46M38 38.8L40 46"/><path d="M12 45L37 40.3" stroke-width=".9" opacity=".6"/><path d="M12 38.8H38M14 31.6L12 38.8M36 31.6L38 38.8"/><path d="M14 37.8L35 33.1" stroke-width=".9" opacity=".6"/><path d="M14 31.6H36M16 24.4L14 31.6M34 24.4L36 31.6"/><path d="M16 30.6L33 25.9" stroke-width=".9" opacity=".6"/><path d="M16 24.4H34M18 17.2L16 24.4M32 17.2L34 24.4"/><path d="M18 23.4L31 18.7" stroke-width=".9" opacity=".6"/><path d="M18 17.2H32M20 10L18 17.2M30 10L32 17.2"/><path d="M20 16.2L29 11.5" stroke-width=".9" opacity=".6"/><path d="M20 10L25 4.5L30 10"/>`;
const TOWER = sz => `<svg width="${sz}" height="${sz}" viewBox="0 0 50 50" fill="none" style="stroke:var(--ink)" stroke-width="1.5" stroke-linejoin="round">${TOWER_P}</svg>`;
/* 육각형 + 탑을 한 장의 SVG로: 탑 외곽(10~40, 4.5~46)의 중심을 육각형 중심(30,30)에 정확히 맞춤 */
const EMBLEM = `<svg width="72" height="72" viewBox="0 0 60 60" fill="none"><path d="M30 3L53.4 16.5V43.5L30 57L6.6 43.5V16.5Z" style="stroke:var(--mute);fill:var(--card)" stroke-width="1.6"/><path d="M30 8L49 19V41L30 52L11 41V19Z" style="stroke:var(--line)" stroke-width="1" opacity=".7"/><g transform="translate(13.333 13.167) scale(.6667)" style="stroke:var(--ink)" stroke-width="1.5" stroke-linejoin="round">${TOWER_P}</g></svg>`;
const PLUS = `<svg width="16" height="16" viewBox="0 0 14 14"><path d="M7 1V13M1 7H13" style="stroke:var(--mute)" stroke-width="1.3"/></svg>`;
const BAR = (() => { const r=[[0,1],[3,2],[6,1],[10,3],[15,1],[17,1],[20,2],[23,1],[26,2],[29,1],[33,3],[38,1],[40,1],[43,2],[46,1],[49,2],[52,1],[56,3],[61,1],[63,1]];
  return `<svg width="64" height="14" viewBox="0 0 64 14" style="fill:var(--mute)">${r.map(x=>`<rect x="${x[0]}" width="${x[1]}" height="14"/>`).join('')}</svg>`; })();
const MOONS = [
  'M7 1.5A5.5 5.5 0 0 0 7 12.5A3 5.5 0 0 1 7 1.5Z','M7 1.5A5.5 5.5 0 0 0 7 12.5Z',null,'M7 1.5A5.5 5.5 0 0 1 7 12.5Z','M7 1.5A5.5 5.5 0 0 1 7 12.5A3 5.5 0 0 0 7 1.5Z'
].map(d => `<svg class="mp" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" style="stroke:var(--mute)" stroke-width="1.2"/>${d?`<path d="${d}" style="fill:var(--mute)"/>`:`<circle cx="7" cy="7" r="5.5" style="fill:var(--mute)"/>`}</svg>`).join('');
const WAVE = (() => {
  const a=[[3,.55],[9,.68],[17,.8],[22,.9],[20,.97],[12,1],[7,.99],[20,.94],[30,.85],[31,.74],[23,.61],[9,.62],[11,.75],[22,.86],[25,.94],[22,.99],[13,1]];
  const b=[[4,.97],[8,.9],[13,.8],[17,.68],[18,.56],[12,.69],[4,.81],[18,.91],[28,.97],[30,1],[24,.99],[11,.93],[9,.85],[22,.74],[28,.61],[25,.63],[17,.76]];
  return a.map((w,i)=>`<i style="height:${w[0]}px;background:var(--L);opacity:${w[1]};animation-delay:${-i*.15}s"></i>`).join('') +
         b.map((w,i)=>`<i style="height:${w[0]}px;background:var(--R);opacity:${w[1]};animation-delay:${-(i+17)*.15}s"></i>`).join('');
})();
const COMPASS = `<svg width="44" height="44" viewBox="-30 -30 60 60" fill="none"><circle r="27" style="stroke:var(--line)" stroke-width="1.2"/><circle r="20" style="stroke:var(--line)" stroke-width="1" opacity=".6"/><path d="M0-26 3-3 26 0 3 3 0 26-3 3-26 0-3-3Z" style="fill:var(--card);stroke:var(--ink)" stroke-width="1.2"/><path d="M0-26 3-3 0 0-3-3Z" style="fill:var(--ink)"/></svg>`;
const CHEV = d => `<svg width="12" height="12" viewBox="0 0 12 12"><path d="${d}" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>`;
const STAR = SP('var(--mute)', 14);

/* ------------------------------------------------------------------ frame (= 판) */
function buildPage(){
  const other = MODE === 'chat' ? ['novel.html','NOVEL'] : ['chat.html','CHAT'];
  const tools = MODE === 'home'
    ? `<button class="tb" id="liveBtn">✎ 직접 편집</button><button class="tb" id="editBtn">EDIT</button><button class="tb dark" id="pngBtn">PNG 저장</button>`
    : `<button class="tb round" id="prev" aria-label="이전">${CHEV('M7.5 2L3.5 6L7.5 10')}</button>
       <span class="list"><button class="tb cnt" id="cnt"></button><div class="menu" id="menu"></div></span>
       <button class="tb round" id="next" aria-label="다음">${CHEV('M4.5 2L8.5 6L4.5 10')}</button>
       <span class="sep"></span>
       <button class="tb" id="liveBtn">✎ 직접 편집</button>
       <button class="tb" id="editBtn">EDIT</button>
       <button class="tb dark" id="pngBtn">PNG 저장</button>
       <span class="sep"></span>
       <a class="tb" href="index.html">HOME</a>
       <a class="tb" href="${other[0]}">${other[1]} →</a>`;
  document.body.insertAdjacentHTML('afterbegin', `
<div class="view" id="view"><div class="holder" id="holder"><div class="board" id="board">
  <div class="row tp"><span class="dot" style="background:var(--L)"></span><span class="b" id="hL" data-lbl style="font-size:28px;color:var(--L)"></span><span class="m lbl" id="hLs" data-lbl></span><span class="ln"></span><span style="width:76px;flex:none"></span><span class="ln"></span><span class="m lbl" id="hRs" data-lbl></span><span class="b" id="hR" data-lbl style="font-size:28px;color:var(--R)"></span><span class="dot" style="background:var(--R)"></span></div>
  <a class="ab emb" href="index.html" title="HOME">${EMBLEM}</a>
  <div class="row tp2">${PLUS}<span class="m lbl" id="topLabel" data-lbl></span>${BAR}<span class="mid"></span>${BAR}<span class="m lbl" id="noLabel"></span>${PLUS}</div>
  <div class="stage" id="stage"><div class="content" id="content"></div></div>
  <div class="g3 bt2"><div class="cl"><span class="ic">${SP('var(--L)')}</span><span class="m lbl" id="ruin" data-lbl></span></div><div class="cc"><span style="display:inline-block;transform:scale(1.35)"><span style="display:inline-flex;gap:8px">${MOONS}</span></span></div><div class="cr"><span class="m lbl">HYBRIS <b id="hyb" data-lbl style="color:var(--R);font-weight:600;font-size:20px"></b></span><span class="ic">${SP('var(--R)')}</span></div></div>
  <div class="g3 bt"><div class="cl"><span class="ic">${COMPASS}</span><span class="m lbl" id="footL" data-lbl style="font-size:18px;color:var(--ink)"></span><span class="ln"></span></div><div class="cc"><span class="wave" style="display:inline-flex;align-items:center;gap:3px;height:32px">${WAVE}</span></div><div class="cr"><span class="ln"></span><span class="m lbl" id="footR" data-lbl style="font-size:18px;color:var(--ink)"></span><span class="ic">${TOWER(30)}</span></div></div>
</div></div></div>
<div class="bar" id="bar">${tools}</div>
<div class="scrim" id="scrim"></div>
<aside class="panel" id="panel" aria-hidden="true"></aside>
<div class="shot" id="shot"><img id="shotImg" alt=""><p>저장이 안 되면 이미지를 길게 누르거나 우클릭해서 저장하세요.</p><div class="btns"><a class="btn pri" id="shotDl" download>다운로드</a><button class="btn" id="shotClose">닫기</button></div></div>
<div class="toast" id="toast"></div>
<div class="livehint">직접 편집 중 — 글자를 클릭해서 쓰고, 드래그하면 서식 툴바가 떠요</div>
${fbarHTML()}`);
}

/* ------------------------------------------------------------------ style */
function applyStyle(){
  const s = data.style, r = document.documentElement.style;
  const fb = fontBy('ko', s.fontBody), fe = fontBy('en', s.fontFrame);
  loadFont(fb); loadFont(fe);
  ['page','bg','dotc','ink','sub','mute','act','card','line'].forEach(k => r.setProperty('--' + k, s[k]));
  r.setProperty('--L', s.cL); r.setProperty('--R', s.cR);
  r.setProperty('--fb', fb.s); r.setProperty('--ff', fe.s + ',' + fb.s);
  r.setProperty('--fw', s.fw); r.setProperty('--nw', s.nw); r.setProperty('--lh', s.lh); r.setProperty('--ls', s.ls + 'em');
  r.setProperty('--w', s.w + 'px'); r.setProperty('--rad', s.rad + 'px'); r.setProperty('--ts', s.ts); r.setProperty('--tw', s.tw);
  r.setProperty('--hl', s.hl); r.setProperty('--pg', s.pg + 'em');
  r.setProperty('--va', s.va === 'top' ? 'flex-start' : s.va === 'bottom' ? 'flex-end' : 'center');
  r.setProperty('--ta', s.ta); r.setProperty('--srcj', s.ta === 'center' ? 'center' : 'flex-start');
  const [W,H] = SIZES[s.ratio]; r.setProperty('--bw', W + 'px'); r.setProperty('--bh', H + 'px');
  $('board').classList.toggle('nodots', !s.dots);
  layout(); fit();
}
function layout(){
  const [W,H] = SIZES[data.style.ratio];
  const ed = $('panel') && $('panel').classList.contains('on') && wide();
  $('view').style.right = $('bar').style.right = ed ? '450px' : '0';
  const vw = window.innerWidth - (ed ? 450 : 0) - 32, vh = window.innerHeight - 64 - 24;
  const s = Math.max(.1, Math.min(vw / W, vh / H, 1));
  $('holder').style.width = W * s + 'px'; $('holder').style.height = H * s + 'px';
  $('board').style.transform = `scale(${s})`;
}
/* 글이 판보다 길면 글자 크기를 자동으로 줄여서 맞춤 */
let overflow = false;
function fit(){
  const st = $('stage'), c = $('content'); if(!st || !c) return;
  const base = +data.style.fs; let f = base; c.style.fontSize = f + 'px';
  if(data.style.autofit){ let g = 0; while(c.scrollHeight > st.clientHeight + 1 && f > base * .4 && g++ < 80){ f -= .5; c.style.fontSize = f + 'px'; } }
  overflow = c.scrollHeight > st.clientHeight + 1;
  const w = $('warn'); if(w){ w.classList.toggle('on', overflow || f < base - .01); w.textContent = overflow ? '글이 판에 다 안 들어가요. 본문을 줄이거나 발췌를 나눠주세요.' : `판에 맞추려고 글자를 ${base}px → ${f}px 로 줄였어요.`; }
}

/* ------------------------------------------------------------------ text */
const names = str => String(str||'').split(',').map(x => x.trim()).filter(Boolean);
const first = str => names(str)[0] || '';
function fmt(s){
  s = String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  s = s.replace(/==(.+?)==/g, '<mark>$1</mark>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  s = s.replace(/"([^"]+)"|“([^”]+)”/g, (m,a,b) => `<span class="q">“${a!==undefined?a:b}”</span>`);
  return s;
}
function speakerOf(key){
  const k = key.trim().toLowerCase();
  if(k==='l' || names(data.site.left).map(x=>x.toLowerCase()).includes(k)) return 'L';
  if(k==='r' || names(data.site.right).map(x=>x.toLowerCase()).includes(k)) return 'R';
  if(['n','나레이션','내레이션','narration','지문'].includes(k)) return 'N';
  return null;
}
const PREFIX = /^([^:：*]{1,24}?)\s*[:：]\s*(.*)$/;
const HR = /^(-{3,}|={3,}|\*{3,}|◇+|◆+)$/;
function parseChat(text){
  const out = []; let cur = null;
  for(const raw of String(text||'').split(/\r?\n/)){
    const line = raw.trim(); if(!line) continue;
    if(HR.test(line)){ out.push({t:'hr'}); cur = null; continue; }
    const m = line.match(PREFIX);
    if(m){ const who = speakerOf(m[1]); if(who){ cur = {t:who, p: m[2] ? [m[2]] : []}; out.push(cur); continue; } }
    if(cur) cur.p.push(line); else { cur = {t:'N', p:[line]}; out.push(cur); }
  }
  return out.filter(b => b.t==='hr' || b.p.length);
}
function parseNovel(text){
  const out = [];
  for(const raw of String(text||'').split(/\r?\n/)){
    const line = raw.trim();
    if(!line){ if(out.length && out[out.length-1].t !== 'gap') out.push({t:'gap'}); continue; }
    if(HR.test(line)){ out.push({t:'hr'}); continue; }
    const h = line.match(/^#{1,3}\s+(.*)$/); if(h){ out.push({t:'h', x:h[1]}); continue; }
    const m = line.match(PREFIX);
    if(m){ const who = speakerOf(m[1]); if(who){ if(m[2]) out.push({t:'p', who: who==='N'?null:who, x:m[2]}); continue; } }
    out.push({t:'p', who:null, x:line});
  }
  while(out.length && out[out.length-1].t === 'gap') out.pop();
  return out;
}
function srcLine(it){
  const g = val(it,'genre'), c = val(it,'chara'), m = val(it,'maker');
  if(!g && !c && !m) return '';
  const ce = k => data.lock[k] ? ' contenteditable="false"' : '';
  return `<div class="src fade"><span class="dash"></span>${g?`<span class="a g"${ce('genre')}>${esc(g)}</span>`:''}${g&&c?'<span class="sl">/</span>':''}${c?`<span class="c"${ce('chara')}>${esc(c)}</span>`:''}${(g||c)&&m?'<span class="vb"></span>':''}${m?`<span class="mk"${ce('maker')}>${esc(m)}</span>`:''}</div>`;
}

function refreshSrc(it){
  const c = $('content'), old = c.querySelector('.src'), fresh = srcLine(it).replace('src fade', 'src');
  if(old){ if(fresh) old.outerHTML = fresh; else old.remove(); }
  else if(fresh){ (c.querySelector('.body') ? c : c).insertAdjacentHTML('beforeend', fresh); }
  it.html = c.innerHTML;
}
/* ------------------------------------------------------------------ render */
function updateFrame(){
  const S = data.site, it = data.items[idx];
  const T = (id, v) => { const el = $(id); if(el !== document.activeElement) el.textContent = v; };
  T('hL', first(S.left)); T('hR', first(S.right)); T('hLs', S.leftSub); T('hRs', S.rightSub);
  T('topLabel', S.top); T('footL', S.footL); T('footR', S.footR); T('ruin', S.ruin);
  if(MODE === 'home'){
    $('noLabel').textContent = 'INDEX · ARCHIVE';
    T('hyb', S.hybris);
    document.querySelectorAll('.mp').forEach((el,i) => el.classList.toggle('on', i===2));
  } else {
    $('noLabel').textContent = `NO. ${pad(idx+1)}` + (val(it,'tag') ? ' · ' + val(it,'tag') : '');
    T('hyb', val(it,'hybris') || S.hybris);
    document.querySelectorAll('.mp').forEach((el,i) => el.classList.toggle('on', i === idx % 5));
    $('prev').disabled = idx <= 0; $('next').disabled = idx >= data.items.length - 1;
    $('cnt').innerHTML = `<b>${pad(Math.min(idx+1, data.items.length))}</b>&nbsp;/&nbsp;${pad(data.items.length)}`;
    $('menu').innerHTML = data.items.map((x,i) => `<button data-i="${i}" class="${i===idx?'cur':''}"><span class="n">NO. ${pad(i+1)}</span><span class="t">${esc(x.title||'(제목 없음)')}</span></button>`).join('');
  }
  const canEdit = S.showEdit || location.hash === '#edit';
  $('editBtn').style.display = $('liveBtn').style.display = canEdit ? '' : 'none';
  if(!canEdit && live) setLive(false);
  document.title = MODE === 'home' ? S.homeTitle : `${S.homeTitle} · ${MODE === 'chat' ? 'CHAT' : 'NOVEL'}`;
}

function render(){
  if(idx >= data.items.length) idx = data.items.length - 1;
  if(idx < 0) idx = 0;
  updateFrame();
  const S = data.site, st = data.style, it = data.items[idx], c = $('content');
  let d = 0; const del = () => `style="animation-delay:${Math.min(d++ * .05, 1).toFixed(2)}s"`;
  let cls = 'content', html = '';

  if(MODE === 'home'){
    cls += ' home';
    html = `<div class="k fade" ${del()}>ARCHIVE · ${esc(S.top)}</div>
      <h1 class="fade" ${del()}>${esc(S.homeTitle)}</h1>
      <div class="st fade" ${del()}>${esc(S.homeSub)}</div>
      <div class="doors">
        <a class="door L fade" ${del()} href="chat.html"><span class="art">${SP('var(--L)')}</span><div class="m">01 · DIALOGUE</div><div class="kk">CHAT</div><p>${esc(S.chatDesc)}</p><div class="go"><span class="m">ENTER</span><span class="ln"></span>${CHEV('M4.5 2L8.5 6L4.5 10')}</div></a>
        <a class="door R fade" ${del()} href="novel.html"><span class="art">${SP('var(--R)')}</span><div class="m">02 · PROSE</div><div class="kk">NOVEL</div><p>${esc(S.novelDesc)}</p><div class="go"><span class="m">ENTER</span><span class="ln"></span>${CHEV('M4.5 2L8.5 6L4.5 10')}</div></a>
      </div>`;
  } else if(!it){
    html = `<div class="empty">발췌가 아직 없어요.<br>EDIT → 내용 → + 새 발췌</div>`;
  } else if(typeof it.html === 'string'){
    cls += MODE === 'chat' ? ' ch' : ' nv' + (st.indent ? ' indent' : '') + (st.dropcap ? ' dropcap' : '') + (st.showTag ? '' : ' notag');
    html = it.html;
  } else if(MODE === 'chat'){
    cls += ' ch';
    const blocks = parseChat(it.log), Ln = first(S.left), Rn = first(S.right);
    html = `<div class="exh fade"><div class="k">EXCERPT · NO. ${pad(idx+1)}${val(it,'tag') ? ' · ' + esc(val(it,'tag')) : ''}</div>${it.title?`<div class="tt">${esc(it.title)}</div>`:''}${it.sub?`<div class="st">${esc(it.sub)}</div>`:''}</div>` +
      blocks.map(b => {
        if(b.t === 'hr') return `<div class="hr fade" ${del()}><span class="ln"></span>${STAR}<span class="ln"></span></div>`;
        const ps = b.p.map(p => `<p>${fmt(p)}</p>`).join('');
        if(b.t === 'N') return `<div class="nar fade" ${del()}>${ps}</div>`;
        const nm = b.t==='L' ? Ln : Rn, sub = b.t==='L' ? S.leftSub : S.rightSub;
        return `<div class="msg ${b.t} fade" ${del()}><div class="who"><span class="dot" style="background:var(--${b.t})"></span><b>${esc(nm)}</b><span>${esc(sub)}</span></div><div class="card">${ps}</div></div>`;
      }).join('') + srcLine(it);
  } else {
    cls += ' nv' + (st.indent ? ' indent' : '') + (st.dropcap ? ' dropcap' : '') + (st.showTag ? '' : ' notag');
    const blocks = parseNovel(it.log), Ln = first(S.left), Rn = first(S.right);
    let dropDone = false, afterBreak = true;
    const body = blocks.map(b => {
      if(b.t === 'gap'){ afterBreak = true; return `<div class="gap"></div>`; }
      if(b.t === 'hr'){ afterBreak = true; return `<div class="hr fade" ${del()}><span class="ln"></span>${STAR}<span class="ln"></span></div>`; }
      if(b.t === 'h'){ afterBreak = true; return `<h2 class="fade" ${del()}>${fmt(b.x)}</h2>`; }
      const pc = [];
      if(b.who) pc.push('sp', b.who);
      else if(!dropDone && st.dropcap){ pc.push('dc'); dropDone = true; }
      if(afterBreak) pc.push('nb0');
      afterBreak = false;
      const tag = b.who ? `<span class="tag">${esc(b.who==='L'?Ln:Rn)}</span>` : '';
      return `<p class="${pc.join(' ')} fade" ${del()}>${tag}${fmt(b.x)}</p>`;
    }).join('');
    html = `${it.title?`<div class="tt fade">${esc(it.title)}</div>`:''}${it.sub?`<div class="st fade">${esc(it.sub)}</div>`:''}<div class="body">${body}</div>${srcLine(it)}`;
  }
  c.className = cls; c.innerHTML = html;
  if(it && typeof it.html === 'string' && MODE !== 'home') refreshSrc(it);
  FONTS.ko.concat(FONTS.en).forEach(f => { if(html.indexOf(f.n) > -1) loadFont(f); });
  hist.length = 0; lastHtml = c.innerHTML;
  c.contentEditable = (live && MODE !== 'home' && it) ? 'true' : 'false';
  hideBar();
  fit();
}

/* ------------------------------------------------------------------ PNG */
function loadScript(src){
  return new Promise((ok, no) => { if(window.htmlToImage) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
}
async function savePNG(){
  const btn = $('pngBtn'); btn.disabled = true; toast('이미지 만드는 중…');
  const b = $('board'), [W,H] = SIZES[data.style.ratio];
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js');
    if(document.fonts && document.fonts.ready) await document.fonts.ready;
    b.classList.add('cap');
    const opt = {width:W, height:H, pixelRatio:data.style.px2 ? 2 : 1, style:{transform:'none'}, cacheBust:true};
    let url;
    try{ url = await htmlToImage.toPng(b, opt); }
    catch(e){ url = await htmlToImage.toPng(b, Object.assign({skipFonts:true}, opt)); }
    const it = data.items[idx];
    const name = `${data.site.homeTitle}_${MODE}${MODE==='home'?'':'_'+pad(idx+1)}${it && it.title ? '_' + it.title : ''}.png`.replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,'_');
    $('shotImg').src = url; $('shotDl').href = url; $('shotDl').setAttribute('download', name);
    $('shot').classList.add('on');
  }catch(e){ toast('이미지를 만들지 못했어요. 잠시 후 다시 해주세요.'); }
  finally{ b.classList.remove('cap'); btn.disabled = false; }
}

/* ------------------------------------------------------------------ panel */
const SLIDERS = [
  ['fs','글자 크기',12,44,.5,'px'],
  ['ts','제목 크기 (본문 대비)',.7,3,.05,'배'],
  ['fw','본문 굵기',100,900,100,''],
  ['tw','제목 굵기',100,900,100,''],
  ['nw','이름·라벨 굵기',100,900,100,''],
  ['lh','줄 간격',1.2,2.6,.05,''],
  ['ls','자간',-.08,.15,.005,'em'],
  ...(MODE === 'novel' ? [['pg','문단 간격',0,1.5,.05,'em']] : []),
  ['w','본문 폭',400,1800,10,'px'],
  ['rad','모서리 둥글기',0,28,1,'px'],
  ['hl','형광펜 진하기',0,.6,.01,'']
];
const COLORS = [
  ['cL','왼쪽 캐릭터'],['cR','오른쪽 캐릭터'],['bg','판 배경'],['dotc','판 점무늬'],
  ['card', MODE==='chat' ? '말풍선' : '카드·엠블럼'],['ink','본문 글자'],
  ['sub','보조 글자'],['mute','라벨·장식'],['act','*행동* 글자'],['line','선'],['page','판 바깥 배경']
];
const SITE_FIELDS = [
  ['left','왼쪽 이름 (쉼표로 별칭)'],['leftSub','왼쪽 부제'],['right','오른쪽 이름 (쉼표로 별칭)'],['rightSub','오른쪽 부제'],
  ['top','상단 문구'],['ruin','좌표 문구'],['footL','하단 왼쪽'],['footR','하단 오른쪽'],['hybris','기본 HYBRIS 수치'],['homeTitle','사이트 제목']
];
const HOME_FIELDS = [['homeSub','첫 화면 소개 문구'],['chatDesc','CHAT 카드 설명'],['novelDesc','NOVEL 카드 설명']];
const SEGS = [
  ['ratio','판 비율', Object.keys(SIZES).map(k => [k, k])],
  ['va','세로 위치', [['top','위'],['center','가운데'],['bottom','아래']]],
  ...(MODE === 'novel' ? [['ta','정렬', [['left','왼쪽'],['center','가운데'],['justify','양쪽']]]] : [])
];
const HELP = {
  chat: `<code>VIBE: 대사</code> 왼쪽 말풍선 · <code>BETA: 대사</code> 오른쪽 · <code>N: 문장</code> 나레이션<br>
    이름 없이 이어지는 줄은 바로 위 말풍선에 붙어요.<br>
    <code>---</code> 구분선 · <code>*행동*</code> 흐리게 · <code>**굵게**</code> · <code>"대사"</code> · <code>==형광펜==</code>`,
  novel: `쓴 그대로 판에 들어가요. <b>빈 줄</b>을 넣으면 그만큼 띄워져요.<br>
    <code>**실제:**</code> 처럼 별 두 개로 감싸면 굵게 · <code>*행동*</code> 흐리게 · <code>==형광펜==</code><br>
    <code># 소제목</code> · <code>---</code> 구분선 · <code>VIBE: 대사</code> 쓰면 캐릭터 색 줄`
};

function buildPanel(){
  const st = data.style;
  const tabs = (MODE === 'home' ? [] : [['content','내용'],['tpl','템플릿']]).concat([['style','스타일'],['site','사이트'],['save','저장·백업']]);
  const TPL_ROWS = [['genre','장르'],['chara','캐릭터'],['maker','제작자'],['tag','태그 (상단 NO. 옆)'],['hybris','HYBRIS 수치']];
  const other = MODE === 'chat' ? 'NOVEL' : 'CHAT';
  const tplTab = MODE === 'home' ? '' : `
    <div class="tab" data-tab="tpl">
      <div class="sec"><div class="sh">고정 문구</div>
        <div class="help">여기 적은 값은 <b>새 판</b>을 만들 때 자동으로 들어가요.<br><b>고정</b>을 켜면 <b>모든 판</b>이 이 값을 쓰고, 판마다 따로 못 바꿔요. (제작자처럼 늘 같은 건 고정 추천)</div>
        ${TPL_ROWS.map(r => `<div class="tplrow"><label class="f"><span>${r[1]}</span><input type="text" data-tpl="${r[0]}"></label><label class="chk lockchk"><input type="checkbox" data-lock="${r[0]}"> 고정</label></div>`).join('')}
      </div>
      <div class="sec"><div class="sh">새 판 기본 내용</div>
        <div class="two"><label class="f"><span>기본 제목</span><input type="text" data-tpl="title"></label><label class="f"><span>기본 부제</span><input type="text" data-tpl="sub"></label></div>
        <label class="f"><span>기본 본문</span><textarea data-tpl="log" style="min-height:140px" spellcheck="false"></textarea></label>
        <div class="btns"><button class="btn" id="tplFromBtn">지금 판을 템플릿으로 저장</button><button class="btn" id="tplToBtn">템플릿을 지금 판에 적용</button></div>
      </div>
      <div class="sec"><div class="sh">다른 페이지</div>
        <div class="help">장르·캐릭터·제작자·태그·HYBRIS 값과 고정 여부를 ${other} 페이지에도 똑같이 보내요. ${other} 페이지를 열면 적용돼요.</div>
        <div class="btns"><button class="btn" id="tplPushBtn">${other}에도 적용</button></div>
      </div>
    </div>`;
  const fontOpts = (kind, cur) => FONTS[kind].map(f => `<option ${f.n===cur?'selected':''}>${f.n}</option>`).join('');
  const content = MODE === 'home' ? '' : `
    <div class="tab" data-tab="content">
      <div class="sec"><div class="sh">이 판</div>
        <div class="two"><label class="f"><span>제목</span><input type="text" data-item="title"></label>
        <label class="f"><span>부제</span><input type="text" data-item="sub"></label>
        <label class="f"><span>태그 (상단 NO. 옆)</span><input type="text" data-item="tag"></label>
        <label class="f"><span>HYBRIS 수치</span><input type="text" data-item="hybris"></label>
        <label class="f"><span>장르</span><input type="text" data-item="genre"></label>
        <label class="f"><span>캐릭터</span><input type="text" data-item="chara"></label>
        <label class="f"><span>제작자</span><input type="text" data-item="maker"></label></div>
        <div class="help" style="margin-top:-2px">판 아래에 <code>— 장르 / 캐릭터 | 제작자</code> 로 들어가요. 매번 같은 값이면 <b>템플릿</b> 탭에서 고정하세요.</div>
        <div class="help">${HELP[MODE]}</div>
        <div class="warn" id="warn"></div>
        <div class="help rich" id="richNote">이 판은 <b>판에서 직접 꾸민 서식</b>이 있어서 본문 칸이 잠겨 있어요.<br>본문 칸으로 다시 쓰고 싶으면 아래 버튼을 눌러주세요. 직접 꾸민 서식과 판에서 고친 글은 사라지고, 본문 칸 내용으로 다시 그려져요.<div class="btns" style="margin-top:8px"><button class="btn del" id="unrichBtn">직접 편집 서식 지우기</button></div></div>
        <label class="f"><span>본문</span><textarea data-item="log" spellcheck="false"></textarea></label>
        <div class="btns"><button class="btn pri" id="addBtn">+ 새 판</button><button class="btn" id="dupBtn">이 판 복제</button><button class="btn" id="upBtn">앞으로</button><button class="btn" id="downBtn">뒤로</button><button class="btn del" id="delBtn">삭제</button></div>
      </div>
    </div>`;
  $('panel').innerHTML = `
    <div class="ph"><span class="t">EDIT · ${MODE.toUpperCase()}</span><button class="x" id="closeBtn" aria-label="닫기">${CHEV('M2 2L10 10M10 2L2 10')}</button></div>
    <div class="tabs">${tabs.map((t,i) => `<button data-go="${t[0]}" class="${i===0?'on':''}">${t[1]}</button>`).join('')}</div>
    <div class="pb">
      ${content}
      ${tplTab}
      <div class="tab" data-tab="style">
        <div class="sec"><div class="sh">판</div>
          ${SEGS.map(s => `<div class="f"><span>${s[1]}</span><div class="seg" data-seg="${s[0]}">${s[2].map(o => `<button data-v="${o[0]}">${o[1]}</button>`).join('')}</div></div>`).join('')}
          <label class="chk"><input type="checkbox" data-style="autofit"> 글이 길면 판에 맞게 글자 자동 축소</label>
        </div>
        <div class="sec"><div class="sh">색 테마</div>
          <div class="presets">${PRESETS.map((p,i) => `<button class="pre" data-pre="${i}"><span class="sw"><i style="background:${p.c.bg}"></i><i style="background:${p.c.card}"></i><i style="background:${p.c.cL}"></i><i style="background:${p.c.cR}"></i><i style="background:${p.c.ink}"></i></span>${p.n}</button>`).join('')}</div>
        </div>
        <div class="sec"><div class="sh">색 하나씩</div>
          <div class="colors">${COLORS.map(c => `<label class="cl-in"><input type="color" data-style="${c[0]}">${c[1]}<code data-hex="${c[0]}"></code></label>`).join('')}</div>
          <label class="chk"><input type="checkbox" data-style="dots"> 판 점무늬</label>
        </div>
        <div class="sec"><div class="sh">폰트</div>
          <label class="f"><span>본문 (한글)</span><select data-style="fontBody">${fontOpts('ko', st.fontBody)}</select></label>
          <label class="f"><span>프레임·라벨 (영문)</span><select data-style="fontFrame">${fontOpts('en', st.fontFrame)}</select></label>
        </div>
        <div class="sec"><div class="sh">크기·굵기</div>
          ${SLIDERS.map(s => `<label class="f"><span>${s[1]}<output data-out="${s[0]}"></output></span><input type="range" data-style="${s[0]}" min="${s[2]}" max="${s[3]}" step="${s[4]}"></label>`).join('')}
          <div class="help" style="margin-top:4px">폰트마다 들어 있는 굵기가 달라서, 어떤 폰트는 몇 단계에서만 굵기가 바뀌어요.</div>
          ${MODE === 'novel' ? `
          <label class="chk"><input type="checkbox" data-style="indent"> 문단 첫 줄 들여쓰기</label>
          <label class="chk"><input type="checkbox" data-style="dropcap"> 첫 글자 크게 (드롭캡)</label>
          <label class="chk"><input type="checkbox" data-style="showTag"> 대사 문단에 이름 표시</label>` : ''}
          <div class="btns" style="margin-top:12px"><button class="btn del" id="styleReset">스타일만 기본값으로</button></div>
        </div>
      </div>
      <div class="tab" data-tab="site">
        <div class="sec"><div class="sh">이름·문구</div>
          <div class="two">${SITE_FIELDS.map(f => `<label class="f"><span>${f[1]}</span><input type="text" data-site="${f[0]}"></label>`).join('')}</div>
          ${MODE === 'home' ? HOME_FIELDS.map(f => `<label class="f"><span>${f[1]}</span><input type="text" data-site="${f[0]}"></label>`).join('') : ''}
          <label class="chk"><input type="checkbox" data-site="showEdit"> 방문자에게도 EDIT 버튼 보이기</label>
          <div class="help">끄면 EDIT 버튼이 숨어요. 주소 끝에 <code>#edit</code>를 붙여 들어오면 다시 보여요.</div>
        </div>
      </div>
      <div class="tab" data-tab="save">
        <div class="sec"><div class="sh">PNG</div>
          <label class="chk"><input type="checkbox" data-style="px2"> 2배 해상도로 저장 (더 선명, 파일 큼)</label>
          <div class="btns"><button class="btn pri" id="pngBtn2">지금 판 PNG 저장</button></div>
        </div>
        <div class="sec"><div class="sh">깃허브에 올리기</div>
          <div class="help">편집한 내용은 <b>지금 이 브라우저에만</b> 저장돼요. 방문자에게도 보이게 하려면:<br>
            ① <b>HTML 파일로 저장</b> → <code>${MODE==='home'?'index':MODE}.html</code> 다운로드<br>
            ② 깃허브 저장소의 같은 이름 파일을 이걸로 덮어쓰기 (Add file → Upload files)</div>
          <div class="btns"><button class="btn pri" id="dlBtn">HTML 파일로 저장</button><button class="btn" id="cpHtmlBtn">HTML 코드 복사</button></div>
        </div>
        <div class="sec"><div class="sh">백업</div>
          <div class="btns" style="margin-bottom:10px"><button class="btn" id="copyBtn">백업 복사</button><button class="btn" id="loadBtn">붙여넣은 백업 불러오기</button><button class="btn del" id="resetBtn">파일 내용으로 되돌리기</button></div>
          <label class="f"><span>백업 JSON</span><textarea id="iJson" style="min-height:120px" spellcheck="false" placeholder="여기에 백업을 붙여넣고 ‘불러오기’"></textarea></label>
        </div>
      </div>
    </div>`;
  $('panel').querySelector('.tab').classList.add('on');
  wirePanel();
}

function fillPanel(){
  const P = $('panel'), it = data.items[idx] || {}, st = data.style, S = data.site;
  P.querySelectorAll('[data-item]').forEach(el => {
    const k = el.dataset.item, locked = LOCKABLE.includes(k) && data.lock[k];
    if(document.activeElement !== el) el.value = locked ? (data.tpl[k] || '') : (it[k] || '');
    el.disabled = locked; el.title = locked ? '템플릿에 고정됨 — 템플릿 탭에서 바꿀 수 있어요' : '';
    const lab = el.previousElementSibling; if(lab) lab.dataset.lock = locked ? '🔒 고정' : '';
  });
  P.querySelectorAll('[data-tpl]').forEach(el => { if(document.activeElement !== el) el.value = data.tpl[el.dataset.tpl] || ''; });
  P.querySelectorAll('[data-lock]').forEach(el => el.checked = !!data.lock[el.dataset.lock]);
  const rich = typeof it.html === 'string';
  if($('richNote')){ $('richNote').classList.toggle('on', rich); P.querySelector('[data-item=log]').disabled = rich; P.querySelector('[data-item=log]').style.opacity = rich ? .45 : 1; }
  P.querySelectorAll('[data-style]').forEach(el => { const k = el.dataset.style; if(el.type === 'checkbox') el.checked = !!st[k]; else if(document.activeElement !== el) el.value = st[k]; });
  P.querySelectorAll('[data-hex]').forEach(el => el.textContent = String(st[el.dataset.hex]).toUpperCase());
  P.querySelectorAll('[data-out]').forEach(el => { const s = SLIDERS.find(x => x[0]===el.dataset.out); el.textContent = (+st[s[0]]).toString() + s[5]; });
  P.querySelectorAll('[data-seg]').forEach(g => g.querySelectorAll('button').forEach(b => b.classList.toggle('on', String(st[g.dataset.seg]) === b.dataset.v)));
  P.querySelectorAll('[data-site]').forEach(el => { const k = el.dataset.site; if(el.type === 'checkbox') el.checked = !!S[k]; else if(document.activeElement !== el) el.value = S[k] || ''; });
  fit();
}

function wirePanel(){
  const P = $('panel');
  P.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
    P.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('on', x===b));
    P.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.dataset.tab === b.dataset.go));
  });
  P.querySelectorAll('[data-item]').forEach(el => el.addEventListener('input', () => {
    const it = data.items[idx]; if(!it) return; const k = el.dataset.item; it[k] = el.value;
    if(typeof it.html === 'string'){
      const sel = {title:'.tt', sub:'.st'}[k], node = sel && $('content').querySelector(sel);
      if(node){ node.textContent = el.value; it.html = $('content').innerHTML; }
      if(['genre','chara','maker'].includes(k)) refreshSrc(it);
      lastHtml = it.html;
      save(); updateFrame(); fit(); return;
    }
    save(); render();
  }));
  P.querySelectorAll('[data-tpl]').forEach(el => el.addEventListener('input', () => {
    data.tpl[el.dataset.tpl] = el.value; save();
    if(data.lock[el.dataset.tpl]) rerenderKeep();
  }));
  P.querySelectorAll('[data-lock]').forEach(el => el.addEventListener('change', () => {
    data.lock[el.dataset.lock] = el.checked; save(); rerenderKeep(); fillPanel();
    toast(el.checked ? '모든 판에 고정했어요' : '고정을 풀었어요 — 판마다 따로 쓸 수 있어요');
  }));
  P.querySelectorAll('[data-style]').forEach(el => el.addEventListener('input', () => {
    const k = el.dataset.style;
    data.style[k] = el.type === 'checkbox' ? el.checked : el.type === 'range' ? +el.value : el.value;
    save(); applyStyle(); fillPanel();
    if(['indent','dropcap','showTag'].includes(k)) render();
  }));
  P.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => {
    data.style[b.parentNode.dataset.seg] = b.dataset.v; save(); applyStyle(); fillPanel();
  });
  P.querySelectorAll('[data-site]').forEach(el => el.addEventListener('input', () => {
    data.site[el.dataset.site] = el.type === 'checkbox' ? el.checked : el.value; save(); render();
  }));
  P.querySelectorAll('[data-pre]').forEach(b => b.onclick = () => { Object.assign(data.style, PRESETS[+b.dataset.pre].c); save(); applyStyle(); fillPanel(); });
  $('closeBtn').onclick = () => openPanel(false);
  $('pngBtn2').onclick = savePNG;
  confirmBtn($('styleReset'), '한 번 더 누르면 되돌려요', () => { data.style = Object.assign({}, DEF_STYLE[MODE]); save(); applyStyle(); render(); fillPanel(); toast('스타일을 기본값으로 되돌렸어요'); });

  if(MODE !== 'home'){
    $('addBtn').onclick = () => { data.items.push(newItem()); save(); go(data.items.length-1); P.querySelector('[data-item=log]').focus(); };
    $('tplFromBtn').onclick = () => { const it = data.items[idx]; if(!it) return; ['title','sub','genre','chara','maker','tag','hybris','log'].forEach(k => { if(!(LOCKABLE.includes(k) && data.lock[k])) data.tpl[k] = it[k] || ''; }); save(); fillPanel(); toast('지금 판을 템플릿으로 저장했어요'); };
    confirmBtn($('tplToBtn'), '한 번 더 누르면 덮어써요', () => { const it = data.items[idx]; if(!it) return; Object.assign(it, newItem()); delete it.html; save(); render(); fillPanel(); toast('템플릿을 지금 판에 적용했어요'); });
    $('tplPushBtn').onclick = () => {
      const t = {}, l = {}; LOCKABLE.forEach(k => { t[k] = data.tpl[k]; l[k] = !!data.lock[k]; });
      try{ localStorage.setItem('migdal-bavel-tplpush-' + (MODE === 'chat' ? 'novel' : 'chat'), JSON.stringify({tpl:t, lock:l})); toast((MODE === 'chat' ? 'NOVEL' : 'CHAT') + ' 페이지를 열면 적용돼요'); }
      catch(e){ toast('이 브라우저에서는 보낼 수 없어요'); }
    };
    $('dupBtn').onclick = () => { if(!data.items[idx]) return; data.items.splice(idx+1, 0, clone(data.items[idx])); save(); go(idx+1); toast('복제했어요'); };
    $('upBtn').onclick = () => move(-1); $('downBtn').onclick = () => move(1);
    confirmBtn($('unrichBtn'), '한 번 더 누르면 지워요', () => { const it = data.items[idx]; if(!it) return; delete it.html; save(); render(); fillPanel(); toast('본문 칸 내용으로 다시 그렸어요'); });
    confirmBtn($('delBtn'), '한 번 더 누르면 삭제', () => { data.items.splice(idx,1); save(); idx = Math.max(0, idx-1); render(); fillPanel(); toast('삭제했어요'); });
  }
  $('dlBtn').onclick = () => {
    try{
      const url = URL.createObjectURL(new Blob([exportHTML()], {type:'text/html'}));
      const a = document.createElement('a'); a.href = url; a.download = (MODE==='home'?'index':MODE) + '.html';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast('다운로드를 시작했어요 — 안 되면 ‘HTML 코드 복사’를 써주세요');
    }catch(e){ toast('여기서는 다운로드가 막혀 있어요. ‘HTML 코드 복사’를 써주세요'); }
  };
  $('cpHtmlBtn').onclick = () => copy(exportHTML(), 'HTML 코드를 복사했어요');
  $('copyBtn').onclick = () => { const j = JSON.stringify(data, null, 2); $('iJson').value = j; copy(j, '백업을 복사했어요'); };
  $('loadBtn').onclick = () => {
    try{ const d = JSON.parse($('iJson').value); if(!d || typeof d !== 'object') throw 0; data = d; normalize(); save(); idx = 0; applyStyle(); render(); fillPanel(); toast('불러왔어요'); }
    catch(e){ toast('백업 형식이 맞지 않아요'); }
  };
  confirmBtn($('resetBtn'), '한 번 더 누르면 되돌려요', () => {
    try{ localStorage.removeItem(KEY); }catch(e){}
    data = clone(seed); normalize(); idx = 0; applyStyle(); render(); fillPanel(); toast('파일에 저장된 내용으로 되돌렸어요');
  });
}

function confirmBtn(btn, armText, fn){
  const orig = btn.textContent;
  btn.onclick = () => {
    if(btn.dataset.arm !== '1'){ btn.dataset.arm = '1'; btn.textContent = armText; setTimeout(() => { btn.dataset.arm=''; btn.textContent = orig; }, 2500); return; }
    btn.dataset.arm = ''; btn.textContent = orig; fn();
  };
}
function copy(text, ok){
  const fallback = () => { $('iJson').value = text; $('iJson').select(); toast('아래 칸에 넣어뒀어요 — 직접 복사해 주세요'); };
  try{ navigator.clipboard.writeText(text).then(() => toast(ok), fallback); }catch(e){ fallback(); }
}
function toast(t){ const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2200); }

function exportHTML(){
  const d = clone(data); d.savedAt = data.savedAt || Date.now();
  const json = JSON.stringify(d, null, 2).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(document.title)}</title>
<link rel="stylesheet" href="assets/babel.css">
</head>
<body data-mode="${MODE}">
<!-- 내용·스타일 데이터. EDIT 패널에서 고친 뒤 ‘HTML 파일로 저장’으로 받으면 편해요. -->
<script type="application/json" id="seed">
${json}
</script>
<script src="assets/babel.js"></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ 판에서 직접 편집 */
let live = false, saved = null, typingT = null, lastHtml = null;
const hist = [];
const SIZE_OPTS = [[.6,'60%'],[.75,'75%'],[.85,'85%'],[1,'100%'],[1.15,'115%'],[1.3,'130%'],[1.5,'150%'],[1.8,'180%'],[2.2,'220%'],[2.8,'280%']];
const ALIGN = d => `<svg width="14" height="12" viewBox="0 0 14 12" stroke="currentColor" stroke-width="1.4"><path d="${d}"/></svg>`;
function fbarHTML(){
  const opt = list => list.map(f => `<option value="${f.n}">${f.n}</option>`).join('');
  const sw = (attr, v, title) => `<button class="sw" ${attr}="${v}" title="${title}" style="background:${v}"></button>`;
  return `<div class="fbar" id="fbar">
    <select id="fbFont" title="폰트"><option value="">폰트</option><optgroup label="한글">${opt(FONTS.ko)}</optgroup><optgroup label="영문">${opt(FONTS.en)}</optgroup></select>
    <select id="fbSize" title="글자 크기"><option value="">크기</option>${SIZE_OPTS.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')}</select>
    <select id="fbWeight" title="굵기"><option value="">굵기</option>${[100,200,300,400,500,600,700,800,900].map(w => `<option>${w}</option>`).join('')}</select>
    <span class="fs"></span>
    <button data-cmd="bold" title="굵게"><b>B</b></button><button data-cmd="italic" title="기울임"><i style="font-family:serif">I</i></button><button data-cmd="underline" title="밑줄"><u>U</u></button><button data-cmd="strike" title="취소선"><s>S</s></button>
    <span class="br"></span>
    <span class="lb">글자색</span>
    ${sw('data-color','var(--ink)','본문 색')}${sw('data-color','var(--L)','왼쪽 캐릭터 색')}${sw('data-color','var(--R)','오른쪽 캐릭터 색')}${sw('data-color','var(--sub)','보조 색')}${sw('data-color','var(--mute)','흐린 색')}${sw('data-color','#E5484D','빨강')}
    <label class="cp" title="직접 고르기"><input type="color" id="fbColor" value="#2EC4B6"></label>
    <span class="fs"></span>
    <span class="lb">형광펜</span>
    ${sw('data-hl','var(--L)','왼쪽 캐릭터 색')}${sw('data-hl','var(--R)','오른쪽 캐릭터 색')}${sw('data-hl','#FFD84D','노랑')}
    <label class="cp" title="직접 고르기"><input type="color" id="fbHl" value="#FFD84D"></label>
    <button class="sw none" data-hl="" title="형광펜 지우기"></button>
    <span class="fs"></span>
    <button data-align="left" title="왼쪽 정렬">${ALIGN('M1 2H13M1 6H9M1 10H11')}</button><button data-align="center" title="가운데 정렬">${ALIGN('M1 2H13M3 6H11M2 10H12')}</button><button data-align="right" title="오른쪽 정렬">${ALIGN('M1 2H13M5 6H13M3 10H13')}</button>
    <span class="fs"></span>
    <button data-cmd="clear" title="서식 지우기" style="font-size:12px">지우기</button><button data-cmd="undo" title="되돌리기 (Ctrl+Z)">↶</button>
  </div>`;
}

function setLive(v){
  live = v;
  document.body.classList.toggle('live', v);
  $('liveBtn').classList.toggle('on', v);
  const it = data.items[idx];
  $('content').contentEditable = (v && MODE !== 'home' && it) ? 'true' : 'false';
  document.querySelectorAll('[data-lbl]').forEach(el => {
    if(v){ try{ el.contentEditable = 'plaintext-only'; }catch(e){ el.contentEditable = 'true'; } if(el.contentEditable !== 'plaintext-only') el.contentEditable = 'true'; }
    else el.contentEditable = 'false';
  });
  if(!v){ hideBar(); if(document.activeElement && document.activeElement.blur) document.activeElement.blur(); }
  else toast('글자를 클릭해서 바로 쓰고, 드래그하면 서식을 바꿀 수 있어요');
}

function commit(){
  const it = data.items[idx], c = $('content'); if(!it || MODE === 'home') return;
  const cur = c.innerHTML;
  if(cur === lastHtml) return;
  if(lastHtml !== null){ hist.push(lastHtml); if(hist.length > 80) hist.shift(); }
  lastHtml = cur; it.html = cur;
  const tx = sel => { const n = c.querySelector(sel); return n ? n.innerText.trim() : null; };
  const tt = tx('.tt'), st = tx('.st');
  if(tt !== null) it.title = tt; if(st !== null) it.sub = st;
  [['genre','.src .g'],['chara','.src .c'],['maker','.src .mk']].forEach(([k, q]) => { const v = tx(q); if(v !== null && !data.lock[k]) it[k] = v; });
  save(); updateFrame(); fit();
  if($('panel').classList.contains('on')) fillPanel();
}
function undo(){
  const it = data.items[idx]; if(!it || !hist.length){ toast('더 되돌릴 게 없어요'); return; }
  const h = hist.pop(); lastHtml = h; it.html = h; $('content').innerHTML = h; save(); fit(); hideBar();
}

/* 선택한 글자에 스타일 입히기 */
function textNodesIn(range){
  let root = range.commonAncestorContainer; if(root.nodeType === 3) root = root.parentNode;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), out = [];
  while(w.nextNode()){ const n = w.currentNode; if(n.nodeValue.length && range.intersectsNode(n)) out.push(n); }
  return out;
}
function restore(){ if(!saved) return null; const s = getSelection(); s.removeAllRanges(); s.addRange(saved); return saved; }
function styleSel(styles){
  const range = restore(); if(!range || range.collapsed) return;
  const c = $('content'); if(!c.contains(range.commonAncestorContainer)) return;
  const nodes = textNodesIn(range), spans = [];
  const sc = range.startContainer, so = range.startOffset, ec = range.endContainer, eo = range.endOffset;
  nodes.forEach(n => {
    let s = 0, e = n.nodeValue.length;
    if(n === sc) s = so; if(n === ec) e = eo;
    if(s >= e) return;
    let t = n;
    if(e < t.nodeValue.length) t.splitText(e);
    if(s > 0) t = t.splitText(s);
    let sp = t.parentNode;
    if(!(sp.dataset && sp.dataset.r && sp.childNodes.length === 1)){
      sp = document.createElement('span'); sp.dataset.r = '1';
      t.parentNode.insertBefore(sp, t); sp.appendChild(t);
    }
    for(const k in styles) sp.style.setProperty(k, styles[k]);
    if(!sp.getAttribute('style')) sp.removeAttribute('style');
    spans.push(sp);
  });
  if(spans.length){
    const r = document.createRange(); r.setStartBefore(spans[0]); r.setEndAfter(spans[spans.length-1]);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r); saved = r.cloneRange();
  }
  commit(); placeBar();
}
function firstEl(){ const r = saved; if(!r) return null; const n = textNodesIn(r)[0]; return n ? n.parentNode : null; }
function toggleCmd(cmd){
  const el = firstEl(); if(!el) return;
  const cs = getComputedStyle(el);
  const deco = (() => { let x = el; const set = new Set(); while(x && x !== $('content')){ const d = x.style && x.style.textDecorationLine; if(d) d.split(' ').forEach(v => set.add(v)); if(x.tagName === 'U') set.add('underline'); if(x.tagName === 'S') set.add('line-through'); x = x.parentNode; } set.delete('none'); return set; })();
  if(cmd === 'bold') styleSel({'font-weight': +cs.fontWeight >= 600 ? '400' : '800'});
  if(cmd === 'italic') styleSel({'font-style': cs.fontStyle === 'italic' ? 'normal' : 'italic'});
  if(cmd === 'underline' || cmd === 'strike'){
    const v = cmd === 'underline' ? 'underline' : 'line-through';
    if(deco.has(v)) deco.delete(v); else deco.add(v);
    styleSel({'text-decoration-line': deco.size ? [...deco].join(' ') : 'none'});
  }
}
function clearSel(){
  const range = restore(); if(!range) return;
  const c = $('content');
  c.querySelectorAll('[data-r]').forEach(sp => { if(range.intersectsNode(sp)){ while(sp.firstChild) sp.parentNode.insertBefore(sp.firstChild, sp); sp.remove(); } });
  blocksIn(range).forEach(b => b.style.removeProperty('text-align'));
  c.normalize(); commit(); hideBar();
}
const BLOCK = 'p,h2,.tt,.st,.src,.card,.nar,.exh,.body>div';
function blocksIn(range){
  const c = $('content'), out = new Set();
  [range.startContainer, range.endContainer].forEach(n => { const e = (n.nodeType === 3 ? n.parentNode : n).closest(BLOCK); if(e && c.contains(e)) out.add(e); });
  c.querySelectorAll(BLOCK).forEach(b => { if(range.intersectsNode(b) && !b.querySelector(BLOCK)) out.add(b); });
  return [...out];
}
function alignSel(a){
  const range = restore() || (getSelection().rangeCount ? getSelection().getRangeAt(0) : null); if(!range) return;
  blocksIn(range).forEach(b => b.style.textAlign = a);
  commit(); placeBar();
}

function placeBar(){
  const fb = $('fbar'); if(!saved){ hideBar(); return; }
  const r = saved.getBoundingClientRect(); if(!r.width && !r.height){ hideBar(); return; }
  fb.classList.add('on');
  const w = fb.offsetWidth, h = fb.offsetHeight;
  let top = r.top - h - 12; if(top < 8) top = r.bottom + 12;
  let left = r.left + r.width/2 - w/2; left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
  fb.style.top = top + 'px'; fb.style.left = left + 'px';
  ['fbFont','fbSize','fbWeight'].forEach(id => $(id).value = '');
}
function hideBar(){ const fb = $('fbar'); if(fb) fb.classList.remove('on'); }

function wireLive(){
  const c = $('content'), fb = $('fbar');
  document.addEventListener('selectionchange', () => {
    if(!live || MODE === 'home') return;
    if(fb.contains(document.activeElement)) return;
    const s = getSelection();
    if(s.rangeCount && !s.isCollapsed && c.contains(s.anchorNode) && c.contains(s.focusNode)){ saved = s.getRangeAt(0).cloneRange(); placeBar(); }
    else if(!fb.matches(':hover')) hideBar();
  });
  c.addEventListener('input', () => { clearTimeout(typingT); typingT = setTimeout(commit, 350); });
  c.addEventListener('blur', () => { clearTimeout(typingT); commit(); });
  c.addEventListener('paste', e => { if(!live) return; e.preventDefault(); const t = (e.clipboardData || window.clipboardData).getData('text/plain'); document.execCommand('insertText', false, t); });
  c.addEventListener('keydown', e => {
    if(!live) return;
    if((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z'){ e.preventDefault(); clearTimeout(typingT); commit(); undo(); }
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b'){ e.preventDefault(); const s = getSelection(); if(s.rangeCount && !s.isCollapsed){ saved = s.getRangeAt(0).cloneRange(); toggleCmd('bold'); } }
  });
  c.addEventListener('click', e => { if(live && e.target.closest('a')) e.preventDefault(); });
  fb.addEventListener('mousedown', e => { if(e.target.closest('button')) e.preventDefault(); });
  fb.querySelectorAll('[data-cmd]').forEach(b => b.onclick = () => {
    const k = b.dataset.cmd;
    if(k === 'undo'){ clearTimeout(typingT); commit(); undo(); return; }
    if(k === 'clear') return clearSel();
    toggleCmd(k);
  });
  fb.querySelectorAll('[data-color]').forEach(b => b.onclick = () => styleSel({color: b.dataset.color}));
  fb.querySelectorAll('[data-hl]').forEach(b => b.onclick = () => styleSel({'background-image': hlCss(b.dataset.hl)}));
  fb.querySelectorAll('[data-align]').forEach(b => b.onclick = () => alignSel(b.dataset.align));
  $('fbColor').addEventListener('change', e => styleSel({color: e.target.value}));
  $('fbHl').addEventListener('change', e => styleSel({'background-image': hlCss(e.target.value)}));
  $('fbFont').addEventListener('change', e => { const n = e.target.value; if(!n) return; const f = FONTS.ko.find(x => x.n === n) || FONTS.en.find(x => x.n === n); loadFont(f); styleSel({'font-family': FONTS.en.includes(f) ? f.s + ',var(--fb)' : f.s}); });
  $('fbSize').addEventListener('change', e => { if(e.target.value) styleSel({'font-size': e.target.value + 'em'}); });
  $('fbWeight').addEventListener('change', e => { if(e.target.value) styleSel({'font-weight': e.target.value}); });

  /* 프레임 라벨 직접 수정 */
  const LBL = {hL:'left', hR:'right', hLs:'leftSub', hRs:'rightSub', topLabel:'top', footL:'footL', footR:'footR', ruin:'ruin'};
  document.querySelectorAll('[data-lbl]').forEach(el => {
    el.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); el.blur(); } });
    el.addEventListener('paste', e => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData.getData('text/plain') || '').replace(/\n/g,' ')); });
    el.addEventListener('input', () => {
      const v = el.textContent, k = LBL[el.id];
      if(el.id === 'hyb'){ const it = data.items[idx]; if(MODE === 'home' || !it) data.site.hybris = v; else if(data.lock.hybris) data.tpl.hybris = v; else it.hybris = v; }
      else if(k === 'left' || k === 'right'){ const arr = names(data.site[k]); arr[0] = v.trim(); data.site[k] = arr.join(', '); }
      else data.site[k] = v;
      save();
      if(MODE === 'chat' && (k === 'left' || k === 'right' || k === 'leftSub' || k === 'rightSub') && typeof (data.items[idx]||{}).html !== 'string') render();
      if($('panel').classList.contains('on')) fillPanel();
    });
  });
}
function hlCss(c){ return c ? `linear-gradient(transparent 56%, color-mix(in srgb, ${c} 45%, transparent) 56%)` : 'none'; }

/* ------------------------------------------------------------------ nav */
function rerenderKeep(){ const y = idx; render(); idx = y; }
function go(i){ if(i < 0 || i >= data.items.length) return; idx = i; render(); if($('panel').classList.contains('on')) fillPanel(); }
function move(dir){
  const j = idx + dir; if(j < 0 || j >= data.items.length) return;
  const a = data.items; [a[idx], a[j]] = [a[j], a[idx]]; idx = j; save(); render(); fillPanel();
}
function openPanel(v){
  $('panel').classList.toggle('on', v); $('panel').setAttribute('aria-hidden', String(!v));
  $('scrim').classList.toggle('on', v && !wide());
  if(v) fillPanel();
  layout();
}

/* ------------------------------------------------------------------ boot */
buildPage();
buildPanel();
applyStyle();
render();
if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
if(document.fonts) document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', fit);

$('editBtn').onclick = () => openPanel(!$('panel').classList.contains('on'));
$('liveBtn').onclick = () => setLive(!live);
wireLive();
$('pngBtn').onclick = savePNG;
$('scrim').onclick = () => openPanel(false);
$('shotClose').onclick = () => $('shot').classList.remove('on');
$('shot').onclick = e => { if(e.target === $('shot')) $('shot').classList.remove('on'); };
if(MODE !== 'home'){
  $('prev').onclick = () => go(idx-1);
  $('next').onclick = () => go(idx+1);
  $('cnt').onclick = e => { e.stopPropagation(); $('menu').classList.toggle('on'); };
  $('menu').onclick = e => { const b = e.target.closest('button'); if(b){ go(+b.dataset.i); $('menu').classList.remove('on'); } };
  document.addEventListener('click', () => $('menu').classList.remove('on'));
}
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){ openPanel(false); $('shot').classList.remove('on'); }
  if(MODE === 'home' || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
  if(e.key === 'ArrowLeft') go(idx-1);
  if(e.key === 'ArrowRight') go(idx+1);
});
window.addEventListener('resize', () => { layout(); $('scrim').classList.toggle('on', $('panel').classList.contains('on') && !wide()); });
window.addEventListener('hashchange', updateFrame);
})();
