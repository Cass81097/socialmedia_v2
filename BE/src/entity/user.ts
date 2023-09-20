import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar' })
    username: string;
    @Column({ type: 'varchar' })
    fullname: string;
    @Column({ type: 'varchar' })
    password: string
    @Column({ type: 'varchar', nullable: true })
    address: string
    @Column({ type: 'varchar', nullable: true })
    phone: string
    @Column({ type: 'varchar' })
    passwordConfirm: string
    @Column({ type: 'varchar', nullable: true })
    email: string;
    @Column({ type: "varchar", length: 255, nullable: true })
    avatar: string;
    @Column({ type: "varchar", length: 255, nullable: true })
    cover: string;
    @Column({ type: 'varchar', nullable: true })
    role: string
}