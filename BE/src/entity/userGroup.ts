import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {User} from "./user";
import {Group} from "./group";

@Entity()
export class UserGroup {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => User, (user) => user.id)
    user: User;
    @ManyToOne(() => Group, (group) =>group.id)
    group: Group;
    @Column({ type: 'varchar', default: 'pending' })
    status: string;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    time: Date;

    @Column({ type: 'varchar', nullable: true })
    role: string;

}