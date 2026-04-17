import { ValueObject } from '../base-classes/value-object';

const UNIVALLE_EMAIL_DOMAIN = '@correounivalle.edu.co';

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }

    if (!normalizedEmail.endsWith(UNIVALLE_EMAIL_DOMAIN)) {
      throw new Error('Invalid institutional email domain');
    }

    return new Email({ value: normalizedEmail });
  }

  get value(): string {
    return this.props.value;
  }
}
