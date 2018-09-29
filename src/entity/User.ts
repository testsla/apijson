import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsString, IsIn, IsEnum } from "class-validator";
import { Message } from "./Message";
@Entity()
export class User extends BaseEntity {
    @IsInt()
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @Column({
        comment:'用户英文名'
    })
    firstName: string;

    @IsString()
    @Column({
        comment:'用户英文性'
    })
    lastName: string;

    @IsString()
    @Column({
        comment:'用户中文名'
    })
    cName: string;

    @IsInt()
    @Column({
        comment:'用户年龄'
    })
    age: number;

    @IsInt()
    @Column({
        comment:'用户性别，男：1，女人：0'
    })
    sex: number;

    @OneToMany(type => Message, message => message.user)
    message: Message[];
}
