import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    userId: number;
    @Column()
    content: string;
}