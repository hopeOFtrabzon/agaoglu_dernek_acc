export class UserResponseDto {
  id!: string;
  email!: string;
  username!: string;
  first_name?: string | null;
  last_name?: string | null;
  is_active!: boolean;
  is_superuser!: boolean;
  is_verified!: boolean;
  created_at!: Date;
  updated_at!: Date;
}
