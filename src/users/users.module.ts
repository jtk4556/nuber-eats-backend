import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserResolver, UserService, ConfigService],
    exports: [UserService]
})
export class UsersModule {}
