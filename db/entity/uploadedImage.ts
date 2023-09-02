import typeorm, { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import bcrypt from 'bcrypt'
import { User } from './User';

@Entity('users')
export class Image extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false,length:300})
    userName:string;

    
    user:User;

    @CreateDateColumn({
        type:'timestamp',
        default:()=> 'CURRENT_TIMESTAMP(6)'
    })
    createdAt:Date;
}