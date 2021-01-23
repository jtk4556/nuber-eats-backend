import { UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateAccountDto, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login-dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";
@Resolver(of => User)
export class UserResolver{
    constructor(
        private readonly userService: UserService,
        private readonly config: ConfigService,    
    ){}

    @Query(type => Boolean)
    users(){
        return true;
    }

    @Mutation(type => CreateAccountOutput)
    async createAccount(
        @Args("input") createAccountDto : CreateAccountDto
    ) : Promise<CreateAccountOutput> {
        try{
            const [ok, error] = await this.userService.createAccount(createAccountDto);
            if(error){
                return{
                    ok,
                    error
                }
            }
            return {
                ok
            };
        }catch(e){
            return {
                ok : false,
                error : e
            };
        }
    }

    @Mutation(type => LoginOutput)
    async login(
        @Args("input") loginInput : LoginInput
    ) : Promise<LoginOutput> {
        try{
            const [ok, error, token] = await this.userService.login(loginInput);
            return { ok, error, token};
        }catch(error){
            return{
                ok : false,
                error : error
            }
        }
    }

    @Query(type =>User)
    @UseGuards(AuthGuard)
    Me(@AuthUser() authUser : User) {
      console.log(authUser);
      return authUser;
    }
}