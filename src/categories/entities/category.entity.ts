import { Tutorial } from '../../tutorials/entities/tutorial.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Tutorial, (tutorial: Tutorial) => tutorial.category)
  tutorials: Relation<Tutorial>[];
}
