import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";
import { Restaurant } from "./entities/restaurants.entity";
import { RestaurantService } from "./restaurants.service";

@Resolver(() => Restaurant)
export class RestaurantResolver{
    constructor(private readonly restaurantService : RestaurantService){}
    @Query(() => [Restaurant])
    restaurant(): Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }

    @Mutation(() => Restaurant)
    async craeteRestaurant(
        @Args("input") createRestaurantDto : CreateRestaurantDto
    ) : Promise<boolean> {
        try{
            await this.restaurantService.createRestaurant(createRestaurantDto);
            return true;
        }catch(e){
            return false;
        }
    }

    @Mutation(() => Restaurant)
    async updateRestaurant(
        @Args('input') updateRestaurantDto : UpdateRestaurantDto
    ) : Promise<boolean> {
        try{
            await this.restaurantService.updateRestaurant(updateRestaurantDto);
            return true;
        }catch(e){
            return false;
        }
    }
}