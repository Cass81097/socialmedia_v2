import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar' })
    groupName: string;
    @Column({ type: 'longtext' })
    image: string;
}