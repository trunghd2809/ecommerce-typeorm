import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    try {
      const user = await this.authService.validateUser(payload);
      if (!user) {
        return done(
          new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED),
          false,
        );
      }
      return done(null, user);
    } catch (error) {
      throw new HttpException('Processing error', HttpStatus.BAD_REQUEST)
    }
  }
}