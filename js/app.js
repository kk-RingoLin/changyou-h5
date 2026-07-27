/**
 * 一起唱游 H5 版 — SPA 路由 + 页面渲染
 */
var ASSET = 'assets/';
var BENEFITS = {
  organizer: [
    { title: '认识同好朋友', desc: '每场活动都是一次深度社交，结识志同道合的音乐伙伴' },
    { title: '积累音乐资源', desc: '拓展人脉圈，遇到能一起玩音乐、互相切磋的人' },
    { title: '获得活动收入', desc: '付费活动可设置报名费用，边玩音乐边赚点零花钱' },
    { title: '打造个人影响力', desc: '持续办活动，成为本地音乐圈的活跃人物和连接者' }
  ],
  venue: [
    { title: '引流到店消费', desc: '每场活动带来精准客流，直接转化为到店消费' },
    { title: '免费持续曝光', desc: '场地在平台展示，被同城音乐爱好者持续看到' },
    { title: '零成本获客', desc: '平台不收佣金、不收推广费，纯免费引流' },
    { title: '长期复客', desc: '持续承接活动，把一次性客流变成回头客' }
  ]
};
var VENUE_TYPES = ['咖啡馆', 'Livehouse', '琴行/琴房', 'KTV', '户外场地', '书店/文创空间', '其他'];
var RULES = [
  '活动须为同城音乐聚会主题，内容真实、健康',
  '时间、地点、费用须如实填写，不得临时加价',
  '须上传有效的微信群二维码，或填写主理人微信号',
  '户外/夜间活动须说明安全保障措施，谢绝劝酒',
  '提交的活动由平台审核，通过才会对外展示',
  '违规活动将被下架，情节严重者取消发起资格'
];

/* ========== 路由 ========== */
function navigate(hash) { location.hash = hash; }
function back() { history.back(); }

