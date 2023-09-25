import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Status} from "./status";


@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => User, (user) => user.id)
    user: User;
    @ManyToOne(() => Status, (post) => post.id)
    status: Status;
    @Column({type : "longtext"})
    content: string;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    time: Date;
    @Column({type : "varchar", nullable : true})
    timeEdit : string
    @Column({type : "longtext",nullable : true})
    imgCmt : string
}