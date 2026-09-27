import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class OrganizationResponseDto {
  @ApiProperty({ example: 'org_12345' })
  id: string;

  @ApiProperty({ example: 'InsightsRank Operations' })
  name: string;

  @ApiProperty({ example: 'insightsrank-ops' })
  slug: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 'usr_12345' })
  id: string;

  @ApiProperty({ example: 'ops@insightsrank.com' })
  email: string;

  @ApiProperty({ example: 'InsightsRank', nullable: true })
  firstName?: string;

  @ApiProperty({ example: 'Operations', nullable: true })
  lastName?: string;

  @ApiProperty({ enum: Role, example: 'OWNER' })
  role: Role;

  @ApiProperty({ example: 'org_12345' })
  organizationId: string;

  @ApiProperty({ type: OrganizationResponseDto, required: false })
  organization?: OrganizationResponseDto;
}
