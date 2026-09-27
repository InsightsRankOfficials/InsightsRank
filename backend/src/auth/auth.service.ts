import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserResponseDto } from '@/users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.usersService.updateLastLogin(user.id);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    this.setAuthCookie(res, accessToken);

    const userDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
          }
        : undefined,
    };

    return {
      user: userDto,
      accessToken,
    };
  }

  async register(registerDto: RegisterDto, res: Response) {
    const { user, organization } = await this.usersService.createUserWithOrganization({
      email: registerDto.email,
      passwordRaw: registerDto.password,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      organizationName: registerDto.organizationName,
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    this.setAuthCookie(res, accessToken);

    const userDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
    };

    return {
      user: userDto,
      accessToken,
    };
  }

  async logout(res: Response) {
    this.clearAuthCookie(res);
    return { message: 'Logged out successfully' };
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User session invalid');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
          }
        : undefined,
    };
  }

  private setAuthCookie(res: Response, token: string) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const cookieSecure = this.configService.get<boolean>('cookie.secure') ?? isProduction;
    const sameSite = this.configService.get<string>('cookie.sameSite') || (isProduction ? 'none' : 'lax');

    res.cookie('insightsrank_access_token', token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: sameSite as any,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  private clearAuthCookie(res: Response) {
    res.clearCookie('insightsrank_access_token', {
      path: '/',
    });
  }
}
