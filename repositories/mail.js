import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER;

console.log(user);

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Ejemplo: "smtp.gmail.com"
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined, // Ejemplo: 587
    secure: process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS  // Tu contraseña o app password
    }
});

async function verifyTransporter() {
    try {
        const test = {
            from: process.env.EMAIL_USER,
            to: 'cuachis17@gmail.com',
            subject: 'Test de configuración de correo',
            text: 'Este es un correo de prueba para verificar la configuración del transportador.'
        }
        console.log('Verificando transportador de correo...');
        return transporter.sendMail(test)
    } catch (error) {
        console.error('Error verifying mail transporter:', error);
    }
}

// verifyTransporter();

export class MailRepository {
    // Envía un correo genérico
    async sendMail({ to, subject, text, html }){
        try {
        const mailOptions = {
            from: user,
            to,
            subject,
            text,
            html
        };
        
        console.log('Enviando correo:', { from: user, to, subject, text });

        return transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending mail:', error);
        throw error;}
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