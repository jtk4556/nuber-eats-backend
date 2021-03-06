import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountDto } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login-dto";
import { User } from "./entities/user.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput } from "./dtos/edit-profile.dto";
@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User) private readonly users : Repository<User>,
        private readonly jwtService : JwtService,
    ){
        
    }
    
    async createAccount({email, password, role} : CreateAccountDto) : Promise<[boolean, string?]>{
        try{
            const user = await this.users.findOne({email: email});
            if(!user){
                return [false, "this is aleady exist"]
            }

            await this.users.save(this.users.create({email, password, role}));
            return [true]
        }catch(e){
            return [false, "Coudn't create account"];
        }
    }

    async login({email, password} : LoginInput) : Promise<[boolean, string?, string?]>{
        try{
            const user = await this.users.findOne({email});
            if(!user){
                return [false, "User not found"];
            }

            const passwordCorrect =await user.checkPassword(password)
            if(!passwordCorrect){
                return [false, "Wrong password"]
            }
            const token = this.jwtService.sign(user.id);
            return [true, "", token]
        }catch(error){
            return [false,error]
        }
    }

    async findById(id : number) : Promise<User>{
        return this.users.findOne({id});
    }

    async editProfile(
        userId : number, 
        {email, password} : EditProfileInput
    ) {
        const user = await this.users.findOne({id : userId});
        if(email){
            user.email = email;
        }
        if(password){
            user.password = password;
        }
        return this.users.save(user);
    }
}