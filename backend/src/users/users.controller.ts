import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Get profile of current user' })
  async getProfile(@CurrentUser() currentUser: JwtPayload) {
    const user = await this.usersService.findById(currentUser.sub);
    if (!user) {
      return null;
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Get all users in organization' })
  async getOrganizationUsers(@CurrentUser() currentUser: JwtPayload) {
    return this.usersService.getOrganizationUsers(currentUser.orgId);
  }

  @Post('invite')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Invite or create a user in organization' })
  async inviteUser(
    @CurrentUser() currentUser: JwtPayload,
    @Body()
    dto: {
      email: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      role?: Role;
    },
  ) {
    return this.usersService.inviteUserInOrg({
      organizationId: currentUser.orgId,
      email: dto.email,
      passwordRaw: dto.password || 'Password123!',
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role || Role.MEMBER,
    });
  }
}
