import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/shemas/user.shema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // ✅ REGISTER
  async register(name: string, email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN', // pour tester admin
    });

    return user;
  }

  // ✅ LOGIN
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user._id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}