// 本地降级生成器：后端不可用 / 未配置 LLM 时，用模板生成可用的邮件草稿。
// 保证 demo 在「无后端、无 API key」的情况下也能完整跑通全流程。
// 真实质量以 server 端 LLM 生成为准。
const { getScene } = require('../data/scenes.js')

const pick = (v, fallback) => (v && String(v).trim()) || fallback

// —— 英文模板（外贸/求职常用）——
const EN_TEMPLATES = {
  quotation(f) {
    return {
      title: `Quotation for ${pick(f.product, 'Your Inquiry')}`,
      content:
`Dear ${pick(f.recipient, 'Sir or Madam')},

Thank you for your interest in our products. Please find our quotation below for your reference:

Product: ${pick(f.product, '-')}
Quotation details: ${pick(f.quote, '-')}
${f.extra ? '\nAdditional notes: ' + f.extra + '\n' : ''}
We are confident that our products will meet your requirements. Please feel free to contact us if you have any questions.

Best regards,
[Your Name]
[Company Name]`
    }
  },
  payment_reminder(f) {
    return {
      title: `Friendly Payment Reminder — ${pick(f.amount, 'Outstanding Balance')}`,
      content:
`Dear ${pick(f.recipient, 'Valued Customer')},

I hope this email finds you well. This is a gentle reminder regarding the outstanding payment of ${pick(f.amount, 'the invoiced amount')}.

${pick(f.overdue, 'According to our records, the payment is now past due.')}
${f.relation ? '\nWe truly value our cooperation (' + f.relation + ') and appreciate your prompt attention to this matter.\n' : ''}
Could you kindly advise the expected payment date? Please let us know if you need any documents from our side.

Thank you for your cooperation.

Best regards,
[Your Name]`
    }
  },
  cover_letter(f) {
    return {
      title: `Application for ${pick(f.position, 'the Position')} — [Your Name]`,
      content:
`Dear Hiring Manager,

I am writing to apply for the ${pick(f.position, 'open')} position at ${pick(f.company, 'your company')}.

${pick(f.highlight, 'I believe my background and experience make me a strong fit for this role.')}
${f.motivation ? '\n' + f.motivation + '\n' : ''}
I have attached my resume for your review and would welcome the opportunity to discuss how I can contribute to your team.

Thank you for your time and consideration.

Sincerely,
[Your Name]`
    }
  }
}

// —— 中文模板 ——
const ZH_TEMPLATES = {
  leave(f) {
    return {
      title: `请假申请（${pick(f.dates, '近期')}）`,
      content:
`${pick(f.leader, '领导')}您好：

由于${pick(f.reason, '个人事务')}，需请假 ${pick(f.dates, '若干天')}，望批准。
${f.handover ? '\n请假期间工作安排：' + f.handover + '\n' : ''}
给您和团队带来不便，敬请谅解。如有紧急事项，我会保持电话畅通。

此致
敬礼

[你的姓名]`
    }
  },
  meeting(f) {
    return {
      title: `会议邀请：${pick(f.topic, '工作会议')}`,
      content:
`${pick(f.attendees, '各位同事')}好：

兹定于 ${pick(f.time, '近期')} 召开会议，主题为「${pick(f.topic, '工作讨论')}」。
${f.agenda ? '\n议程安排：\n' + f.agenda + '\n' : ''}
请提前安排好时间准时参加，如有冲突请提前告知。

谢谢！

[你的姓名]`
    }
  }
}

// —— 通用兜底模板（覆盖未特化的场景）——
function genericEmail(scene, f, english) {
  const fieldLines = scene.fields
    .filter(fd => f[fd.key])
    .map(fd => `${fd.label}: ${f[fd.key]}`)
    .join('\n')
  if (english) {
    return {
      title: `Regarding: ${scene.name}`,
      content:
`Dear ${pick(f.recipient || f.interviewer || f.leader || f.professor || f.company, 'Sir or Madam')},

I am writing to you regarding the following matter:

${fieldLines}

Please let me know if you need any further information. Looking forward to your reply.

Best regards,
[Your Name]`
    }
  }
  return {
    title: `${scene.name}`,
    content:
`${pick(f.recipient || f.interviewer || f.leader, '您')}好：

现就以下事项与您沟通：

${fieldLines}

如有任何问题，欢迎随时与我联系，期待您的回复。

祝好！

[你的姓名]`
  }
}

const TONE_NOTE = {
  formal: '',
  friendly: '',
  concise: ''
}

function mockGenerate(sceneId, formData) {
  const scene = getScene(sceneId)
  if (!scene) return { title: '生成失败', content: '未知场景：' + sceneId, via: 'mock' }
  const english = !!formData.needEnglish
  const special = english ? EN_TEMPLATES[sceneId] : ZH_TEMPLATES[sceneId]
  const email = special ? special(formData) : genericEmail(scene, formData, english)
  return { ...email, via: 'mock', note: TONE_NOTE[formData.tone] || '' }
}

// 降级改写：纯文本变换，仅保证流程可用
function mockRewrite(email, adjustment) {
  let { title, content } = email
  switch (adjustment) {
    case 'shorter': {
      const paras = content.split('\n\n')
      content = paras.length > 3 ? [paras[0], paras[1], paras[paras.length - 1]].join('\n\n') : content
      break
    }
    case 'formal':
      content = content.replace(/你好[:：]/g, '您好：').replace(/谢谢[!！]/g, '非常感谢！')
      break
    case 'friendly':
      content = content + '\n\nP.S. 期待与您的进一步交流：）'
      break
    case 'translate':
      content = '[英文版需连接 AI 服务生成]\n\n' + content
      break
    default:
      break
  }
  return { title, content, via: 'mock' }
}

module.exports = { mockGenerate, mockRewrite }
