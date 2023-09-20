import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class FriendShip {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => User, (user) => user.id)
    user1: User;
    @ManyToOne(() => User, (user) => user.id)
    user2: User;
    @Column({ type: 'integer' })
    userSendReq: number;
    @Column({ type: 'varchar' })
    status: string
}
