import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { CreateDTO, LoginDTO } from './dto/user.dto';
import { Payload } from './dto/payload';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../utilities/user.decorator';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  
  @Get()
  @UseGuards(AuthGuard('jwt'))
  index(@User() user: any) {
    return { user }
  }

  @Post()
  async create(@Body(new ValidationPipe()) userDTO: CreateDTO): Promise<any> {
    const user = await this.userService.create(userDTO);
    const payload: Payload = {
      id: user.id,
      username: user.username,
    }
    const accessToken = await this.authService.signPayload(payload);
    return {
      user,
      accessToken,
    };
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) userDTO: LoginDTO): Promise<any> {
    const user = await this.userService.login(userDTO);
    const payload: Payload = {
      id: user.id,
      username: user.username,
    }
    const accessToken = await this.authService.signPayload(payload);
    return {
      user,
      accessToken,
    };
  }
}
