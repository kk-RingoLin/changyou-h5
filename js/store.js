/**
 * 数据服务层（H5 Mock 版）
 * 与小程序 utils/store.js 逻辑一致，仅把 wx.Storage 替换为 localStorage。
 * 资源路径从 /assets/ 改为 ../assets/（相对于 h5/index.html）。
 */
var SEED_VERSION = 8;
var K = { INIT: 'cy_init', EVENTS: 'cy_events', SIGNS: 'cy_signups', USER: 'cy_user', APPS: 'cy_apps' };

var ADMIN = {
  wechatId: 'changyou-admin',
  passcode: '888888',
  openids: []
};

var CITY = '深圳市';
var CITIES = [
  '深圳市', '广州市', '北京市', '上海市', '杭州市', '成都市',
  '重庆市', '武汉市', '西安市', '南京市', '长沙市', '苏州市',
  '天津市', '青岛市', '厦门市', '宁波市', '佛山市', '东莞市',
  '珠海市', '昆明市', '福州市', '合肥市', '郑州市', '济南市'
];

var ASSET = 'assets/';
var COVERS = [];
for (var i = 1; i <= 8; i++) COVERS.push(ASSET + 'covers/c' + i + '.jpg');
var AVATARS = [];
for (var i = 1; i <= 12; i++) AVATARS.push(ASSET + 'avatars/a' + i + '.png');
var DEMO_QR = ASSET + 'qr_demo.png';

var ORGANIZERS = [
  { openid: 'org_1', nickname: '阿泽', avatar: AVATARS[0], wechatId: 'aze-music', intro: '独立音乐人 / 吉他手，每周组一场不插电' },
  { openid: 'org_2', nickname: '桃桃', avatar: AVATARS[1], wechatId: 'taotao-uke', intro: '尤克里里爱好者，草坪音乐会常驻主理人' },
  { openid: 'org_3', nickname: '老周', avatar: AVATARS[2], wechatId: 'laozhou-ktv', intro: 'KTV 局长，华语金曲活点唱机' },
  { openid: 'org_4', nickname: 'Yuki', avatar: AVATARS[3], wechatId: 'yuki-sings', intro: '喜欢落日和合唱的策划人' },
  { openid: 'org_5', nickname: '大熊', avatar: AVATARS[4], wechatId: 'daxiong-camp', intro: '户外露营老炮，装备党' },
  { openid: 'org_6', nickname: '杉杉', avatar: AVATARS[5], wechatId: 'shanshan-folk', intro: '写词的，民谣深度患者' }
];

var NAMES = ['小海', '阿离', '麦子', '七号', '青柠', '东东', '栗子', '阿Ken', '苏苏', '橙子', '北北', '大毛', '暖暖', 'Leo', '弯弯', '石头', '甜甜', '阿布', '米粒', '阿灿', '图图', '小鹿', '南南', '一诺'];

var NOTES = [
  '我会弹吉他，可以伴奏', '带个大西瓜来给大家分', 'ukulele 新手，求带',
  '我可以唱和声', '自带手鼓一个', '带相机，帮大家拍照',
  '纯围观，负责鼓掌', '想唱一首《成都》', '会一点口琴',
  '带野餐垫两张', '我是气氛组', '可以帮忙调音'
];

