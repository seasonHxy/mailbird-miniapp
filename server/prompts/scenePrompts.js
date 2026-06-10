// 场景化 Prompt 中心：每个场景一段角色设定 + 字段标签映射。
// 这是产品的核心资产——生成质量的差异主要来自这里的持续调优。

const SYSTEM_BASE = `你是一名资深商务邮件写作专家，精通中英文商务信函的格式与措辞。
要求：
1. 只输出 JSON，格式为 {"title": "邮件主题", "content": "邮件正文"}，不要输出任何其他内容。
2. 正文包含称呼、主体、结尾敬语和署名占位符 [你的姓名]。
3. 不要编造用户未提供的具体数字、日期或承诺。
4. 信息不足的部分用 [方括号占位符] 标出，让用户自行替换。`

// 每个场景的写作要求（与 miniprogram/data/scenes.js 的 id 一一对应）
const SCENE_BRIEF = {
  quotation: '写一封报价邮件：感谢询价，清晰列出产品与报价信息（可用列表），表达合作意愿，邀请进一步沟通。',
  payment_reminder: '写一封催款邮件：礼貌但明确，提及金额与逾期情况，给出付款方式或下一步，保留合作关系的善意。',
  follow_up: '写一封订单跟进邮件：同步当前进度，明确希望对方配合的事项与时间。',
  complaint_reply: '写一封投诉回复邮件：先真诚致歉并共情，再给出解决方案与补偿，最后表达改进承诺。',
  inquiry_reply: '写一封询盘回复邮件：逐条回应客户问题，突出优势，引导客户进入下一步（样品/会议/下单）。',
  cover_letter: '写一封求职信：开头点明应聘职位与来源，中间用成果论证胜任力，结尾礼貌请求面试机会。',
  interview_follow_up: '写一封面试后跟进邮件：感谢面试机会，简要重申匹配度，表达期待。',
  taoci: '写一封学术套磁邮件：表明对教授研究方向的具体了解，介绍自己的研究背景与匹配点，礼貌询问招生意向。',
  recommendation_request: '写一封请求推荐信的邮件：说明申请目标与截止时间，回顾与推荐人的交集，主动提供材料，给对方留拒绝余地。',
  decline_offer: '写一封婉拒 offer 的邮件：真诚感谢，明确但礼貌地婉拒，表达保持联系的意愿，不过度解释。',
  leave: '写一封请假邮件：说明请假时间与原因，主动给出工作交接安排，表达歉意。',
  resignation: '写一封辞职邮件：表明离职意向与期望日期，表达感谢，承诺做好交接，语气克制专业。',
  thanks: '写一封感谢邮件：具体说明感谢的事由与对方帮助带来的影响，真诚不浮夸。',
  apology: '写一封道歉邮件：直接承认问题不找借口，说明补救措施与预防方案。',
  meeting: '写一封会议邀约邮件：明确主题、时间、方式与议程，请对方确认是否参加。'
}

// 字段 key → 中文标签（拼用户输入用）
const FIELD_LABELS = {
  recipient: '收件人', product: '产品/服务', quote: '报价内容', extra: '补充说明',
  amount: '金额', overdue: '逾期情况', relation: '合作背景',
  order: '订单信息', status: '当前进度', next: '希望推进事项',
  issue: '投诉问题', solution: '解决方案', compensation: '补偿安排',
  inquiry: '客户询问', answer: '回应要点', cta: '希望对方下一步',
  position: '职位', company: '公司', highlight: '核心优势', motivation: '求职动机',
  interviewer: '面试官', time: '时间', addition: '补充内容',
  professor: '教授及方向', background: '研究背景', intent: '申请意向',
  recommender: '推荐人', target: '申请目标', materials: '可提供材料',
  reason: '原因', leader: '领导', dates: '请假时间', handover: '交接安排',
  lastDay: '期望离职日期', thanks: '想表达的感谢',
  matter: '事由', remedy: '弥补措施',
  attendees: '邀请对象', topic: '主题', agenda: '议程'
}

const TONE_DESC = {
  formal: '正式、严谨',
  friendly: '友好、亲切但保持专业',
  concise: '简洁直接、直奔重点'
}

// 组装一次生成所需的 system + user prompt
function buildGeneratePrompt(scene, formData = {}) {
  const brief = SCENE_BRIEF[scene]
  if (!brief) return null

  const lang = formData.needEnglish ? '英文（地道商务英语）' : '中文'
  const tone = TONE_DESC[formData.tone] || TONE_DESC.formal

  const inputs = Object.entries(formData)
    .filter(([k, v]) => !['tone', 'needEnglish'].includes(k) && v && String(v).trim())
    .map(([k, v]) => `${FIELD_LABELS[k] || k}：${v}`)
    .join('\n')

  return {
    system: SYSTEM_BASE,
    user: `${brief}\n\n语言：${lang}\n语气：${tone}\n\n用户提供的信息：\n${inputs}`
  }
}

const ADJUSTMENT_DESC = {
  formal: '改写得更正式、严谨',
  friendly: '改写得更友好、亲切',
  shorter: '精简内容，缩短为简洁版本，保留关键信息',
  detailed: '补充更多细节和铺垫，使表达更完整',
  translate: '翻译成地道的商务英文（若已是英文则翻译成中文）',
  rephrase: '换一种表达方式重写，意思保持不变'
}

function buildRewritePrompt(email, adjustment) {
  const desc = ADJUSTMENT_DESC[adjustment]
  if (!desc) return null
  return {
    system: SYSTEM_BASE,
    user: `请将以下邮件${desc}。\n\n邮件主题：${email.title}\n邮件正文：\n${email.content}`
  }
}

module.exports = { buildGeneratePrompt, buildRewritePrompt, SCENE_BRIEF }
