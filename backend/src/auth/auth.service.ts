import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto) {
        const existingUser = await this.usersService.findOne(signupDto.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(signupDto.password, 10);
        const user = await this.usersService.createUser({
            email: signupDto.email,
            password: hashedPassword,
            role: signupDto.role || Role.Participant,
        });

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            token: this.generateToken(user),
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findOne(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            token: this.generateToken(user),
        };
    }

    private generateToken(user: { id: string; email: string; role: Role | string }) {
        const role = typeof user.role === 'string' ? (user.role as Role) : user.role;
        const payload = { email: user.email, sub: user.id, role };
        return this.jwtService.sign(payload);
    }
}
