import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Group} from "./group";


@Entity()
export class GroupNotification {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => User, (sender) => sender.id)
    sender: User;
    @ManyToOne(() => User, (receiver) => receiver.id)
    receiver: User;
    @ManyToOne(() => Group, (group) => group.id)
    group : Group;
    @Column({type : "longtext"})
    des: string;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    time: Date;
    @Column({ default: false })
    isRead: boolean;
}