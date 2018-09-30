import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;
    @Column({
        comment:'用户内容'
    })
    content: string;

    @ManyToOne(type => User, user => user.message)
    user: User;
}