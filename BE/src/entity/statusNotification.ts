import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Status} from "./status";


@Entity()
export class StatusNotification{
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => User, (sender) => sender.id)
    sender: User;
    @ManyToOne(() => Status, (post) => post.id)
    status: Status;
    @Column({type : "longtext"})
    des: string;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    time: Date;
    @Column({ default: false })
    isRead: boolean;
}