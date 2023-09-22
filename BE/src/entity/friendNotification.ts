import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Status} from "./status";


@Entity()
export class FriendNotification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (sender) => sender.id)
    sender: User;

    @ManyToOne(() => User, (receiver) => receiver.id)
    receiver: User;
    @Column({type : "longtext"})
    des: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    time: Date;
    @Column({ default: false })
    isRead: boolean;
}