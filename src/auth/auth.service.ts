import type { Token } from '../jwt/jwt.type';
import type { ValueErrorReturnPromise } from '../common/type/value-error-return.type';

import { UserService } from '../user/user.service';
import { JwtService } from '../jwt/jwt.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { BadRequestException } from '../exception/bad-request.exception';

export class AuthService {
  userService: UserService;
  jwtService: JwtService;

  constructor() {
    this.userService = new UserService();
    this.jwtService = new JwtService();
  }

  async SignIn(signInDto: SignInDto): ValueErrorReturnPromise<Token> {
    const [user, err] = await this.userService.findOne({ email: signInDto.email });
    if (err) return [null, err];

    const isPasswordCorrect = await Bun.password.verify(signInDto.password, user.password);
    if (!isPasswordCorrect) {
      return [null, new BadRequestException('Wrong password')];
    }

    const [tokens, tokenErr] = this.jwtService.generate(user);
    if (tokenErr) return [null, tokenErr];

    return [tokens, null];
  }

  async SignUp(createUserDto: CreateUserDto): ValueErrorReturnPromise<Token> {
    const hashedPassword = await Bun.password.hash(createUserDto.password, {
      algorithm: 'bcrypt',
      cost: 4,
    });

    const [user, err] = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    if (err) return [null, err];

    const [tokens, tokenErr] = this.jwtService.generate(user);
    if (tokenErr) return [null, tokenErr];

    return [tokens, null];
  }

  async SignOut() {}
}
