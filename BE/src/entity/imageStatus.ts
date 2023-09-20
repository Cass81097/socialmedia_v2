import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Status } from "./status";
@Entity()
export default class ImageStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "longtext" })
    imageUrl: string
    
    @ManyToOne(() => Status, (status) => status.id)
    status: Status;
}