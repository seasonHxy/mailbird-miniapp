// 场景配置中心：3 大类 × 15 个子场景，每个子场景定义自己的表单字段。
// 这份配置同时是「动态表单的渲染源」和「后端 prompt 的字段契约」。
// 字段 key 与 server/prompts/scenePrompts.js 一一对应。
//
// AI-mode ready：每个子场景的 fields 即未来 mcp.json inputSchema 的来源，
// 接入微信 AI 开发模式时可直接由本配置生成接口契约。

const CATEGORIES = [
  {
    id: 'trade',
    name: '外贸 / 商务',
    desc: '报价、催款、跟单、投诉、回复客户询盘等',
    color: '#4F63E6',
    bg: '#EEF1FE',
    icon: '📦',
    defaultEnglish: true,
    scenes: [
      {
        id: 'quotation', name: '报价邮件', icon: '💰',
        desc: '向客户提供产品或服务报价',
        fields: [
          { key: 'recipient', label: '收件人身份', type: 'input', required: true, placeholder: '例如：采购经理 / 客户公司名称' },
          { key: 'product', label: '产品 / 服务信息', type: 'input', required: true, placeholder: '例如：产品名称、规格、数量等' },
          { key: 'quote', label: '核心报价内容', type: 'textarea', required: true, placeholder: '例如：单价、总价、交期、付款条款等' },
          { key: 'extra', label: '补充说明', type: 'textarea', required: false, placeholder: '例如：优势、售后服务等（可选）' }
        ]
      },
      {
        id: 'payment_reminder', name: '催款邮件', icon: '⏰',
        desc: '礼貌提醒客户付款',
        fields: [
          { key: 'recipient', label: '客户称呼 / 公司', type: 'input', required: true, placeholder: '例如：ABC Company 财务负责人' },
          { key: 'amount', label: '应付金额', type: 'input', required: true, placeholder: '例如：5000 USD' },
          { key: 'overdue', label: '账期 / 逾期情况', type: 'textarea', required: true, placeholder: '例如：发票号、约定付款日、已逾期 15 天' },
          { key: 'relation', label: '合作背景', type: 'input', required: false, placeholder: '例如：长期合作客户（可选，影响措辞软硬）' }
        ]
      },
      {
        id: 'follow_up', name: '跟单邮件', icon: '🚚',
        desc: '跟进订单进度或后续事项',
        fields: [
          { key: 'recipient', label: '客户称呼', type: 'input', required: true, placeholder: '例如：Lisa / 采购总监' },
          { key: 'order', label: '订单信息', type: 'input', required: true, placeholder: '例如：订单号 #20240510，5000 件 T 恤' },
          { key: 'status', label: '当前进度', type: 'textarea', required: true, placeholder: '例如：已完成生产，预计下周发货' },
          { key: 'next', label: '希望推进的事项', type: 'input', required: false, placeholder: '例如：请确认收货地址 / 安排尾款（可选）' }
        ]
      },
      {
        id: 'complaint_reply', name: '投诉回复', icon: '🛡️',
        desc: '回应客户对产品或服务的投诉',
        fields: [
          { key: 'recipient', label: '客户称呼', type: 'input', required: true, placeholder: '例如：Mr. Smith' },
          { key: 'issue', label: '投诉的问题', type: 'textarea', required: true, placeholder: '例如：上批货物有 2% 存在划痕' },
          { key: 'solution', label: '解决方案', type: 'textarea', required: true, placeholder: '例如：补发 / 折扣 / 改进措施' },
          { key: 'compensation', label: '补偿安排', type: 'input', required: false, placeholder: '例如：下单立减 5%（可选）' }
        ]
      },
      {
        id: 'inquiry_reply', name: '回复客户询盘', icon: '💬',
        desc: '回复客户的询问或咨询',
        fields: [
          { key: 'recipient', label: '客户称呼', type: 'input', required: true, placeholder: '例如：潜在客户 John' },
          { key: 'inquiry', label: '客户询问内容', type: 'textarea', required: true, placeholder: '例如：询问 MOQ、单价和样品政策' },
          { key: 'answer', label: '你的回应要点', type: 'textarea', required: true, placeholder: '例如：MOQ 500 件，单价 $2.5，可提供免费样品' },
          { key: 'cta', label: '希望客户下一步', type: 'input', required: false, placeholder: '例如：约视频会议 / 确认样品地址（可选）' }
        ]
      }
    ]
  },
  {
    id: 'career',
    name: '求职 / 留学',
    desc: '求职信、面试跟进、套磁、推荐信请求、拒 offer 等',
    color: '#1FA06B',
    bg: '#E9F7F0',
    icon: '🎓',
    defaultEnglish: true,
    scenes: [
      {
        id: 'cover_letter', name: '求职信', icon: '📄',
        desc: '应聘职位的自荐邮件',
        fields: [
          { key: 'position', label: '应聘职位', type: 'input', required: true, placeholder: '例如：市场经理 / Flutter 工程师' },
          { key: 'company', label: '公司名称', type: 'input', required: true, placeholder: '例如：字节跳动' },
          { key: 'highlight', label: '核心优势 / 经历', type: 'textarea', required: true, placeholder: '例如：3 年相关经验，主导过 XX 项目' },
          { key: 'motivation', label: '求职动机', type: 'input', required: false, placeholder: '例如：认同公司产品理念（可选）' }
        ]
      },
      {
        id: 'interview_follow_up', name: '面试跟进', icon: '🤝',
        desc: '面试后的感谢与跟进',
        fields: [
          { key: 'interviewer', label: '面试官称呼', type: 'input', required: true, placeholder: '例如：王总监 / Hiring Manager' },
          { key: 'position', label: '面试职位', type: 'input', required: true, placeholder: '例如：产品经理' },
          { key: 'time', label: '面试时间', type: 'input', required: true, placeholder: '例如：上周三下午' },
          { key: 'addition', label: '想补充表达的内容', type: 'textarea', required: false, placeholder: '例如：对某个问题的补充想法（可选）' }
        ]
      },
      {
        id: 'taoci', name: '套磁邮件', icon: '🔬',
        desc: '联系意向导师 / 教授',
        fields: [
          { key: 'professor', label: '教授称呼及研究方向', type: 'input', required: true, placeholder: '例如：Prof. Lee，方向为计算机视觉' },
          { key: 'background', label: '你的研究背景', type: 'textarea', required: true, placeholder: '例如：本科课题、论文、项目经历' },
          { key: 'intent', label: '申请意向', type: 'input', required: true, placeholder: '例如：2027 Fall PhD / 硕士研究助理' }
        ]
      },
      {
        id: 'recommendation_request', name: '请求推荐信', icon: '✉️',
        desc: '请老师 / 上级写推荐信',
        fields: [
          { key: 'recommender', label: '推荐人称呼及关系', type: 'input', required: true, placeholder: '例如：张教授，大三专业课老师' },
          { key: 'target', label: '申请目标', type: 'input', required: true, placeholder: '例如：申请 NUS 硕士项目' },
          { key: 'materials', label: '可提供的材料', type: 'textarea', required: false, placeholder: '例如：简历、成绩单、个人陈述（可选）' }
        ]
      },
      {
        id: 'decline_offer', name: '拒绝 Offer', icon: '🙏',
        desc: '礼貌婉拒录用通知',
        fields: [
          { key: 'company', label: '公司名称', type: 'input', required: true, placeholder: '例如：XX 科技' },
          { key: 'position', label: '职位', type: 'input', required: true, placeholder: '例如：高级运营' },
          { key: 'reason', label: '婉拒理由', type: 'input', required: false, placeholder: '例如：已接受其他机会（可选，不填则委婉带过）' }
        ]
      }
    ]
  },
  {
    id: 'workplace',
    name: '日常职场',
    desc: '请假、辞职、感谢、道歉、会议邀约等',
    color: '#D97B29',
    bg: '#FCF3E7',
    icon: '💼',
    defaultEnglish: false,
    scenes: [
      {
        id: 'leave', name: '请假邮件', icon: '🏖️',
        desc: '向领导请假',
        fields: [
          { key: 'leader', label: '领导称呼', type: 'input', required: true, placeholder: '例如：李经理' },
          { key: 'dates', label: '请假时间', type: 'input', required: true, placeholder: '例如：6 月 15 日至 6 月 17 日，共 3 天' },
          { key: 'reason', label: '请假原因', type: 'input', required: true, placeholder: '例如：家中有事 / 身体不适' },
          { key: 'handover', label: '工作交接安排', type: 'textarea', required: false, placeholder: '例如：紧急事项可联系同事小王（可选）' }
        ]
      },
      {
        id: 'resignation', name: '辞职邮件', icon: '👋',
        desc: '正式提出离职',
        fields: [
          { key: 'leader', label: '领导称呼', type: 'input', required: true, placeholder: '例如：王总' },
          { key: 'lastDay', label: '期望离职日期', type: 'input', required: true, placeholder: '例如：7 月 15 日（按合同提前 30 天）' },
          { key: 'reason', label: '离职原因', type: 'input', required: false, placeholder: '例如：个人发展规划（可选）' },
          { key: 'thanks', label: '想表达的感谢', type: 'textarea', required: false, placeholder: '例如：感谢团队两年来的培养（可选）' }
        ]
      },
      {
        id: 'thanks', name: '感谢邮件', icon: '💐',
        desc: '正式表达感谢',
        fields: [
          { key: 'recipient', label: '感谢对象', type: 'input', required: true, placeholder: '例如：合作部门的陈老师' },
          { key: 'matter', label: '感谢事由', type: 'textarea', required: true, placeholder: '例如：项目期间多次协助解决技术问题' }
        ]
      },
      {
        id: 'apology', name: '道歉邮件', icon: '🙇',
        desc: '为失误正式致歉',
        fields: [
          { key: 'recipient', label: '道歉对象', type: 'input', required: true, placeholder: '例如：客户张总 / 合作方' },
          { key: 'matter', label: '事情经过', type: 'textarea', required: true, placeholder: '例如：昨日报表数据有误，给对方造成困扰' },
          { key: 'remedy', label: '弥补措施', type: 'textarea', required: false, placeholder: '例如：已更正并建立复核机制（可选）' }
        ]
      },
      {
        id: 'meeting', name: '会议邀约', icon: '📅',
        desc: '邀请参加会议',
        fields: [
          { key: 'attendees', label: '邀请对象', type: 'input', required: true, placeholder: '例如：产品组全体 / Mr. Brown' },
          { key: 'topic', label: '会议主题', type: 'input', required: true, placeholder: '例如：Q3 营销方案评审' },
          { key: 'time', label: '时间及方式', type: 'input', required: true, placeholder: '例如：周四 14:00，腾讯会议' },
          { key: 'agenda', label: '议程要点', type: 'textarea', required: false, placeholder: '例如：方案讲解 30min + 讨论 30min（可选）' }
        ]
      }
    ]
  }
]

const TONES = [
  { value: 'formal', label: '正式' },
  { value: 'friendly', label: '友好' },
  { value: 'concise', label: '简洁' }
]

function getCategory(catId) {
  return CATEGORIES.find(c => c.id === catId) || null
}

function getScene(sceneId) {
  for (const c of CATEGORIES) {
    const s = c.scenes.find(x => x.id === sceneId)
    if (s) return { ...s, category: c.id, categoryName: c.name, defaultEnglish: c.defaultEnglish, color: c.color }
  }
  return null
}

module.exports = { CATEGORIES, TONES, getCategory, getScene }
