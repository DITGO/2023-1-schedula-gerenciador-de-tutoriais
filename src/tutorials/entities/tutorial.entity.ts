import { Category } from '../../categories/entities/category.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tutorial extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: any;

  @ManyToOne(() => Category, (category: Category) => category.tutorials)
  @JoinColumn()
  category: Category;
}
