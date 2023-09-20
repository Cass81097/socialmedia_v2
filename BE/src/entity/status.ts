import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {User} from "./user";
import {Like} from "./like";
import ImageStatus from "./imageStatus";


@Entity()
export class Status {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type : "longtext"})
    content: string;

    @Column({ default: "public" }) // Mặc định là public
    visibility: string;

    @ManyToOne(() => User, (sender) => sender.id)
    sender: User;
    @ManyToOne(() => User, (receiver) => receiver.id)

    receiver: User;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    time: Date;

    // Định nghĩa quan hệ OneToMany với bảng Like
    @OneToMany(() => Like, (like) => like.id, { onDelete: 'CASCADE' })
    likes: Like[];

    @OneToMany(() => ImageStatus, (img) => img.status, { onDelete: 'CASCADE' })
    images: ImageStatus[];

}