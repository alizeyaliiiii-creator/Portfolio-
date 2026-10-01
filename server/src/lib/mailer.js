import nodemailer from 'nodemailer';

// Returns an async notify(msg) function; a no-op when SMTP isn't configured.
export function createMailer(config) {
  if (!config.smtp) return async () => {};
  const { host, port, user, pass } = config.smtp;
  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: user ? { user, pass } : undefined });
  return async ({ name, email, message }) => {
    await transport.sendMail({
      from: user || config.notifyTo,
      to: config.notifyTo,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
  };
}
