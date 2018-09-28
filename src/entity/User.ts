import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import {validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsString, IsIn,IsEnum} from "class-validator";
@Entity()
export class User extends BaseEntity {
    @IsInt()
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @Column()
    firstName: string;
    
    @IsString()
    @Column()
    lastName: string;

    @IsString()
    @Column()
    cName: string;

    @IsInt()
    @Column()
    age: number;

    @IsInt()
    @Column()
    sex: number;

}
