export const WelcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; color: #030712; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; }
    .header { color: #00D084; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
    .content { font-size: 16px; line-height: 1.5; color: #334155; }
    .footer { margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Welcome to UniVerse 🚀</div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>You're officially on the waitlist for UniVerse – the safest and most vibrant student marketplace built exclusively for verified campus students.</p>
      <p>We're building this because we believe finding a hostel bed frame, trading past questions, or booking a campus runner shouldn't require risking scams on random WhatsApp groups.</p>
      <p><strong>What's Next?</strong></p>
      <p>We'll notify you as soon as early access opens for your campus. In the meantime, you can share your referral link to move up the queue!</p>
      <p>Best,<br>The UniVerse Team</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} UniVerse. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
