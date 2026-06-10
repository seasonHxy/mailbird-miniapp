// 服务端模板降级（未配置 LLM 时使用），逻辑与小程序端 utils/mockGen.js 一致的简化版
function mockGenerate(scene, formData = {}) {
  const fields = Object.entries(formData)
    .filter(([k, v]) => !['tone', 'needEnglish'].includes(k) && v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  if (formData.needEnglish) {
    return {
      title: `Regarding: ${scene}`,
      content: `Dear Sir or Madam,\n\nI am writing regarding the following matter:\n\n${fields}\n\nLooking forward to your reply.\n\nBest regards,\n[Your Name]`,
      via: 'mock'
    }
  }
  return {
    title: `关于${scene}的邮件`,
    content: `您好：\n\n现就以下事项与您沟通：\n\n${fields}\n\n期待您的回复。\n\n[你的姓名]`,
    via: 'mock'
  }
}

function mockRewrite(email) {
  return { title: email.title, content: email.content, via: 'mock' }
}

module.exports = { mockGenerate, mockRewrite }
