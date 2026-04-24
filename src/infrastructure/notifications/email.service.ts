import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

export interface AccessCredentialsEmailPayload {
  to: string;
  temporaryPassword: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  private get deliveryMode(): string {
    return (process.env.EMAIL_DELIVERY_MODE || 'log').toLowerCase();
  }

  private get smtpConfigured(): boolean {
    return Boolean(
      process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.SMTP_FROM,
    );
  }

  private getTransporter(): Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    return this.transporter;
  }

  async sendTemporaryPassword(
    payload: AccessCredentialsEmailPayload,
  ): Promise<void> {
    if (this.deliveryMode !== 'smtp' || !this.smtpConfigured) {
      if (this.deliveryMode === 'smtp' && !this.smtpConfigured) {
        this.logger.warn(
          'EMAIL_DELIVERY_MODE=smtp pero faltan variables SMTP. Se usara el modo log temporalmente.',
        );
      }

      this.logger.log(
        `Credenciales temporales generadas para ${payload.to}. Contrasena temporal: ${payload.temporaryPassword}`,
      );
      return;
    }

    const transporter = this.getTransporter();

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: payload.to,
      subject: 'Acceso temporal a la tienda Univalle',
      text: [
        'Hola,',
        '',
        'Tu acceso temporal a la tienda institucional fue generado.',
        `Correo: ${payload.to}`,
        `Contrasena temporal: ${payload.temporaryPassword}`,
        '',
        'Debes iniciar sesion y cambiar la contrasena en tu primer ingreso.',
      ].join('\n'),
      html: `
        <p>Hola,</p>
        <p>Tu acceso temporal a la tienda institucional fue generado.</p>
        <p><strong>Correo:</strong> ${payload.to}</p>
        <p><strong>Contrasena temporal:</strong> ${payload.temporaryPassword}</p>
        <p>Debes iniciar sesion y cambiar la contrasena en tu primer ingreso.</p>
      `,
    });

    this.logger.log(
      `Correo enviado correctamente a ${payload.to} usando SMTP.`,
    );
  }
}
