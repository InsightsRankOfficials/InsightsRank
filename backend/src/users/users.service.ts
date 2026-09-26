import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Role, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export type UserWithOrganization = Prisma.UserGetPayload<{
  include: { organization: true };
}>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserWithOrganization | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { organization: true },
    });
  }

  async findById(id: string): Promise<UserWithOrganization | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { organization: true },
    });
  }

  async createUserWithOrganization(data: {
    email: string;
    passwordRaw: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
  }) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.passwordRaw, 10);
    const slugBase = data.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug,
          status: 'ACTIVE',
        },
      });

      const user = await tx.user.create({
        data: {
          organizationId: organization.id,
          email: data.email.toLowerCase(),
          passwordHash,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          role: Role.OWNER,
          status: 'ACTIVE',
          emailVerified: true,
        },
        include: { organization: true },
      });

      return { user, organization };
    });
  }

  async inviteUserInOrg(data: {
    organizationId: string;
    email: string;
    passwordRaw: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
  }) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.passwordRaw, 10);
    const user = await this.prisma.user.create({
      data: {
        organizationId: data.organizationId,
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        role: data.role || Role.MEMBER,
        status: 'ACTIVE',
        emailVerified: true,
      },
      include: { organization: true },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async getOrganizationUsers(organizationId: string) {
    const users = await this.prisma.user.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(({ passwordHash, ...user }) => user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