var routes = [
  { pattern: /^#\/?$/, render: renderIndex, tab: true },
  { pattern: /^#\/index$/, render: renderIndex, tab: true },
  { pattern: /^#\/detail\/(\w+)$/, render: renderDetail, tab: false },
  { pattern: /^#\/publish$/, render: renderPublish, tab: true },
  { pattern: /^#\/apply$/, render: renderApply, tab: false },
  { pattern: /^#\/admin$/, render: renderAdmin, tab: false },
  { pattern: /^#\/organizer\/(\w+)$/, render: renderOrganizer, tab: false },
  { pattern: /^#\/my$/, render: renderMy, tab: true },
  { pattern: /^#\/success\/(\w+)$/, render: renderSuccess, tab: false },
  { pattern: /^#\/manage\/(\w+)$/, render: renderManage, tab: false }
];

function getRoute() {
  var hash = location.hash || '#/';
  var hashPath = hash.split('?')[0];
  for (var i = 0; i < routes.length; i++) {
    var m = hashPath.match(routes[i].pattern);
    if (m) return { fn: routes[i].render, args: m.slice(1), tab: routes[i].tab };
  }
  return { fn: renderIndex, args: [], tab: true };
}

function router() {
  document.querySelectorAll('.share-mask, .mask').forEach(function(el) { el.remove(); });
  var r = getRoute();
  var app = document.getElementById('app');
  app.className = r.tab ? '' : 'no-tab';
  app.innerHTML = (r.tab ? '' : '<div class="safe-bottom"></div>');
  r.fn.apply(null, [app].concat(r.args));
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);

/* ========== 工具函数 ========== */
function toast(msg) {
  var t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 1800);
}

function showModal(html) {
  var mask = document.createElement('div');
  mask.className = 'mask';
  mask.innerHTML = '<div class="panel">' + html + '</div>';
  mask.addEventListener('click', function(e) { if (e.target === mask) mask.remove(); });
  document.body.appendChild(mask);
  return mask;
}

function eventCardHTML(e) {
  var org = e.organizer || {};
  return '<div class="ec-card" onclick="navigate(\'#/detail/' + e.id + '\')">' +
    '<div class="ec-cover-wrap">' +
      '<img class="ec-cover" src="' + (e.cover || (e.media && e.media[0] ? e.media[0].url : '')) + '"/>' +
      '<span class="ec-badge ' + e.statusClass + '">' + e.statusText + '</span>' +
      '<span class="ec-fee">' + e.feeText + '</span>' +
    '</div>' +
    '<div class="ec-body">' +
      '<div class="ec-title">' + e.title + '</div>' +
      '<div class="ec-meta">' + e.dateText + ' · ' + (org.nickname || '') + '</div>' +
      '<div class="ec-foot">' +
        '<div class="ec-org">' +
          '<img class="ec-org-av" src="' + (org.avatar || '') + '"/>' +
          '<span class="ec-org-name">' + (org.nickname || '') + '</span>' +
        '</div>' +
        '<span class="ec-att">' + e.signupCount + '/' + e.maxPeople + '人</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderTabBar(active) {
  var tabs = [
    { key: 'index', icon: 'home', label: '首页', hash: '#/index' },
    { key: 'publish', icon: 'plus', label: '发布', hash: '#/publish' },
    { key: 'my', icon: 'user', label: '我的', hash: '#/my' }
  ];
  return '<div class="tabbar">' + tabs.map(function(t) {
    return '<div class="tabbar-item ' + (active === t.key ? 'on' : '') + '" onclick="navigate(\'' + t.hash + '\')">' +
      '<div class="tabbar-icon">' + (active === t.key ? tabIcon(t.icon, true) : tabIcon(t.icon, false)) + '</div>' +
      '<div class="tabbar-text">' + t.label + '</div>' +
    '</div>';
  }).join('') + '</div>';
}

function tabIcon(name, on) {
  var c = on ? '#7C4DFF' : '#9A97A8';
  if (name === 'home') return '<svg viewBox="0 0 24 24" fill="' + c + '"><path d="M12 3l9 8h-2v9h-5v-6H10v6H5v-9H3z"/></svg>';
  if (name === 'plus') return '<svg viewBox="0 0 24 24" fill="' + c + '"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>';
  if (name === 'user') return '<svg viewBox="0 0 24 24" fill="' + c + '"><path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-4 0-9 2-9 6v2h18v-2c0-4-5-6-9-6z"/></svg>';
  return '';
}

/* ========== 页面：首页 ========== */
function renderIndex(app) {
  store.init();
  var city = store.CITY;
  var list = store.getEventList({ tab: 'all' });
  var html = '<div class="hero">' +
    '<div class="hero-deco d1"></div><div class="hero-deco d2"></div>' +
    '<div class="hero-top">' +
      '<div class="hero-left"><div class="hero-title">一起唱游</div><div class="hero-slogan">和同城的人，一起把歌唱给风听</div></div>' +
      '<div class="hero-city">' + city + '</div>' +
    '</div>' +
    '<div class="entries">' +
      '<div class="entry" onclick="navigate(\'#/apply?type=organizer\')"><div class="entry-title">成为主理人</div><div class="entry-sub">发起活动，聚集同好</div></div>' +
      '<div class="entry" onclick="navigate(\'#/apply?type=venue\')"><div class="entry-title">场地入驻</div><div class="entry-sub">提供场地，吸引人气</div></div>' +
    '</div>' +
  '</div>' +
  '<div class="tabs">' +
    '<div class="tab on" data-tab="all">全部</div>' +
    '<div class="tab" data-tab="week">本周</div>' +
    '<div class="tab" data-tab="hot">热门</div>' +
  '</div>';

  if (list.length) {
    html += '<div class="feed">' + list.map(eventCardHTML).join('') + '</div>';
  } else {
    html += '<div class="empty"><div class="empty-text">暂时没有活动，来发起一场吧</div></div>';
  }
  html += '<div class="foot-note">一起唱游 · 让每一场歌唱都有同路人</div>';
  html += renderTabBar('index');
  app.innerHTML = html;

  app.querySelectorAll('.tab').forEach(function(el) {
    el.addEventListener('click', function() {
      app.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('on'); });
      el.classList.add('on');
      var tab = el.dataset.tab;
      var l = store.getEventList({ tab: tab });
      var feed = app.querySelector('.feed');
      if (feed) {
        feed.innerHTML = l.map(eventCardHTML).join('') || '<div class="empty"><div class="empty-text">没有相关活动</div></div>';
      } else {
        var empty = app.querySelector('.empty');
        if (empty) {
          var div = document.createElement('div');
          div.className = 'feed';
          div.innerHTML = l.map(eventCardHTML).join('');
          empty.replaceWith(div);
        }
      }
    });
  });
}

/* ========== 页面：详情 ========== */
function renderDetail(app, id) {
  store.init();
  store.incViews(id);
  var e = store.getEvent(id);
  if (!e) { app.innerHTML = navbar('活动不存在') + '<div class="empty"><div class="empty-text">活动不存在或已删除</div></div>'; return; }
  var user = store.getUser();
  var signed = store.isSigned(id, user.openid);
  var isOrganizer = e.publisherOpenid === user.openid;
  var adminReview = store.isAdmin() && e.auditStatus === 'pending';
  var signs = store.getEventSignups(id);
  var progressPct = Math.min(100, Math.round(e.signupCount / e.maxPeople * 100));

  var html = navbar(e.title);

  // 媒体
  var media = e.media || [{ type: 'image', url: e.cover }];
  html += '<div class="media-swiper" id="mediaSwiper">';
  media.forEach(function(m, i) {
    if (m.type === 'video') {
      html += '<video class="media-item" src="' + m.url + '" controls></video>';
    } else {
      html += '<img class="media-item" src="' + m.url + '" onclick="previewImage(\'' + m.url + '\')"/>';
    }
  });
  html += '</div>';
  if (media.length > 1) {
    html += '<div class="media-dots">';
    for (var i = 0; i < media.length; i++) html += '<div class="media-dot' + (i === 0 ? ' on' : '') + '"></div>';
    html += '</div>';
  }

  // 审核横幅
  if (e.auditStatus === 'pending') html += '<div class="audit-banner b-pending">活动审核中，管理员通过后其他用户才能看到</div>';
  if (e.auditStatus === 'rejected') html += '<div class="audit-banner b-no">未通过审核' + (e.auditNote ? '：' + e.auditNote : '') + '，可联系管理员修改后重新提交</div>';

  // 标题
  html += '<div class="card head">' +
    '<div class="badges"><span class="badge ' + e.statusClass + '">' + e.statusText + '</span><span class="badge fee">' + e.feeText + '</span></div>' +
    '<div class="title">' + e.title + '</div>' +
    '<div class="views">' + (e.views || 0) + ' 次浏览</div></div>';

  // 关键信息
  html += '<div class="card info">' +
    rowHTML(ASSET + 'icons/cal.png', '活动时间', e.dateText + '　' + e.rangeText) +
    '<div class="row" onclick="openMap(\'' + (e.address || '').replace(/'/g, '') + '\')">' + rowHTMLBody(ASSET + 'icons/pin.png', '活动地点', e.address) + '<div class="nav-btn">导航</div></div>' +
    '<div class="row"><img class="ic" src="' + ASSET + 'icons/users.png"/><div class="row-main"><div class="row-label">报名人数</div><div class="row-value">已报 ' + e.signupCount + ' / ' + e.maxPeople + ' 人</div><div class="progress"><div class="progress-in" style="width:' + progressPct + '%"></div></div></div></div>' +
  '</div>';

  // 主理人
  if (e.organizer) {
    html += '<div class="card org-card" onclick="navigate(\'#/organizer/' + e.publisherOpenid + '\')">' +
      '<img class="org-av" src="' + (e.organizer.avatar || '') + '"/>' +
      '<div class="org-main"><div class="org-name">' + e.organizer.nickname + '<span class="org-tag">主理人</span></div>' +
      '<div class="org-intro ellipsis">' + (e.organizer.intro || '这位主理人还没有留下介绍') + '</div></div>' +
      '<div class="org-contact">查看 TA</div></div>';
  }

  // 报名列表
  html += '<div class="card"><div class="sec-title">已报名的小伙伴（' + signs.length + '）</div>';
  if (signs.length) {
    html += '<div class="sign-list">';
    signs.forEach(function(s) {
      html += '<div class="sign-row"><img class="sign-av" src="' + (s.avatar || '') + '"/><div class="sign-main"><div class="sign-name">' + s.nickname + '</div>' + (s.note ? '<div class="sign-note">' + s.note + '</div>' : '') + '</div></div>';
    });
    html += '</div>';
  } else {
    html += '<div class="att-none">还没有人报名，来抢沙发～</div>';
  }
  html += '</div>';

  // 活动详情
  html += '<div class="card"><div class="sec-title">活动详情</div><div class="desc">' + (e.desc || '') + '</div></div>';

  // 往期回顾
  if (e.pastPhotos && e.pastPhotos.length) {
    html += '<div class="card"><div class="sec-title">往期回顾</div><div class="past-grid">';
    e.pastPhotos.forEach(function(p) {
      html += '<img class="past-img" src="' + p + '" onclick="previewImage(\'' + p + '\')"/>';
    });
    html += '</div></div>';
  }

  // 活动流程
  if (e.flows && e.flows.length) {
    html += '<div class="card"><div class="sec-title">活动流程</div>';
    e.flows.forEach(function(f, i) {
      html += '<div class="flow"><div class="flow-time">' + f.time + '</div>' +
        '<div class="flow-line"><div class="flow-dot"></div>' + (i < e.flows.length - 1 ? '<div class="flow-bar"></div>' : '') + '</div>' +
        '<div class="flow-content">' + f.content + '</div></div>';
    });
    html += '</div>';
  }

  html += '<div class="safe-bottom"></div>';

  // 底部操作栏
  html += '<div class="bar">';
  html += '<div class="bar-share" onclick="shareLink()"><img class="bar-share-ic" src="' + ASSET + 'icons/share.png"/><span>分享</span></div>';
  if (adminReview) {
    html += '<button class="btn-ghost bar-half" onclick="adminRejectOpen(\'' + id + '\')">拒绝</button>';
    html += '<button class="btn-primary bar-half" onclick="adminApprove(\'' + id + '\')">通过审核</button>';
  } else if (e.auditStatus === 'pending') {
    html += '<button class="btn-primary bar-btn disabled" disabled>审核中，通过后开放报名</button>';
  } else if (e.auditStatus === 'rejected') {
    html += '<button class="btn-primary bar-btn disabled" disabled>未通过审核</button>';
  } else if (isOrganizer) {
    html += '<button class="btn-ghost bar-half" onclick="navigate(\'#/manage/' + id + '\')">管理(' + e.signupCount + ')</button>';
    if (e.status === 'ended') {
      html += '<button class="btn-primary bar-half disabled" disabled>已结束</button>';
    } else if (signed) {
      html += '<button class="btn-primary bar-half" onclick="navigate(\'#/success/' + id + '\')">查看群二维码</button>';
    } else if (e.status === 'full') {
      html += '<button class="btn-primary bar-half disabled" disabled>名额已满</button>';
    } else {
      html += '<button class="btn-primary bar-half" onclick="tapSignup(\'' + id + '\')">立即报名</button>';
    }
  } else if (e.status === 'ended') {
    html += '<button class="btn-primary bar-btn disabled" disabled>活动已结束</button>';
  } else if (signed) {
    html += '<button class="btn-ghost bar-half" onclick="doCancel(\'' + id + '\')">取消报名</button>';
    html += '<button class="btn-primary bar-half" onclick="navigate(\'#/success/' + id + '\')">查看群二维码</button>';
  } else if (e.status === 'full') {
    html += '<button class="btn-primary bar-btn disabled" disabled>名额已满</button>';
  } else {
    html += '<button class="btn-primary bar-btn" onclick="tapSignup(\'' + id + '\')">立即报名</button>';
  }
  html += '</div>';

  app.innerHTML = html;

  // swiper dots
  var swiper = document.getElementById('mediaSwiper');
  if (swiper && media.length > 1) {
    var dots = app.querySelectorAll('.media-dot');
    swiper.addEventListener('scroll', function() {
      var idx = Math.round(swiper.scrollLeft / swiper.offsetWidth);
      dots.forEach(function(d, i) { d.classList.toggle('on', i === idx); });
    });
  }
}

function rowHTML(icon, label, value) {
  return '<div class="row"><img class="ic" src="' + icon + '"/><div class="row-main"><div class="row-label">' + label + '</div><div class="row-value">' + value + '</div></div></div>';
}
function rowHTMLBody(icon, label, value) {
  return '<img class="ic" src="' + icon + '"/><div class="row-main"><div class="row-label">' + label + '</div><div class="row-value">' + value + '</div></div>';
}

/* ========== 详情页操作 ========== */
function tapSignup(id) {
  var user = store.getUser();
  if (!user.nickname || !user.avatar) { showProfileModal(id); return; }
  showSignupModal(id);
}

function showSignupModal(id) {
  var html = '<div class="panel-title">确认报名</div>' +
    '<div class="field"><div class="field-label">留个言吧（选填，展示给主理人和小伙伴们）</div>' +
    '<textarea class="field-textarea" id="signupNote" placeholder="比如：我会弹吉他 / 我可以唱和声 / 我带个大西瓜 / 纯围观鼓掌…" maxlength="100"></textarea></div>' +
    '<div class="field"><div class="field-label">手机号（必填，方便主理人联系）</div>' +
    '<input class="field-input" type="tel" maxlength="11" id="signupPhone" placeholder="请输入11位手机号"/></div>' +
    '<button class="btn-primary panel-btn" onclick="doSignup(\'' + id + '\')">提交报名</button>';
  showModal(html);
}

function doSignup(id) {
  var note = document.getElementById('signupNote').value;
  var phone = document.getElementById('signupPhone').value;
  if (!phone) { toast('请输入手机号'); return; }
  if (!/^1[3-9]\d{9}$/.test(phone)) { toast('请输入正确的11位手机号'); return; }
  var r = store.signup(id, { note: note, phone: phone });
  if (!r.ok) { toast(r.msg); return; }
  document.querySelector('.mask').remove();
  toast('报名成功！');
  setTimeout(function() { navigate('#/success/' + id); }, 600);
}

function doCancel(id) {
  store.cancelSignup(id);
  toast('已取消报名');
  setTimeout(function() { navigate('#/detail/' + id); }, 500);
}

function showProfileModal(eventId) {
  var user = store.getUser();
  var html = '<div class="panel-title">先完善一下资料</div>' +
    '<div class="profile-tip">上传头像和填写昵称后即可报名</div>' +
    '<div class="profile-row">' +
      '<div class="avatar-btn" id="avatarBtn">' + (user.avatar ? '<img class="avatar-img" src="' + user.avatar + '"/>' : '<span class="avatar-ph">+</span>') + '</div>' +
      '<input class="nick-input" id="nickInput" placeholder="点击填写昵称" value="' + (user.nickname || '') + '"/>' +
    '</div>' +
    '<input type="file" id="avatarFile" accept="image/*" style="display:none"/>' +
    '<button class="btn-primary panel-btn" onclick="saveProfile(\'' + (eventId || '') + '\')">保存并继续</button>' +
    '<div class="panel-cancel" onclick="closeModal()">取消</div>';
  var mask = showModal(html);
  document.getElementById('avatarBtn').addEventListener('click', function() { document.getElementById('avatarFile').click(); });
  document.getElementById('avatarFile').addEventListener('change', async function(e) {
    var f = e.target.files[0];
    if (!f) return;
    var url = await store.compressImage(f, 200);
    var btn = document.getElementById('avatarBtn');
    btn.innerHTML = '<img class="avatar-img" src="' + url + '"/>';
    btn.dataset.avatar = url;
  });
}

function saveProfile(eventId) {
  var btn = document.getElementById('avatarBtn');
  var nick = document.getElementById('nickInput').value.trim();
  var avatar = btn.dataset.avatar || '';
  if (!nick) { toast('请填写昵称'); return; }
  if (!avatar) { toast('请上传头像'); return; }
  store.setUser({ nickname: nick, avatar: avatar });
  closeModal();
  if (eventId) { showSignupModal(eventId); }
}

function closeModal() { var m = document.querySelector('.mask'); if (m) m.remove(); }

function scrollToSection(id) {
  var el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    toast(id === 'mySignupsSection' ? '还没有报名活动' : '还没有发起活动');
  }
}

function adminRejectOpen(id) {
  var html = '<div class="panel-title">拒绝该活动</div>' +
    '<div class="field"><div class="field-label">拒绝理由（将展示给发起人）</div>' +
    '<textarea class="field-textarea" id="rejectReason" placeholder="例如：群二维码无效 / 时间地点不明确…" maxlength="100"></textarea></div>' +
    '<button class="btn-primary panel-btn" onclick="adminReject(\'' + id + '\')">确认拒绝</button>' +
    '<div class="panel-cancel" onclick="closeModal()">取消</div>';
  showModal(html);
}

function adminReject(id) {
  var reason = document.getElementById('rejectReason').value;
  store.reviewEvent(id, false, reason);
  closeModal();
  toast('已拒绝');
  navigate('#/detail/' + id);
}

function adminApprove(id) {
  store.reviewEvent(id, true);
  toast('已通过审核');
  navigate('#/detail/' + id);
}

function previewImage(url) { window.open(url, '_blank'); }
function openMap(addr) { window.open('https://uri.amap.com/search?keyword=' + encodeURIComponent(addr), '_blank'); }
function shareLink() {
  var ua = navigator.userAgent;
  if (/MicroMessenger/i.test(ua)) {
    showShareGuide();
  } else if (navigator.share) {
    navigator.share({ title: '一起唱游', url: location.href });
  } else {
    copyToClipboard(location.href);
    toast('链接已复制，去微信粘贴给朋友吧');
  }
}

function showShareGuide() {
  var mask = document.createElement('div');
  mask.className = 'share-mask';
  mask.innerHTML =
    '<div class="share-guide">' +
      '<div class="share-arrow"><img src="' + ASSET + 'icons/share.png"/></div>' +
      '<div class="share-text">点击右上角 <b>···</b><br/>选择「发送给朋友」或「分享到朋友圈」</div>' +
    '</div>' +
    '<div class="share-close-btn">我知道了</div>';
  var btn = null;
  document.body.appendChild(mask);
  btn = mask.querySelector('.share-close-btn');
  btn.onclick = function(e) { e.stopPropagation(); mask.remove(); };
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function() { execCopy(text); });
  } else {
    execCopy(text);
  }
}
function execCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  ta.remove();
}

/* ========== 页面：发布活动 ========== */
function renderPublish(app) {
  store.init();
  var user = store.getUser();
  var role = store.roleOf(user);
  var myApp = store.getMyApplication('organizer');

  // 主理人守卫
  if (!user.organizerApproved) {
    var html = navbar('发布活动');
    var appStatus = (myApp && myApp.status) || 'none';

    // gate-hero
    html += '<div class="gate-hero"><div class="gate-title">成为主理人</div><div class="gate-sub">通过主理人审核后，才能发起活动</div></div>';

    if (appStatus === 'pending') {
      html += '<div class="card gate-card gate-status">' +
        '<div class="gate-status-title">主理人申请审核中</div>' +
        '<div class="gate-desc" style="margin-top:0.3rem;">你的申请已提交，审核员正在处理，通过后就能发布活动了。通常当天完成，请耐心等待。</div>' +
        '<div style="font-size:0.55rem;color:#C0BCD0;margin-top:0.4rem;">提交于 ' + myApp.createdText + '</div>' +
      '</div>';
    } else if (appStatus === 'rejected') {
      html += '<div class="card gate-card gate-status">' +
        '<div class="gate-status-title no">申请未通过</div>' +
        '<div class="gate-desc" style="margin-top:0.3rem;">' + (myApp.note || '资料不完整，请补充后重新提交') + '</div>' +
      '</div>';
      html += '<button class="btn-primary submit-btn" onclick="navigate(\'#/apply?type=organizer\')">修改资料，重新申请</button>';
      html += '<div class="submit-tip">提交资料 → 审核员审核 → 通过后即可发布活动</div>';
    } else {
      html += '<div class="card gate-card">' +
        '<div class="gate-step-title">为什么需要主理人审核？</div>' +
        '<div class="gate-desc" style="margin-top:0.3rem;">一起唱游的每一场活动都由认证主理人发起，平台审核资料真实可靠，参与者才能放心报名。审核通常当天完成。</div>' +
        '<div class="gate-desc" style="margin-bottom:0.35rem;">你需要准备：</div>' +
        '<div class="gate-rule"><span class="gate-rule-num">1.</span><span class="gate-rule-text">你的音乐方向（如：民谣弹唱 / 摇滚 / ukulele）</span></div>' +
        '<div class="gate-rule"><span class="gate-rule-num">2.</span><span class="gate-rule-text">组局经验或自我介绍</span></div>' +
        '<div class="gate-rule"><span class="gate-rule-num">3.</span><span class="gate-rule-text">微信号（仅审核员可见，用于沟通审核）</span></div>' +
      '</div>';
      html += '<button class="btn-primary submit-btn" onclick="navigate(\'#/apply?type=organizer\')">去申请成为主理人</button>';
      html += '<div class="submit-tip">提交资料 → 审核员审核 → 通过后即可发布活动</div>';
    }

    html += '<div class="safe-bottom"></div>';
    html += renderTabBar('publish');
    app.innerHTML = html;
    return;
  }

  // 发布表单
  var html = navbar('发布活动');
  html += '<div class="card"><div class="label">活动标题 <span class="req">*</span></div>' +
    '<input class="input" id="pTitle" placeholder="例如：周五不插电之夜" maxlength="30"/>' +
    '<div class="label" style="margin-top:0.6rem;">活动封面 <span class="req">*</span></div>' +
    '<div class="photo-row" id="coverRow"><div class="photo-add" onclick="uploadCover()"><span class="photo-add-ic">+</span></div></div>' +
    '<div class="label" style="margin-top:0.6rem;">媒体（照片/视频，最多 9 个）</div>' +
    '<div class="photo-row" id="mediaRow"><div class="photo-add" onclick="uploadMedia()"><span class="photo-add-ic">+</span></div></div>' +
    '<div class="label" style="margin-top:0.6rem;">活动日期 <span class="req">*</span></div>' +
    '<input class="input" type="date" id="pDate"/>' +
    '<div class="label" style="margin-top:0.6rem;">开始时间 <span class="req">*</span></div>' +
    '<input class="input" type="time" id="pStart" value="19:30"/>' +
    '<div class="label" style="margin-top:0.6rem;">结束时间 <span class="req">*</span></div>' +
    '<input class="input" type="time" id="pEnd" value="22:00"/>' +
    '<div class="label" style="margin-top:0.6rem;">所在省份</div>' +
    '<select class="select-box" id="pProvince" onchange="onProvinceChange()">' + Object.keys(store.PROVINCES).map(function(p) { return '<option>' + p + '</option>'; }).join('') + '</select>' +
    '<div class="label" style="margin-top:0.6rem;">所在城市</div>' +
    '<select class="select-box" id="pCity"><option>深圳市</option></select>' +
    '<div class="label" style="margin-top:0.6rem;">活动地点 <span class="req">*</span></div>' +
    '<input class="input" id="pAddr" placeholder="例如：南山区 · 山丘咖啡（科技园店）" maxlength="40"/>' +
    '<div class="label" style="margin-top:0.6rem;">人数上限 <span class="req">*</span></div>' +
    '<input class="input" type="number" id="pMax" placeholder="例如：20"/>' +
    '<div class="label" style="margin-top:0.6rem;">费用</div>' +
    '<div style="display:flex;gap:0.3rem;margin-bottom:0.35rem;">' +
      '<button class="btn-ghost fee-btn" data-ft="free" style="flex:1;height:1.8rem;line-height:1.8rem;font-size:0.62rem;" onclick="onFeeType(\'free\')">免费</button>' +
      '<button class="btn-ghost fee-btn" data-ft="aa" style="flex:1;height:1.8rem;line-height:1.8rem;font-size:0.62rem;" onclick="onFeeType(\'aa\')">AA制</button>' +
      '<button class="btn-ghost fee-btn" data-ft="prepay" style="flex:1;height:1.8rem;line-height:1.8rem;font-size:0.62rem;" onclick="onFeeType(\'prepay\')">预付费</button>' +
    '</div>' +
    '<input class="input" id="pFeeDesc" placeholder="例如：AA约30元/人" style="display:none"/>' +
    '<div class="label" style="margin-top:0.6rem;">活动详情 <span class="req">*</span></div>' +
    '<textarea class="textarea" id="pDesc" placeholder="详细介绍活动内容、适合人群、注意事项…&#10;&#10;活动流程参考：&#10;19:30 签到入座，自由交流&#10;20:00 轮流弹唱，每人 2 首&#10;21:20 开放合唱环节&#10;22:00 合影留念，活动结束" maxlength="800" style="height:7rem;"></textarea>' +
    '<div class="label" style="margin-top:0.6rem;">往期照片（选填，最多 10 张）</div>' +
    '<div class="photo-row" id="pastRow"><div class="photo-add" onclick="uploadPast()"><span class="photo-add-ic">+</span></div></div>' +
  '</div>' +
  '<button class="btn-primary submit-btn" onclick="submitPublish()">提交发布（需审核）</button>' +
  '<div class="submit-tip">提交后由平台管理员审核，通过后对外展示</div>' +
  '<div class="safe-bottom"></div>' +
  '<input type="file" id="fileInput" accept="image/*,video/*" style="display:none"/>' +
  renderTabBar('publish');

  app.innerHTML = html;
  publishState = { cover: '', media: [], past: [], qr: '', feeType: 'free' };
  // 默认省份
  onProvinceChange();
  // 默认费用类型按钮高亮
  onFeeType('free');
  // 默认日期
  var tomorrow = new Date(Date.now() + 86400000);
  document.getElementById('pDate').value = tomorrow.toISOString().slice(0, 10);
}

var publishState = {};

function onFeeType(ft) {
  publishState.feeType = ft;
  document.querySelectorAll('.fee-btn').forEach(function(b) {
    b.style.background = b.dataset.ft === ft ? 'linear-gradient(135deg, #8B5CFF, #6E35F5)' : '#F0EDFB';
    b.style.color = b.dataset.ft === ft ? '#fff' : '#7C4DFF';
  });
  document.getElementById('pFeeDesc').style.display = ft === 'free' ? 'none' : 'block';
}

function onProvinceChange() {
  var prov = document.getElementById('pProvince').value;
  var cities = store.PROVINCES[prov] || [];
  document.getElementById('pCity').innerHTML = cities.map(function(c) { return '<option>' + c + '</option>'; }).join('');
}

var uploadTarget = '';
function uploadCover() { uploadTarget = 'cover'; triggerFileInput(); }
function uploadMedia() { uploadTarget = 'media'; triggerFileInput(); }
function uploadPast() { uploadTarget = 'past'; triggerFileInput(); }

function triggerFileInput() {
  var fi = document.getElementById('fileInput');
  fi.value = '';
  fi.click();
}

document.addEventListener('change', function(e) {
  if (e.target.id === 'fileInput') handleUpload(e.target.files);
}, true);

async function handleUpload(files) {
  if (!files || !files.length) return;
  for (var f of files) {
    var url = f.type.startsWith('video/') ? URL.createObjectURL(f) : await store.compressImage(f, 1200);
    if (uploadTarget === 'cover') {
      publishState.cover = url;
      var row = document.getElementById('coverRow');
      row.innerHTML = '<div class="photo-wrap"><img class="photo" src="' + url + '"/><div class="photo-del" onclick="publishState.cover=\'\';renderCoverRow()">×</div></div><div class="photo-add" onclick="uploadCover()"><span class="photo-add-ic">+</span></div>';
    } else if (uploadTarget === 'media') {
      if (publishState.media.length >= 9) { toast('最多 9 个'); break; }
      var isVideo = f.type.startsWith('video/');
      publishState.media.push({ type: isVideo ? 'video' : 'image', url: url });
      renderMediaRow();
    } else if (uploadTarget === 'past') {
      if (publishState.past.length >= 10) { toast('最多 10 张'); break; }
      publishState.past.push(url);
      renderPastRow();
    }
  }
}

function renderCoverRow() {
  var row = document.getElementById('coverRow');
  if (!row) return;
  if (publishState.cover) {
    row.innerHTML = '<div class="photo-wrap"><img class="photo" src="' + publishState.cover + '"/><div class="photo-del" onclick="publishState.cover=\'\';renderCoverRow()">×</div></div><div class="photo-add" onclick="uploadCover()"><span class="photo-add-ic">+</span></div>';
  } else {
    row.innerHTML = '<div class="photo-add" onclick="uploadCover()"><span class="photo-add-ic">+</span></div>';
  }
}
function renderMediaRow() {
  var row = document.getElementById('mediaRow');
  if (!row) return;
  var html = publishState.media.map(function(m, i) {
    return '<div class="photo-wrap">' + (m.type === 'video' ? '<video class="photo" src="' + m.url + '"></video>' : '<img class="photo" src="' + m.url + '"/>') +
      '<div class="photo-del" onclick="publishState.media.splice(' + i + ',1);renderMediaRow()">×</div></div>';
  }).join('');
  if (publishState.media.length < 9) html += '<div class="photo-add" onclick="uploadMedia()"><span class="photo-add-ic">+</span></div>';
  row.innerHTML = html;
}
function renderPastRow() {
  var row = document.getElementById('pastRow');
  if (!row) return;
  var html = publishState.past.map(function(p, i) {
    return '<div class="photo-wrap"><img class="photo" src="' + p + '"/><div class="photo-del" onclick="publishState.past.splice(' + i + ',1);renderPastRow()">×</div></div>';
  }).join('');
  if (publishState.past.length < 10) html += '<div class="photo-add" onclick="uploadPast()"><span class="photo-add-ic">+</span></div>';
  row.innerHTML = html;
}

function submitPublish() {
  var user = store.getUser();
  if (!user.organizerApproved) { toast('请先成为主理人'); navigate('#/apply?type=organizer'); return; }
  var title = document.getElementById('pTitle').value.trim();
  if (!title) return toast('请填写活动标题');
  if (!publishState.cover) return toast('请上传活动封面');
  var date = document.getElementById('pDate').value;
  var startT = document.getElementById('pStart').value;
  var endT = document.getElementById('pEnd').value;
  if (!date || !startT || !endT) return toast('请填写活动时间');
  var startTime = parseDateTime(date, startT);
  var endTime = parseDateTime(date, endT);
  if (endTime <= startTime) return toast('结束时间须晚于开始时间');
  var addr = document.getElementById('pAddr').value.trim();
  if (!addr) return toast('请填写活动地点');
  var maxP = parseInt(document.getElementById('pMax').value, 10);
  if (!maxP || maxP < 1) return toast('请填写人数上限');
  var desc = document.getElementById('pDesc').value.trim();
  if (!desc) return toast('请填写活动详情');
  var prov = document.getElementById('pProvince').value;
  var city = document.getElementById('pCity').value;
  var feeDesc = document.getElementById('pFeeDesc').value;
  var feeType = publishState.feeType || 'free';

  var media = publishState.media.length ? publishState.media : [{ type: 'image', url: publishState.cover }];

  var id = store.publishEvent({
    title: title, cover: publishState.cover, media: media,
    startTime: startTime, endTime: endTime,
    city: city, address: prov + city + ' · ' + addr,
    maxPeople: maxP, feeType: feeType, feeDesc: feeType === 'free' ? '' : feeDesc,
    organizer: { openid: user.openid, nickname: user.nickname, avatar: user.avatar, intro: user.intro || '' },
    desc: desc, flows: [], pastPhotos: publishState.past
  });
  if (!id) { toast('发布失败'); return; }
  toast('已提交，等待审核');
  publishState = {};
  setTimeout(function() { navigate('#/detail/' + id); }, 800);
}

/* ========== 页面：身份申请 ========== */
function renderApply(app) {
  store.init();
  var params = new URLSearchParams(location.hash.split('?')[1] || '');
  var type = params.get('type') === 'venue' ? 'venue' : 'organizer';
  app._applyType = type;
  renderApplyContent(app, type);
}

function renderApplyContent(app, type) {
  var user = store.getUser();
  var approved = type === 'organizer' ? !!user.organizerApproved : !!user.venueApproved;
  var myApp = store.getMyApplication(type);

  var html = navbar(type === 'organizer' ? '成为主理人' : '场地入驻');
  html += '<div class="type-row">' +
    '<div class="type-item ' + (type === 'organizer' ? 'on' : '') + '" onclick="switchApplyType(\'organizer\')"><div class="type-name">成为主理人</div><div class="type-sub">发起活动，聚集同好</div></div>' +
    '<div class="type-item ' + (type === 'venue' ? 'on' : '') + '" onclick="switchApplyType(\'venue\')"><div class="type-name">场地提供方</div><div class="type-sub">提供场地，吸引人气</div></div>' +
  '</div>';

  // 权益
  var benefits = BENEFITS[type];
  html += '<div class="benefits-card"><div class="benefits-title">' + (type === 'organizer' ? '成为主理人的好处' : '成为场地方的好处') + '</div>';
  benefits.forEach(function(b) {
    html += '<div class="benefit-item"><div class="benefit-dot"></div><div class="benefit-text"><div class="benefit-name">' + b.title + '</div><div class="benefit-desc">' + b.desc + '</div></div></div>';
  });
  html += '</div>';

  if (approved) {
    html += '<div class="card" style="text-align:center;padding:1.5rem 0.8rem;"><div style="font-size:0.85rem;font-weight:800;color:#2EB372;">' + (type === 'organizer' ? '你已是认证主理人' : '你已是合作场地方') + '</div><div style="font-size:0.62rem;color:#9A97A8;margin-top:0.35rem;">' + (type === 'organizer' ? '去发布你的第一场活动吧' : '你的场地资料已通过审核') + '</div>';
    if (type === 'organizer') html += '<button class="btn-primary" style="width:60%;height:2.1rem;line-height:2.1rem;margin-top:0.8rem;" onclick="navigate(\'#/publish\')">去发布活动</button>';
    else html += '<button class="btn-primary" style="width:60%;height:2.1rem;line-height:2.1rem;margin-top:0.8rem;" onclick="navigate(\'#/index\')">返回首页</button>';
    html += '</div>';
  } else if (myApp && myApp.status === 'pending') {
    html += '<div class="card" style="text-align:center;padding:1.5rem 0.8rem;"><div style="font-size:0.85rem;font-weight:800;color:#BA7517;">申请审核中</div><div style="font-size:0.62rem;color:#9A97A8;margin-top:0.35rem;">你的' + (type === 'organizer' ? '主理人' : '场地方') + '申请已提交，通常当天完成</div><div style="font-size:0.55rem;color:#C0BCD0;margin-top:0.4rem;">提交于 ' + myApp.createdText + '</div></div>';
  } else {
    if (myApp && myApp.status === 'rejected') {
      html += '<div class="reject-banner">上次申请未通过' + (myApp.note ? '：' + myApp.note : '') + '，请修改后重新提交</div>';
    }
    if (type === 'organizer') {
      html += '<div class="card"><div class="label">你的音乐方向 <span class="req">*</span></div>' +
        '<input class="input" id="oField" placeholder="例如：民谣弹唱 / 摇滚 / ukulele" maxlength="20"/>' +
        '<div class="label" style="margin-top:0.6rem;">组局经验 / 自我介绍 <span class="req">*</span></div>' +
        '<textarea class="textarea" id="oExp" placeholder="比如：组过几场什么活动、擅长什么乐器、想组什么样的局…" maxlength="300"></textarea>' +
        '<div class="label" style="margin-top:0.6rem;">微信号 <span class="req">*</span></div>' +
        '<div class="label-tip">仅审核员可见，用于沟通审核事宜</div>' +
        '<input class="input" id="oWx" placeholder="请输入微信号" maxlength="30"/></div>';
      html += '<div class="card"><div class="label">发布规则</div>';
      RULES.forEach(function(r, i) { html += '<div class="rule"><span class="rule-num">' + (i + 1) + '.</span><span class="rule-text">' + r + '</span></div>'; });
      html += '<div class="rule-check" onclick="toggleRules()"><div class="checkbox" id="ruleCheck"></div><span class="rule-check-text">我已阅读并同意遵守以上规则</span></div></div>';
      html += '<button class="btn-primary submit-btn" onclick="submitOrganizer()">提交主理人申请</button><div class="submit-tip">提交后由审核员审核，通过后即可发布活动</div>';
    } else {
      html += '<div class="card"><div class="label">场地名称 <span class="req">*</span></div>' +
        '<input class="input" id="vName" placeholder="例如：橙光音乐角" maxlength="20"/>' +
        '<div class="label" style="margin-top:0.6rem;">场地类型 <span class="req">*</span></div>' +
        '<select class="select-box" id="vType">' + VENUE_TYPES.map(function(t) { return '<option>' + t + '</option>'; }).join('') + '</select>' +
        '<div class="label" style="margin-top:0.6rem;">场地地址 <span class="req">*</span></div>' +
        '<input class="input" id="vAddr" placeholder="例如：南山区 · 橙光咖啡（海岸城店）" maxlength="40"/>' +
        '<div class="label" style="margin-top:0.6rem;">可容纳人数 <span class="req">*</span></div>' +
        '<input class="input" type="number" id="vCap" placeholder="例如：40"/></div>';
      html += '<div class="card"><div class="label">场地介绍 <span class="req">*</span></div>' +
        '<textarea class="textarea" id="vIntro" placeholder="介绍场地设备（音响/舞台/乐器）、可用时段、合作方式…" maxlength="300"></textarea>' +
        '<div class="label" style="margin-top:0.6rem;">场地照片（选填，最多 3 张）</div>' +
        '<div class="photo-row" id="vPhotoRow"><div class="photo-add" onclick="uploadVPhoto()"><span class="photo-add-ic">+</span></div></div>' +
        '<div class="label" style="margin-top:0.6rem;">联系人微信号 <span class="req">*</span></div>' +
        '<div class="label-tip">仅审核员可见，用于沟通合作事宜</div>' +
        '<input class="input" id="vWx" placeholder="请输入微信号" maxlength="30"/></div>';
      html += '<button class="btn-primary submit-btn" onclick="submitVenue()">提交场地方申请</button><div class="submit-tip">审核通过后，场地资料将进入合作场地库</div>';
      html += '<input type="file" id="vFileInput" accept="image/*" style="display:none"/>';
    }
  }
  html += '<div class="safe-bottom"></div>';
  app.innerHTML = html;
  applyState = { rules: false, vPhotos: [] };
}

var applyState = {};
function switchApplyType(t) { renderApplyContent(document.getElementById('app'), t); }
function toggleRules() { applyState.rules = !applyState.rules; document.getElementById('ruleCheck').classList.toggle('on', applyState.rules); }

function submitOrganizer() {
  var user = store.getUser();
  if (!user.nickname) { showProfileModal(''); return; }
  var field = document.getElementById('oField').value.trim();
  var exp = document.getElementById('oExp').value.trim();
  var wx = document.getElementById('oWx').value.trim();
  if (!field) return toast('请填写你的音乐方向');
  if (!exp) return toast('请填写组局经验或自我介绍');
  if (!wx) return toast('请填写微信号');
  if (!applyState.rules) return toast('请先阅读并勾选发布规则');
  var r = store.applyRole('organizer', { field: field, exp: exp, wechatId: wx });
  if (!r.ok) return toast(r.msg);
  toast('已提交，等待审核');
  renderApplyContent(document.getElementById('app'), 'organizer');
}

function uploadVPhoto() { document.getElementById('vFileInput').click(); }
document.addEventListener('change', function(e) {
  if (e.target.id === 'vFileInput') handleVPhoto(e.target.files);
}, true);

async function handleVPhoto(files) {
  if (!files || !files.length) return;
  for (var f of files) {
    if (applyState.vPhotos.length >= 3) { toast('最多 3 张'); break; }
    var url = await store.compressImage(f, 800);
    applyState.vPhotos.push(url);
  }
  renderVPhotoRow();
}
function renderVPhotoRow() {
  var row = document.getElementById('vPhotoRow');
  if (!row) return;
  var html = applyState.vPhotos.map(function(p, i) {
    return '<div class="photo-wrap"><img class="photo" src="' + p + '"/><div class="photo-del" onclick="applyState.vPhotos.splice(' + i + ',1);renderVPhotoRow()">×</div></div>';
  }).join('');
  if (applyState.vPhotos.length < 3) html += '<div class="photo-add" onclick="uploadVPhoto()"><span class="photo-add-ic">+</span></div>';
  row.innerHTML = html;
}

function submitVenue() {
  var user = store.getUser();
  if (!user.nickname) { showProfileModal(''); return; }
  var name = document.getElementById('vName').value.trim();
  var addr = document.getElementById('vAddr').value.trim();
  var cap = parseInt(document.getElementById('vCap').value, 10);
  var intro = document.getElementById('vIntro').value.trim();
  var wx = document.getElementById('vWx').value.trim();
  var type = document.getElementById('vType').value;
  if (!name) return toast('请填写场地名称');
  if (!addr) return toast('请填写场地地址');
  if (!cap || cap < 2) return toast('请填写可容纳人数');
  if (!intro) return toast('请填写场地介绍');
  if (!wx) return toast('请填写联系人微信号');
  var r = store.applyRole('venue', { name: name, type: type, address: addr, capacity: String(cap), intro: intro, photos: applyState.vPhotos, wechatId: wx });
  if (!r.ok) return toast(r.msg);
  toast('已提交，等待审核');
  renderApplyContent(document.getElementById('app'), 'venue');
}

/* ========== 页面：管理中心 ========== */
var adminTab = 'event';

function renderAdmin(app) {
  store.init();
  if (!store.isAdmin()) {
    var html = navbar('平台管理');
    html += '<div class="card" style="text-align:center;padding:2rem 1rem;"><div style="font-size:0.7rem;color:#6E6A82;margin-bottom:0.5rem;">输入管理口令</div>' +
      '<input class="input" id="adminPwd" type="password" placeholder="请输入口令" style="text-align:center;"/>' +
      '<button class="btn-primary" style="margin-top:0.6rem;height:2.1rem;line-height:2.1rem;" onclick="tryAdmin()">进入管理中心</button>' +
      '<div style="font-size:0.55rem;color:#C0BCD0;margin-top:0.5rem;">演示口令：888888</div></div>';
    app.innerHTML = html;
    return;
  }
  renderAdminTab(app, adminTab);
}

function renderAdminTab(app, tab) {
  adminTab = tab;
  var eStats = store.getAuditStats();
  var pendingApps = store.getApplications('pending');
  var orgPendingCount = pendingApps.filter(function(a) { return a.type === 'organizer'; }).length;
  var venuePendingCount = pendingApps.filter(function(a) { return a.type === 'venue'; }).length;

  var html = navbar('管理中心');
  html += '<div class="admin-tabs">' +
    '<div class="admin-tab ' + (tab === 'event' ? 'on' : '') + '" onclick="renderAdminTab2(\'event\')">活动管理' + (eStats.pending ? '(' + eStats.pending + ')' : '') + '</div>' +
    '<div class="admin-tab ' + (tab === 'organizer' ? 'on' : '') + '" onclick="renderAdminTab2(\'organizer\')">主理人管理' + (orgPendingCount ? '(' + orgPendingCount + ')' : '') + '</div>' +
    '<div class="admin-tab ' + (tab === 'venue' ? 'on' : '') + '" onclick="renderAdminTab2(\'venue\')">场地管理' + (venuePendingCount ? '(' + venuePendingCount + ')' : '') + '</div>' +
  '</div>';

  if (tab === 'event') {
    var pendingList = store.getAuditList('pending');
    var doneList = store.getAuditList('done');

    html += '<div class="admin-section-title">待审核（' + pendingList.length + '）</div>';
    if (pendingList.length) {
      pendingList.forEach(function(e) {
        html += '<div class="admin-card">' +
          '<div class="ac-card-head" onclick="navigate(\'#/detail/' + e.id + '\')">' +
            '<img class="ac-cover" src="' + (e.cover || '') + '"/>' +
            '<div class="ac-head-main"><div class="ac-title">' + e.title + '</div>' +
            '<div class="ac-sub">' + e.dateText + '</div>' +
            '<div class="ac-sub ellipsis">' + e.address + '</div></div>' +
            '<span class="admin-badge a-pending">待审核</span></div>' +
          '<div class="ac-sub">主理人：' + (e.organizer && e.organizer.nickname || '') + '　微信号：' + (e.organizer && e.organizer.wechatId || '未留') + '</div>' +
          '<div class="ac-sub" style="color:#C0BCD0;">提交于 ' + e.createdText + '</div>' +
          '<div class="admin-actions"><button class="btn-ghost" onclick="adminRejectOpen(\'' + e.id + '\')">拒绝</button><button class="btn-primary" onclick="adminApprove(\'' + e.id + '\')">通过审核</button></div>' +
        '</div>';
      });
    } else {
      html += '<div class="empty"><div class="empty-text">没有待审核的活动</div></div>';
    }

    if (doneList.length) {
      html += '<div class="admin-section-title">已处理（' + doneList.length + '）</div>';
      doneList.forEach(function(e) {
        var closedBadge = e.closed ? '<span class="admin-badge a-no" style="margin-left:0.2rem;">已下架</span>' : '';
        html += '<div class="admin-card">' +
          '<div class="ac-card-head" onclick="navigate(\'#/detail/' + e.id + '\')">' +
            '<img class="ac-cover" src="' + (e.cover || '') + '"/>' +
            '<div class="ac-head-main"><div class="ac-title">' + e.title + '</div>' +
            '<div class="ac-sub">' + e.dateText + '</div></div>' +
            '<span class="admin-badge ' + e.auditClass + '">' + e.auditText + '</span>' + closedBadge + '</div>' +
          '<div class="ac-sub" style="color:#C0BCD0;">' + (e.auditedText || e.createdText) + (e.auditNote ? '　理由：' + e.auditNote : '') + '</div>';
        if (e.auditStatus === 'approved') {
          html += '<div class="admin-actions">';
          if (e.closed) {
            html += '<button class="btn-ghost" onclick="adminOnlineEvent(\'' + e.id + '\')">上架</button>';
          } else {
            html += '<button class="btn-ghost" onclick="adminOfflineEvent(\'' + e.id + '\')">下架</button>';
          }
          html += '<button class="btn-ghost" style="color:#EF5350;background:#FDECEC;" onclick="adminDeleteEvent(\'' + e.id + '\')">删除</button></div>';
        }
        html += '</div>';
      });
    }

  } else if (tab === 'organizer') {
    var orgPending = store.getApplications('pending').filter(function(a) { return a.type === 'organizer'; });
    var orgDone = store.getApplications('done').filter(function(a) { return a.type === 'organizer'; });

    html += '<div class="admin-section-title">待审核（' + orgPending.length + '）</div>';
    if (orgPending.length) {
      orgPending.forEach(function(a) {
        html += '<div class="admin-card">' +
          '<div class="ac-card-head">' +
            '<img class="ac-cover ac-cover-round" src="' + (a.avatar || '') + '"/>' +
            '<div class="ac-head-main"><div class="ac-title">' + a.nickname + '</div>' +
            '<div class="ac-sub">方向：' + (a.form.field || '') + '</div></div>' +
            '<span class="admin-badge a-pending">待审核</span></div>' +
          '<div class="ac-sub">经验：' + (a.form.exp || '') + '</div>' +
          '<div class="ac-sub">微信号：' + (a.form.wechatId || '未留') + '</div>' +
          '<div class="ac-sub" style="color:#C0BCD0;">提交于 ' + a.createdText + '</div>' +
          '<div class="admin-actions"><button class="btn-ghost" onclick="reviewApp(\'' + a.id + '\',false)">拒绝</button><button class="btn-primary" onclick="reviewApp(\'' + a.id + '\',true)">通过</button></div>' +
        '</div>';
      });
    } else {
      html += '<div class="empty"><div class="empty-text">没有待审核的主理人申请</div></div>';
    }

    if (orgDone.length) {
      html += '<div class="admin-section-title">已处理（' + orgDone.length + '）</div>';
      orgDone.forEach(function(a) {
        html += '<div class="admin-card">' +
          '<div class="ac-card-head">' +
            '<img class="ac-cover ac-cover-round" src="' + (a.avatar || '') + '"/>' +
            '<div class="ac-head-main"><div class="ac-title">' + a.nickname + '</div>' +
            '<div class="ac-sub">方向：' + (a.form.field || '') + '</div></div>' +
            '<span class="admin-badge ' + (a.status === 'approved' ? 'a-ok' : 'a-no') + '">' + a.statusText + '</span></div>' +
          '<div class="ac-sub" style="color:#C0BCD0;">' + (a.auditedText || a.createdText) + (a.note ? '　理由：' + a.note : '') + '</div>';
        if (a.status === 'approved') {
          html += '<div class="admin-actions"><button class="btn-ghost" style="color:#EF5350;background:#FDECEC;" onclick="adminRevokeApproval(\'organizer\',\'' + a.openid + '\')">撤销资格</button></div>';
        }
        html += '</div>';
      });
    }

  } else if (tab === 'venue') {
    var venuePending = store.getApplications('pending').filter(function(a) { return a.type === 'venue'; });
    var venueDone = store.getApplications('done').filter(function(a) { return a.type === 'venue'; });

    html += '<div class="admin-section-title">待审核（' + venuePending.length + '）</div>';
    if (venuePending.length) {
      venuePending.forEach(function(a) {
        html += '<div class="admin-card">' +
          '<div class="ac-card-head">' +
            '<div class="ac-head-main"><div class="ac-title">' + (a.form.name || '') + '</div>' +
            '<div class="ac-sub">' + (a.form.type || '') + ' · 容纳' + (a.form.capacity || '') + '人</div>' +
            '<div class="ac-sub ellipsis">' + (a.form.address || '') + '</div></div>' +
            '<span class="admin-badge a-pending">待审核</span></div>' +
          '<div class="ac-sub">介绍：' + (a.form.intro || '') + '</div>';
        if (a.form.photos && a.form.photos.length) {
          html += '<div class="form-photos">';
          a.form.photos.forEach(function(p) { html += '<img class="form-photo" src="' + p + '"/>'; });
          html += '</div>';
        }
        html += '<div class="ac-sub">联系人：' + (a.form.wechatId || '未留') + '</div>' +
          '<div class="ac-sub" style="color:#C0BCD0;">提交于 ' + a.createdText + '</div>' +
          '<div class="admin-actions"><button class="btn-ghost" onclick="reviewApp(\'' + a.id + '\',false)">拒绝</button><button class="btn-primary" onclick="reviewApp(\'' + a.id + '\',true)">通过</button></div>' +
        '</div>';
      });
    } else {
      html += '<div class="empty"><div class="empty-text">没有待审核的场地申请</div></div>';
    }

    if (venueDone.length) {
      html += '<div class="admin-section-title">已处理（' + venueDone.length + '）</div>';
      venueDone.forEach(function(a) {
        html += '<div class="admin-card">' +
          '<div class="ac-card-head">' +
            '<div class="ac-head-main"><div class="ac-title">' + (a.form.name || '') + '</div>' +
            '<div class="ac-sub">' + (a.form.type || '') + ' · ' + (a.form.address || '') + '</div></div>' +
            '<span class="admin-badge ' + (a.status === 'approved' ? 'a-ok' : 'a-no') + '">' + a.statusText + '</span></div>' +
          '<div class="ac-sub" style="color:#C0BCD0;">' + (a.auditedText || a.createdText) + (a.note ? '　理由：' + a.note : '') + '</div>';
        if (a.status === 'approved') {
          html += '<div class="admin-actions"><button class="btn-ghost" style="color:#EF5350;background:#FDECEC;" onclick="adminRevokeApproval(\'venue\',\'' + a.openid + '\')">撤销资格</button></div>';
        }
        html += '</div>';
      });
    }
  }

  html += '<div class="safe-bottom"></div>';
  app.innerHTML = html;
}

function renderAdminTab2(tab) { renderAdminTab(document.getElementById('app'), tab); }

function tryAdmin() {
  var pwd = document.getElementById('adminPwd').value;
  if (store.unlockAdmin(pwd)) { toast('已进入管理模式'); renderAdmin(document.getElementById('app')); }
  else toast('口令错误');
}

function reviewApp(id, pass) {
  if (!pass) {
    var html = '<div class="panel-title">拒绝申请</div><div class="field"><div class="field-label">拒绝理由</div><textarea class="field-textarea" id="appRejectNote" placeholder="请填写拒绝理由" maxlength="100"></textarea></div><button class="btn-primary panel-btn" onclick="doReviewApp(\'' + id + '\',false)">确认拒绝</button><div class="panel-cancel" onclick="closeModal()">取消</div>';
    showModal(html);
  } else {
    store.reviewApplication(id, true);
    toast('已通过');
    renderAdminTab(document.getElementById('app'), adminTab);
  }
}
function doReviewApp(id, pass) {
  var note = document.getElementById('appRejectNote').value;
  store.reviewApplication(id, false, note);
  closeModal();
  toast('已拒绝');
  renderAdminTab(document.getElementById('app'), adminTab);
}

function adminOfflineEvent(id) {
  store.offlineEvent(id);
  toast('已下架');
  renderAdminTab(document.getElementById('app'), adminTab);
}
function adminOnlineEvent(id) {
  store.onlineEvent(id);
  toast('已上架');
  renderAdminTab(document.getElementById('app'), adminTab);
}
function adminDeleteEvent(id) {
  var html = '<div class="panel-title">确认删除活动？</div>' +
    '<div style="font-size:0.62rem;color:#9A97A8;text-align:center;margin-bottom:0.6rem;">删除后无法恢复，活动数据和报名记录都会清除</div>' +
    '<button class="btn-primary panel-btn" style="background:linear-gradient(135deg,#EF5350,#E53935);" onclick="doDeleteEvent(\'' + id + '\')">确认删除</button>' +
    '<div class="panel-cancel" onclick="closeModal()">取消</div>';
  showModal(html);
}
function doDeleteEvent(id) {
  store.deleteEvent(id);
  closeModal();
  toast('已删除');
  renderAdminTab(document.getElementById('app'), adminTab);
}
function adminRevokeApproval(type, openid) {
  store.revokeApproval(type, openid);
  toast('已撤销资格');
  renderAdminTab(document.getElementById('app'), adminTab);
}

/* ========== 页面：主理人主页 ========== */
function renderOrganizer(app, openid) {
  store.init();
  var org = store.getOrganizer(openid);
  if (!org) { app.innerHTML = navbar('主理人') + '<div class="empty"><div class="empty-text">主理人不存在</div></div>'; return; }
  var events = store.getOrganizerEvents(openid);
  var html = navbar(org.nickname);
  html += '<div class="org-header">' +
    '<img class="avatar" src="' + (org.avatar || '') + '"/>' +
    '<div class="nickname">' + org.nickname + '</div>' +
    '<div class="org-intro-text">' + (org.intro || '') + '</div></div>';
  if (org.introText) {
    html += '<div class="card"><div class="sec-title">关于 TA</div><div class="org-intro-card">' + org.introText + '</div>';
    if (org.introImages && org.introImages.length) {
      html += '<div class="org-intro-imgs">' + org.introImages.map(function(img) { return '<img src="' + img + '"/>'; }).join('') + '</div>';
    }
    html += '</div>';
  }
  html += '<div class="card"><div class="sec-title">TA 发起的活动（' + events.length + '）</div></div>';
  if (events.length) {
    html += '<div class="feed">' + events.map(eventCardHTML).join('') + '</div>';
  } else {
    html += '<div class="empty"><div class="empty-text">还没有发起活动</div></div>';
  }
  html += '<div class="safe-bottom"></div>';
  app.innerHTML = html;
}

/* ========== 页面：我的 ========== */
function renderMy(app) {
  store.init();
  var user = store.getUser();
  var role = store.roleText(user);
  var myEvents = store.getMyEvents();
  var mySignups = store.getMySignups();
  var html = navbar('我的');
  html += '<div class="my-header">' +
    '<img class="my-avatar" src="' + (user.avatar || ASSET + 'avatars/a12.png') + '"/>' +
    '<div class="my-nick">' + (user.nickname || '点击完善资料') + '</div>' +
    '<div class="my-role">' + role + '</div></div>';
  html += '<div class="my-stats">' +
    '<div class="my-stat" onclick="scrollToSection(\'myEventsSection\')" style="cursor:pointer;"><div class="my-stat-num">' + myEvents.length + '</div><div class="my-stat-label">发起活动</div></div>' +
    '<div class="my-stat" onclick="scrollToSection(\'mySignupsSection\')" style="cursor:pointer;"><div class="my-stat-num">' + mySignups.length + '</div><div class="my-stat-label">已报名</div></div>' +
  '</div>';

  html += '<div class="my-section"><div class="my-section-title">账户</div>' +
    '<div class="my-link" onclick="showProfileModal(\'\')"><span class="my-link-text">完善资料</span><span class="my-link-arrow">›</span></div>' +
    '<div class="my-link" onclick="navigate(\'#/apply?type=organizer\')"><span class="my-link-text">成为主理人</span><span class="my-link-arrow">›</span></div>' +
    '<div class="my-link" onclick="navigate(\'#/apply?type=venue\')"><span class="my-link-text">场地入驻</span><span class="my-link-arrow">›</span></div></div>';

  if (mySignups.length) {
    html += '<div class="my-section" id="mySignupsSection"><div class="my-section-title">我报名的</div>';
    mySignups.forEach(function(e) {
      html += '<div class="my-link" onclick="navigate(\'#/detail/' + e.id + '\')"><span class="my-link-text">' + e.title + '</span><span class="my-link-arrow">' + e.dateText + ' ›</span></div>';
    });
    html += '</div>';
  }

  if (myEvents.length) {
    html += '<div class="my-section" id="myEventsSection"><div class="my-section-title">我发起的</div>';
    myEvents.forEach(function(e) {
      html += '<div class="my-link" onclick="navigate(\'#/detail/' + e.id + '\')"><span class="my-link-text">' + e.title + '</span><span class="my-link-arrow"><span class="admin-badge ' + e.auditClass + '" style="margin-right:0.2rem;">' + e.auditText + '</span> ›</span></div>';
    });
    html += '</div>';
  }

  html += '<div class="my-section"><div class="my-link" onclick="navigate(\'#/admin\')"><span class="my-link-text">平台管理</span><span class="my-link-arrow">›</span></div></div>';
  html += '<div class="foot-note">一起唱游 · 让每一场歌唱都有同路人</div>';
  html += renderTabBar('my');
  app.innerHTML = html;
}

/* ========== 页面：报名成功 ========== */
function renderSuccess(app, id) {
  store.init();
  var e = store.getEvent(id);
  if (!e) { app.innerHTML = navbar('报名成功') + '<div class="empty"><div class="empty-text">活动不存在</div></div>'; return; }
  var user = store.getUser();
  var signed = store.isSigned(id, user.openid);
  var html = navbar('报名成功');
  if (signed) {
    html += '<div class="success-icon">✅</div><div class="success-title">报名成功！</div><div class="success-sub">' + e.title + '</div>';
    html += '<div class="card qr-card"><div class="sec-title">扫码进群</div>';
    if (e.groupQr) html += '<img class="qr-img" src="' + e.groupQr + '"/>';
    html += '<div class="qr-tip">长按二维码识别，加入活动微信群</div></div>';
  } else {
    html += '<div class="card" style="text-align:center;padding:2rem;"><div style="font-size:0.7rem;color:#9A97A8;">你还没有报名该活动</div><button class="btn-primary" style="width:60%;height:2.1rem;line-height:2.1rem;margin-top:0.6rem;" onclick="navigate(\'#/detail/' + id + '\')">去报名</button></div>';
  }
  html += '<div class="safe-bottom"></div>';
  app.innerHTML = html;
}

/* ========== 页面：报名管理 ========== */
function renderManage(app, id) {
  store.init();
  var e = store.getEvent(id);
  if (!e) { app.innerHTML = navbar('报名管理') + '<div class="empty"><div class="empty-text">活动不存在</div></div>'; return; }
  var signs = store.getEventSignups(id);
  var html = navbar('报名管理');
  html += '<div class="card"><div class="sec-title">' + e.title + '</div><div class="ac-sub">已报 ' + signs.length + ' / ' + e.maxPeople + ' 人</div></div>';
  html += '<div class="card"><div class="sec-title">报名列表（' + signs.length + '）</div>';
  if (signs.length) {
    signs.forEach(function(s) {
      html += '<div class="sign-row"><img class="sign-av" src="' + (s.avatar || '') + '"/><div class="sign-main"><div class="sign-name">' + s.nickname + (s.phone ? ' · ' + s.phone : '') + '</div>' + (s.note ? '<div class="sign-note">' + s.note + '</div>' : '') + '<div style="font-size:0.5rem;color:#C0BCD0;width:100%;">' + s.createdText + '</div></div></div>';
    });
  } else {
    html += '<div class="att-none">还没有人报名</div>';
  }
  html += '</div>';
  html += '<div class="card"><div class="sec-title">群二维码</div>';
  if (e.groupQr) html += '<img class="qr-img" src="' + e.groupQr + '" style="width:6rem;height:6rem;"/>';
  else html += '<div class="att-none">暂无群二维码</div>';
  html += '<div style="margin-top:0.4rem;"><button class="btn-ghost" style="height:1.8rem;line-height:1.8rem;font-size:0.62rem;" onclick="uploadGroupQr(\'' + id + '\')">上传/更换群二维码</button></div>';
  html += '<div class="label-tip" style="margin-top:0.25rem;">联系主理人获取微信群二维码后上传，报名成功的人可看到</div></div>';
  html += '<input type="file" id="qrFileInput" accept="image/*" style="display:none"/>';
  html += '<div class="safe-bottom"></div>';
  app.innerHTML = html;
}

/* ========== 通用导航栏 ========== */
function navbar(title) {
  return '<div class="navbar"><div class="navbar-back" onclick="history.back()"><span class="navbar-back-arrow">‹</span><span>返回</span></div><div class="navbar-title">' + title + '</div></div>';
}

/* ========== 群二维码上传（管理页） ========== */
var qrTargetEventId = '';
function uploadGroupQr(eventId) {
  qrTargetEventId = eventId;
  var fi = document.getElementById('qrFileInput');
  if (!fi) return;
  fi.value = '';
  fi.click();
}
document.addEventListener('change', function(e) {
  if (e.target.id === 'qrFileInput') handleQrUpload(e.target.files);
}, true);
async function handleQrUpload(files) {
  if (!files || !files.length) return;
  var url = await store.compressImage(files[0], 800);
  store.setGroupQr(qrTargetEventId, url);
  toast('群二维码已上传');
  renderManage(document.getElementById('app'), qrTargetEventId);
}

/* ========== 启动 ========== */
store.init();
router();
