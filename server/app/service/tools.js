const { Service } = require('egg');
const nodemailer = require('nodemailer');

const userEmail = 'wuxiaobaicai@126.com';
const transporter = nodemailer.createTransport({
  service: '126',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'PXNMMSJCIQLNWSKM',
  },
});

class ToolService extends Service {
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: userEmail,
      cc: userEmail, // 抄送
      to: email,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log('email error', err);
      return false;
    }
  }
}
module.exports = ToolService;
