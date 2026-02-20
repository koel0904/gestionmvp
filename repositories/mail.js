// mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Ejemplo: "smtp.gmail.com"
    port: process.env.EMAIL_PORT, // Ejemplo: 587
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico:w

        pass: process.env.EMAIL_PASS  // Tu contraseña o app password
    }
});

export class MailRepository {
    // Envía un correo genérico
    async sendMail({ to, subject, text, html }) {
        const mailOptions = {
            from: this.from,
            to,
            subject,
            text,
            html
        };
        return this.transporter.sendMail(mailOptions);
    }

    // Método específico para enviar códigos 2FA
    async send2FACode(email, code) {
        const subject = 'Tu código de verificación de inicio de sesión';
        const text = `Tu código de verificación es: ${code}. Este código expirará en 10 minutos.`;
        return this.sendMail({ to: email, subject, text });
    }

    //Metodo para enviar correos de recuperación de contraseña
    async sendPasswordReset(email, resetLink) {
        const subject = 'Instrucciones para restablecer tu contraseña';
        const text = `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}. Este enlace expirará en 1 hora.`;
        return this.sendMail({ to: email, subject, text });
    }

    // Metodo para enviar correos de bienvenida
    async sendWelcomeEmail(email) {
        const subject = '¡Bienvenido a nuestra plataforma!';
        const text = 'Gracias por registrarte en nuestra plataforma. Estamos emocionados de tenerte con nosotros.';
        return this.sendMail({ to: email, subject, text });
    }

    // Aquí se podrán añadir más métodos (plantillas, adjuntos, colas, etc.)
}

export default new MailRepository();