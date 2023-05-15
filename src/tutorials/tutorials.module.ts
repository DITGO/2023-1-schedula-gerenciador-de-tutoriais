import { Module } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { TutorialsController } from './tutorials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { Category } from '../../src/categories/entities/category.entity';
import { CategoriesService } from '../categories/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tutorial, Category])],
  controllers: [TutorialsController],
  providers: [TutorialsService, CategoriesService],
})
export class TutorialsModule {}