var ORGANIZER_PROFILES = {
  org_1: {
    introText: '玩吉他第 8 年，白天写代码，晚上写歌。\n在不插电的夜晚里，最享受和大家一起把一首老歌唱出新味道。\n欢迎带着你的歌来，也欢迎只带着耳朵来。',
    introImages: [COVERS[0], COVERS[6], COVERS[4]]
  },
  org_2: {
    introText: '尤克里里重度爱好者，收集了 6 把琴。\n相信音乐最好的舞台，是草坪、阳光和一群愿意开口的人。',
    introImages: [COVERS[4], COVERS[1]]
  },
  org_3: {
    introText: '华语金曲活点唱机，从四大天王听到告五人。\n每月组一次 KTV 局，宗旨是：没有麦霸，只有合唱。',
    introImages: [COVERS[5], COVERS[7]]
  },
  org_4: {
    introText: '做过 30+ 场线下活动的策划人。\n喜欢落日、海和合唱，相信城市天台是离星星最近的 Livehouse。',
    introImages: [COVERS[1], COVERS[3]]
  },
  org_5: {
    introText: '户外老炮，装备党，营地歌单主理人。\n烤肉和吉他都在行的那种。',
    introImages: [COVERS[2], COVERS[6]]
  },
  org_6: {
    introText: '写词五年，作品发表在各类独立合辑。\n相信每座城市，都该有一首属于自己的民谣。',
    introImages: [COVERS[6], COVERS[5]]
  }
};

var PROVINCES = {
  '广东省': ['深圳市', '广州市', '东莞市', '佛山市', '珠海市', '惠州市', '中山市', '江门市'],
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '金华市'],
  '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市'],
  '四川省': ['成都市', '绵阳市', '宜宾市', '泸州市'],
  '湖北省': ['武汉市', '宜昌市', '襄阳市'],
  '湖南省': ['长沙市', '株洲市', '湘潭市', '岳阳市'],
  '福建省': ['厦门市', '福州市', '泉州市', '漳州市'],
  '山东省': ['青岛市', '济南市', '烟台市', '潍坊市'],
  '云南省': ['昆明市', '大理市', '丽江市'],
  '陕西省': ['西安市', '宝鸡市', '咸阳市'],
  '重庆市': ['重庆市'],
  '天津市': ['天津市']
};

