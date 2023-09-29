import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {User} from "./user";
import {Like} from "./like";
import ImageStatus from "./imageStatus";
import {Group} from "./group";


@Entity()
export class StatusGroup {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type : "longtext"})
    content: string;
    @Column({type : "longtext"})
    imageSrc: string;
    @ManyToOne(() => User, (sender) => sender.id)
    sender: User;
    @ManyToOne(() => Group, ( group) => group.id)
    group: Group;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    time: Date;

}