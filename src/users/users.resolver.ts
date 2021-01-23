import { UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { error } from "console";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateAccountDto, CreateAccountOutput } from "./dtos/create-account.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login-dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";
@Resolver(of => User)
export class UserResolver{
    constructor(
        private readonly userService: UserService,
        private readonly config: ConfigService,    
    ){}

    @Query(returns => Boolean)
    users(){
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
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

    @Mutation(returns => LoginOutput)
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

    @Query(returns =>User)
    @UseGuards(AuthGuard)
    Me(@AuthUser() authUser : User) {
      console.log(authUser);
      return authUser;
    }

    @UseGuards(AuthGuard)
    @Query(retuns => UserProfileOutput)
    async userProfile(@Args() userProfileInput : UserProfileInput) : Promise<UserProfileOutput>{
        try{
            const user = await this.userService.findById(userProfileInput.userId);
            if(!user){
                throw Error();
            }
            return { 
                ok : Boolean(user),
                user,
            }
        }catch(e){
            return { ok : false, error : "user not found"};
        }
    }

    @UseGuards(AuthGuard)
    @Mutation(returns => EditProfileOutput)
    async editProfile(
        @AuthUser() authUser : User, 
        @Args('input') editProfileInput : EditProfileInput
    ) : Promise<EditProfileOutput>{
        try{
            await this.userService.editProfile(authUser.id, {...editProfileInput});
            return { ok : true}
        }catch(error){
            return{
                ok : false,
                error
            }
        }
    }
}