function at(base, dOffset, h, m) {
  var d = new Date(base + dOffset * 86400000);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

function buildSeed() {
  var now = Date.now();
  var E = [];
  var S = [];
  var nameIdx = 0;

  function seedSigns(eventId, count) {
    for (var i = 0; i < count; i++) {
      S.push({
        id: uid('s'), eventId: eventId,
        openid: 'seed_u' + nameIdx,
        nickname: NAMES[nameIdx % NAMES.length],
        avatar: AVATARS[(nameIdx * 5 + 3) % AVATARS.length],
        note: (i % 3 !== 2) ? NOTES[nameIdx % NOTES.length] : '',
        phone: '',
        createdAt: now - (i + 2) * 3600000
      });
      nameIdx++;
    }
  }

  var APPS = [
    { id: 'a_seed_1', openid: 'seed_u3', type: 'organizer', nickname: '七号', avatar: AVATARS[8],
      form: { field: '民谣弹唱 / 指弹', exp: '组过 5 场咖啡馆弹唱会，稳定在 15 人左右', wechatId: 'qihao-folk' },
      status: 'pending', note: '', createdAt: now - 20 * 3600000, auditedAt: 0 },
    { id: 'a_seed_2', openid: 'seed_u9', type: 'venue', nickname: '橙子', avatar: AVATARS[9],
      form: { name: '橙光音乐角', type: '咖啡馆', address: '南山区 · 橙光咖啡（海岸城店）', capacity: '40', intro: '店内有无插电小舞台和音响，工作日晚上免费开放给音乐聚会', photos: [COVERS[1], COVERS[4]], wechatId: 'orange-cafe' },
      status: 'pending', note: '', createdAt: now - 8 * 3600000, auditedAt: 0 }
  ];

  function add(opt) {
    var id = 'e_seed_' + (E.length + 1);
    var ev = Object.assign({
      id: id, city: CITY,
      media: [{ type: 'image', url: opt.cover }],
      views: 0, closed: false,
      groupQr: DEMO_QR,
      auditStatus: 'approved', auditNote: '', auditedAt: 0,
      createdAt: now - (E.length + 1) * 86400000,
      latitude: 22.5431 + (E.length % 5) * 0.015,
      longitude: 114.0579 + (E.length % 4) * 0.018
    }, opt);
    E.push(ev);
    seedSigns(id, opt.signups || 0);
  }

  add({ title: '周五不插电之夜 · 弹唱到打烊', cover: COVERS[0], pastPhotos: [COVERS[1], COVERS[4], COVERS[6]],
    address: '南山区 · 山丘咖啡（科技园店）', startTime: at(now, 2, 19, 30), endTime: at(now, 2, 22, 0),
    maxPeople: 20, feeType: 'aa', feeDesc: 'AA约30元/人', organizer: ORGANIZERS[0], publisherOpenid: ORGANIZERS[0].openid,
    desc: '一周的工作结束了，带上你的琴（或者只带嗓子），来山丘咖啡一起弹琴唱歌。风格不限，民谣、流行、摇滚都可以，欢迎围观也欢迎上台。',
    flows: [{ time: '19:30', content: '签到入座，自由交流' }, { time: '20:00', content: '轮流弹唱，每人 2 首' }, { time: '21:20', content: '开放合唱环节' }, { time: '22:00', content: '合影留念，活动结束' }],
    signups: 12 });

  add({ title: '周末草坪音乐会 · 尤克里里小分队', cover: COVERS[4],
    address: '福田区 · 莲花山公园风筝广场', startTime: at(now, 4, 15, 0), endTime: at(now, 4, 17, 30),
    maxPeople: 12, feeType: 'free', feeDesc: '', organizer: ORGANIZERS[1], publisherOpenid: ORGANIZERS[1].openid,
    desc: '阳光、草坪和尤克里里最配了！我们带上野餐垫和小零食，在草坪上边弹边唱。不会弹也没关系，现场有简单教学，包教包会。',
    flows: [{ time: '15:00', content: '集合签到，铺野餐垫' }, { time: '15:20', content: '新手快闪教学' }, { time: '16:00', content: '分组弹唱 PK' }, { time: '17:00', content: '大合唱《小手拉大手》' }, { time: '17:30', content: '收拾场地，合影' }],
    signups: 8 });

  add({ title: 'KTV 华语金曲合唱局', cover: COVERS[5], pastPhotos: [COVERS[7], COVERS[1]],
    address: '罗湖区 · 纯K（国贸店）3楼大包', startTime: at(now, 1, 20, 0), endTime: at(now, 1, 23, 30),
    maxPeople: 15, feeType: 'prepay', feeDesc: '¥59/人（含房费+小食）', organizer: ORGANIZERS[2], publisherOpenid: ORGANIZERS[2].openid,
    desc: '每月一次的华语金曲专场！周杰伦、林俊杰、孙燕姿……歌单你来定。拒绝麦霸，轮流点歌，合唱优先，唱功不限，跑调也欢迎。',
    flows: [{ time: '20:00', content: '进场破冰' }, { time: '20:30', content: '金曲接龙' }, { time: '22:00', content: '主题合唱（周杰伦专场）' }, { time: '23:00', content: '自由点歌' }, { time: '23:30', content: '活动结束' }],
    signups: 15 });

  add({ title: '城市天台落日歌会', cover: COVERS[1], pastPhotos: [COVERS[3], COVERS[0], COVERS[6], COVERS[4]],
    address: '南山区 · 蛇口价值工厂天台', startTime: at(now, 6, 18, 0), endTime: at(now, 6, 20, 30),
    maxPeople: 30, feeType: 'aa', feeDesc: 'AA约20元/人', organizer: ORGANIZERS[3], publisherOpenid: ORGANIZERS[3].openid,
    desc: '在蛇口的天台，看着落日和海，唱到华灯初上。现场有音响和麦克风，你可以报名表演，也可以安静当听众。自带饮品更佳。',
    flows: [{ time: '18:00', content: '入场 & 落日打卡' }, { time: '18:40', content: '表演环节（提前报名）' }, { time: '19:50', content: '全场大合唱' }, { time: '20:30', content: '活动结束' }],
    signups: 24 });

  add({ title: 'Livehouse 开放麦 · 新人友好', cover: COVERS[7],
    address: '福田区 · 红糖罐 Livehouse', startTime: at(now, 3, 19, 0), endTime: at(now, 3, 21, 30),
    maxPeople: 20, feeType: 'prepay', feeDesc: '¥39/人（含一杯饮品）', organizer: ORGANIZERS[0], publisherOpenid: ORGANIZERS[0].openid,
    desc: '红糖罐的开放麦之夜，舞台留给每一个想唱歌的你。新人友好，观众更友好，唱完大家一起尖叫。想上台请提前把歌名报给主理人。',
    flows: [{ time: '19:00', content: '签到 & 报名排序' }, { time: '19:30', content: '开放麦开始，每人 1-2 首' }, { time: '21:00', content: '即兴 Jam 环节' }, { time: '21:30', content: '活动结束' }],
    signups: 9 });

  add({ title: '江边露营 · 篝火合唱计划', cover: COVERS[2],
    address: '宝安区 · 西湾红树林公园露营地', startTime: at(now, 8, 16, 0), endTime: at(now, 8, 21, 0),
    maxPeople: 16, feeType: 'aa', feeDesc: 'AA约80元/人（装备+食材）', organizer: ORGANIZERS[4], publisherOpenid: ORGANIZERS[4].openid,
    desc: '周末不过夜露营，搭天幕、烤肉、弹吉他，天黑以后点起「篝火」（卡式炉+氛围灯，安全合规）一起唱歌。装备由主理人统一准备，人到就行。',
    flows: [{ time: '16:00', content: '集合搭营' }, { time: '17:00', content: '自由活动（飞盘 / 桌游）' }, { time: '18:30', content: '烤肉晚餐' }, { time: '19:30', content: '篝火合唱' }, { time: '21:00', content: '收拾返程' }],
    signups: 6 });

  add({ title: '民谣歌词创作分享会', cover: COVERS[6],
    address: '南山区 · 旧天堂书店（华侨城店）', startTime: at(now, 5, 19, 30), endTime: at(now, 5, 21, 30),
    maxPeople: 10, feeType: 'free', feeDesc: '', organizer: ORGANIZERS[5], publisherOpenid: ORGANIZERS[5].openid,
    desc: '带上你写的词，或者带上你想改的歌。我们围坐一圈，聊聊民谣里的故事，互相给彼此的歌词提建议。会乐器可以带，现场即兴配乐。',
    flows: [{ time: '19:30', content: '自我介绍' }, { time: '19:50', content: '作品朗读 & 互评' }, { time: '20:50', content: '即兴配乐创作' }, { time: '21:30', content: '活动结束' }],
    signups: 4 });

  add({ title: '深夜钢琴弹唱小聚', cover: COVERS[3],
    address: '福田区 · 琴台艺术中心', startTime: at(now, -2, 20, 0), endTime: at(now, -2, 22, 0),
    maxPeople: 12, feeType: 'free', feeDesc: '', organizer: ORGANIZERS[3], publisherOpenid: ORGANIZERS[3].openid,
    desc: '三角钢琴开放使用的一晚，古典流行皆可，安静听歌也很好。',
    flows: [{ time: '20:00', content: '自由弹唱' }, { time: '21:00', content: '点歌环节' }, { time: '22:00', content: '活动结束' }],
    signups: 10 });

  add({ title: '周末街头弹唱快闪', cover: COVERS[2],
    address: '福田区 · 购物公园地铁站 C 口广场', startTime: at(now, 5, 16, 0), endTime: at(now, 5, 18, 0),
    maxPeople: 15, feeType: 'free', feeDesc: '', organizer: ORGANIZERS[1], publisherOpenid: ORGANIZERS[1].openid,
    desc: '街头快闪弹唱，唱完就走，把歌声留在街角。欢迎会乐器的朋友一起，也欢迎围观鼓掌。',
    flows: [{ time: '16:00', content: '集合调音' }, { time: '16:20', content: '快闪开唱' }, { time: '18:00', content: '结束合影' }],
    auditStatus: 'pending', signups: 0 });

  return { events: E, signups: S, apps: APPS };
}

/* ---------- localStorage 读写 ---------- */
function lsGet(key) { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function init() {
  if (lsGet(K.INIT) === SEED_VERSION) return;
  var seed = buildSeed();
  lsSet(K.EVENTS, seed.events);
  lsSet(K.SIGNS, seed.signups);
  lsSet(K.APPS, seed.apps);
  lsSet(K.INIT, SEED_VERSION);
}

function readEvents() { return lsGet(K.EVENTS) || []; }
function writeEvents(list) { lsSet(K.EVENTS, list); }
function readSigns() { return lsGet(K.SIGNS) || []; }
function writeSigns(list) { lsSet(K.SIGNS, list); }
function readApps() { return lsGet(K.APPS) || []; }
function writeApps(list) { lsSet(K.APPS, list); }

function getUser() {
  var u = lsGet(K.USER);
  if (!u) {
    u = { openid: 'u_me', nickname: '', avatar: '', intro: '', introText: '', introImages: [],
      organizerApproved: false, venueApproved: false, venue: null, adminUnlocked: false };
    lsSet(K.USER, u);
  }
  return u;
}

function setUser(patch) {
  var u = Object.assign({}, getUser(), patch);
  lsSet(K.USER, u);
  return u;
}

function roleOf(user) {
  user = user || getUser();
  if (user.adminUnlocked || ADMIN.openids.indexOf(user.openid) >= 0) return 'admin';
  if (user.organizerApproved && user.venueApproved) return 'both';
  if (user.organizerApproved) return 'organizer';
  if (user.venueApproved) return 'venue';
  return 'user';
}

function roleText(user) {
  var r = roleOf(user);
  var map = { admin: '平台管理员', both: '主理人 · 场地方', organizer: '主理人', venue: '场地方', user: '参与者' };
  return map[r] || '参与者';
}

function isAdmin() { return roleOf() === 'admin'; }

function unlockAdmin(pwd) {
  if (String(pwd || '').trim() === ADMIN.passcode) { setUser({ adminUnlocked: true }); return true; }
  return false;
}

/* ---------- 身份申请 ---------- */
function applyRole(type, form) {
  var user = getUser();
  if (!user.nickname) return { ok: false, msg: '请先完善昵称和头像' };
  if (type === 'organizer' && user.organizerApproved) return { ok: false, msg: '你已经是主理人了' };
  if (type === 'venue' && user.venueApproved) return { ok: false, msg: '你已经是场地方了' };
  var apps = readApps();
  var dup = apps.some(function(a) { return a.openid === user.openid && a.type === type && a.status === 'pending'; });
  if (dup) return { ok: false, msg: '已有待审核的申请，请耐心等待' };
  apps.unshift({ id: uid('a'), openid: user.openid, type: type, nickname: user.nickname, avatar: user.avatar,
    form: form, status: 'pending', note: '', createdAt: Date.now(), auditedAt: 0 });
  writeApps(apps);
  return { ok: true };
}

function getMyApplication(type) {
  var user = getUser();
  var list = readApps().filter(function(a) { return a.openid === user.openid && a.type === type; })
    .sort(function(a, b) { return b.createdAt - a.createdAt; });
  return list[0] || null;
}

function getApplications(tab) {
  var list = readApps().slice();
  if (tab === 'pending') {
    list = list.filter(function(a) { return a.status === 'pending'; }).sort(function(a, b) { return a.createdAt - b.createdAt; });
  } else {
    list = list.filter(function(a) { return a.status !== 'pending'; }).sort(function(a, b) { return (b.auditedAt || 0) - (a.auditedAt || 0); });
  }
  return list.map(function(a) {
    return Object.assign({}, a, {
      createdText: fmtFull(a.createdAt),
      auditedText: a.auditedAt ? fmtFull(a.auditedAt) : '',
      typeText: a.type === 'organizer' ? '主理人' : '场地方',
      statusText: a.status === 'pending' ? '待审核' : (a.status === 'approved' ? '已通过' : '未通过')
    });
  });
}

function getAppStats() {
  var list = readApps();
  return { pending: list.filter(function(a) { return a.status === 'pending'; }).length,
    done: list.filter(function(a) { return a.status !== 'pending'; }).length };
}

function reviewApplication(id, pass, note) {
  var apps = readApps();
  var a = apps.find(function(x) { return x.id === id; });
  if (!a) return;
  a.status = pass ? 'approved' : 'rejected';
  a.note = pass ? '' : (note || '');
  a.auditedAt = Date.now();
  writeApps(apps);
  if (pass && a.openid === getUser().openid) {
    if (a.type === 'organizer') { setUser({ organizerApproved: true }); }
    else { setUser({ venueApproved: true, venue: a.form }); }
  }
}

/* ---------- 活动相关 ---------- */
function signupsOf(eventId) { return readSigns().filter(function(s) { return s.eventId === eventId; }); }

function decorate(e) {
  var signs = signupsOf(e.id);
  var count = signs.length;
  var status = 'signup', statusText = '报名中', statusClass = 's-open';
  if (e.closed || Date.now() > e.endTime) { status = 'ended'; statusText = '已结束'; statusClass = 's-end'; }
  else if (count >= e.maxPeople) { status = 'full'; statusText = '已满员'; statusClass = 's-full'; }
  else if (count >= e.maxPeople * 0.8) { statusText = '即将满员'; statusClass = 's-hot'; }
  var feeText = e.feeType === 'free' ? '免费' : (e.feeType === 'aa' ? 'AA制' : (e.feeDesc || '收费'));
  return Object.assign({}, e, {
    signupCount: count,
    attendees: signs.slice(0, 5).map(function(s) { return s.avatar; }),
    status: status, statusText: statusText, statusClass: statusClass, feeText: feeText,
    timeText: fmtFull(e.startTime),
    dateText: fmtDate(e.startTime) + ' ' + fmtWeek(e.startTime),
    rangeText: fmtTime(e.startTime) + ' - ' + fmtTime(e.endTime)
  });
}

function auditFields(e) {
  var map = { pending: ['待审核', 'a-pending'], approved: ['已通过', 'a-ok'], rejected: ['未通过', 'a-no'] };
  var pair = map[e.auditStatus] || map.approved;
  return { auditText: pair[0], auditClass: pair[1] };
}

function getEventList(opts) {
  opts = opts || {};
  var tab = opts.tab || 'all';
  var keyword = (opts.keyword || '').trim().toLowerCase();
  var now = Date.now();
  var list = readEvents().filter(function(e) { return e.auditStatus === 'approved'; }).map(decorate);
  if (tab === 'week') {
    list = list.filter(function(e) { return e.status !== 'ended' && e.startTime - now <= 7 * 86400000; });
  }
  if (tab === 'hot') {
    list = list.filter(function(e) { return e.status !== 'ended'; }).sort(function(a, b) { return b.signupCount - a.signupCount; });
  } else {
    list = list.sort(function(a, b) {
      var ae = a.status === 'ended' ? 1 : 0, be = b.status === 'ended' ? 1 : 0;
      if (ae !== be) return ae - be;
      return a.startTime - b.startTime;
    });
  }
  if (keyword) {
    list = list.filter(function(e) { return (e.title + e.address + ((e.organizer && e.organizer.nickname) || '')).toLowerCase().indexOf(keyword) >= 0; });
  }
  return list;
}

function getHotEvents() {
  return readEvents().filter(function(e) { return e.auditStatus === 'approved'; }).map(decorate)
    .filter(function(e) { return e.status !== 'ended'; })
    .sort(function(a, b) { return b.signupCount - a.signupCount; }).slice(0, 3);
}

function getEvent(id) {
  var e = readEvents().find(function(x) { return x.id === id; });
  return e ? Object.assign(decorate(e), auditFields(e)) : null;
}

function incViews(id) {
  var list = readEvents();
  var e = list.find(function(x) { return x.id === id; });
  if (e) { e.views = (e.views || 0) + 1; writeEvents(list); }
}

function updateEvent(id, patch) {
  var list = readEvents();
  var e = list.find(function(x) { return x.id === id; });
  if (e) { Object.assign(e, patch); writeEvents(list); }
  return e;
}

function isSigned(eventId, openid) {
  return readSigns().some(function(s) { return s.eventId === eventId && s.openid === openid; });
}

function signup(eventId, extra) {
  var user = getUser();
  if (!user.nickname) return { ok: false, msg: '请先完善昵称和头像' };
  var e = readEvents().find(function(x) { return x.id === eventId; });
  if (!e) return { ok: false, msg: '活动不存在' };
  if (e.auditStatus !== 'approved') return { ok: false, msg: '活动未上架' };
  var d = decorate(e);
  if (d.status === 'ended') return { ok: false, msg: '活动已结束' };
  if (d.status === 'full') return { ok: false, msg: '名额已满' };
  if (isSigned(eventId, user.openid)) return { ok: false, msg: '你已报名该活动' };
  var signs = readSigns();
  signs.push({ id: uid('s'), eventId: eventId, openid: user.openid, nickname: user.nickname, avatar: user.avatar,
    note: (extra && extra.note) || '', phone: (extra && extra.phone) || '', createdAt: Date.now() });
  writeSigns(signs);
  return { ok: true };
}

function cancelSignup(eventId) {
  var user = getUser();
  writeSigns(readSigns().filter(function(s) { return !(s.eventId === eventId && s.openid === user.openid); }));
}

function publishEvent(data) {
  var user = getUser();
  if (!user.organizerApproved) return null;
  var events = readEvents();
  var id = uid('e');
  events.unshift(Object.assign({}, data, { id: id, createdAt: Date.now(), views: 0, closed: false,
    auditStatus: 'pending', auditNote: '', auditedAt: 0, publisherOpenid: user.openid }));
  writeEvents(events);
  return id;
}

function reviewEvent(id, pass, note) {
  updateEvent(id, { auditStatus: pass ? 'approved' : 'rejected', auditNote: pass ? '' : (note || ''), auditedAt: Date.now() });
}

function getOrganizer(openid) {
  var seedOrg = ORGANIZERS.find(function(o) { return o.openid === openid; });
  if (seedOrg) {
    var profile = ORGANIZER_PROFILES[openid] || {};
    return Object.assign({}, seedOrg, { introText: profile.introText || seedOrg.intro || '', introImages: profile.introImages || [] });
  }
  var user = getUser();
  if (user.openid === openid) {
    return { openid: user.openid, nickname: user.nickname || '我', avatar: user.avatar || (ASSET + 'avatars/a12.png'),
      intro: user.intro || '', introText: user.introText || '', introImages: user.introImages || [] };
  }
  var e = readEvents().find(function(x) { return x.publisherOpenid === openid; });
  if (e && e.organizer) return Object.assign({ introText: '', introImages: [] }, e.organizer);
  return null;
}

function getOrganizerEvents(openid) {
  return readEvents().filter(function(e) { return e.publisherOpenid === openid && e.auditStatus === 'approved'; })
    .map(decorate).sort(function(a, b) { return b.createdAt - a.createdAt; });
}

function getAuditList(tab) {
  var list = readEvents().slice();
  if (tab === 'pending') {
    list = list.filter(function(e) { return e.auditStatus === 'pending'; }).sort(function(a, b) { return a.createdAt - b.createdAt; });
  } else {
    list = list.filter(function(e) { return e.auditStatus !== 'pending'; }).sort(function(a, b) { return (b.auditedAt || b.createdAt) - (a.auditedAt || a.createdAt); });
  }
  return list.map(function(e) { return Object.assign(decorate(e), auditFields(e), {
    createdText: fmtFull(e.createdAt), auditedText: e.auditedAt ? fmtFull(e.auditedAt) : '' }); });
}

function getAuditStats() {
  var list = readEvents();
  return { pending: list.filter(function(e) { return e.auditStatus === 'pending'; }).length,
    approved: list.filter(function(e) { return e.auditStatus === 'approved'; }).length,
    rejected: list.filter(function(e) { return e.auditStatus === 'rejected'; }).length };
}

function getMyEvents() {
  var user = getUser();
  return readEvents().filter(function(e) { return e.publisherOpenid === user.openid; })
    .map(function(e) { return Object.assign(decorate(e), auditFields(e)); });
}

function getMySignups() {
  var user = getUser();
  var events = readEvents();
  return readSigns().filter(function(s) { return s.openid === user.openid; })
    .map(function(s) { var e = events.find(function(x) { return x.id === s.eventId; }); return e ? decorate(e) : null; })
    .filter(Boolean);
}

function getEventSignups(eventId) {
  return signupsOf(eventId).slice().sort(function(a, b) { return a.createdAt - b.createdAt; })
    .map(function(s) { return Object.assign({}, s, { createdText: fmtFull(s.createdAt) }); });
}

function closeEvent(id, closed) { updateEvent(id, { closed: closed !== false }); }

/** H5 版 saveFile：DataURL 直接返回，路径文件原样返回 */
function saveFile(tempPath) {
  return Promise.resolve(tempPath);
}

/* ---------- H5 图片上传辅助 ---------- */
function fileToDataURL(file) {
  return new Promise(function(resolve) {
    var reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = function() { resolve(''); };
    reader.readAsDataURL(file);
  });
}

/** 压缩图片到指定最大宽度，返回 DataURL */
function compressImage(file, maxWidth) {
  maxWidth = maxWidth || 800;
  return new Promise(function(resolve) {
    var reader = new FileReader();
    reader.onload = function() {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var w = img.width, h = img.height;
        if (w > maxWidth) { h = h * maxWidth / w; w = maxWidth; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = function() { resolve(reader.result); };
      img.src = reader.result;
    };
    reader.onerror = function() { resolve(''); };
    reader.readAsDataURL(file);
  });
}

var store = {
  CITY: CITY, CITIES: CITIES, ADMIN: ADMIN, PROVINCES: PROVINCES,
  init: init, getUser: getUser, setUser: setUser, roleOf: roleOf, roleText: roleText,
  isAdmin: isAdmin, unlockAdmin: unlockAdmin,
  getEventList: getEventList, getHotEvents: getHotEvents, getEvent: getEvent,
  incViews: incViews, updateEvent: updateEvent, isSigned: isSigned, signup: signup,
  cancelSignup: cancelSignup, publishEvent: publishEvent, reviewEvent: reviewEvent,
  applyRole: applyRole, getMyApplication: getMyApplication, getApplications: getApplications,
  getAppStats: getAppStats, reviewApplication: reviewApplication,
  getOrganizer: getOrganizer, getOrganizerEvents: getOrganizerEvents,
  getAuditList: getAuditList, getAuditStats: getAuditStats,
  getMyEvents: getMyEvents, getMySignups: getMySignups,
  getEventSignups: getEventSignups, closeEvent: closeEvent,
  saveFile: saveFile, compressImage: compressImage, fileToDataURL: fileToDataURL
};
