import { Validator } from '../../common/validator/validator';

export class SignInDto {
  readonly email: string;
  readonly password: string;

  constructor(data: { email: string; password: string }) {
    this.email = data.email;
    this.password = data.password;
  }
}

export class SignInDtoValidation {
  private readonly email?: string;
  private readonly password?: string;
  private readonly error: string[] = [];

  constructor(data: { email?: string; password?: string }) {
    this.email = data.email;
    this.password = data.password;
  }

  validate() {
    this.emailValidation();
    this.passwordValidation();

    if (!this.error.length) {
      return new SignInDto({ email: this.email!, password: this.password! });
    }

    return this.error;
  }

  private emailValidation() {
    const { errors } = new Validator(this.email, 'email').IsEmail().IsNotEmpty();
    this.error.push(...errors);
  }

  private passwordValidation() {
    const { errors } = new Validator(this.password, 'password').IsString().IsNotEmpty();
    this.error.push(...errors);
  }
}
