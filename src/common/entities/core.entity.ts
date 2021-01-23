import { Field, ObjectType } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
export class coreEntity{
    @PrimaryGeneratedColumn()
    @Field(type =>Number)
    id : number;

    @CreateDateColumn()
    @Field(type =>Date)
    createdAt : Date
    
    @UpdateDateColumn()
    @Field(type =>Date)
    updatedAt : Date
}