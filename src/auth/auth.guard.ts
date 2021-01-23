import { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user = gqlContext['user'];
        if(!user){
            return false;
        }

        console.log(user);
        return true;
    }
    
}