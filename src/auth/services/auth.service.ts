import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import UserEntity from "@user/models/user.model";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (user && (await argon2.verify(user.password, password))) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { id: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}