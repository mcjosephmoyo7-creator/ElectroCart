import { Request, Response } from 'express';
import transporter, { MAIL_FROM, MAIL_TO } from '../config/mailer.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const sendContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new AppError('Name, email and message are required', 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  const mailOptions = {
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo: email,
    subject: subject ? `[Contact Form] ${subject}` : '[Contact Form] New message',
    text: [
      `You received a new message from the ElectroCart contact form:`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject || 'N/A'}`,
      ``,
      `Message:`,
      message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">New Contact Form Message</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #334155;">Name:</td>
            <td style="padding: 8px 0; color: #334155;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #334155;">Email:</td>
            <td style="padding: 8px 0; color: #334155;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #334155;">Subject:</td>
            <td style="padding: 8px 0; color: #334155;">${subject || 'N/A'}</td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px; color: #334155; white-space: pre-wrap;">${message}</div>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Sent from the ElectroCart contact form.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ success: true, message: 'Message sent successfully' });
});
