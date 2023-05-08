import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create({ ...dto });
    try {
      return await this.categoryRepo.save(category);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findCategories(): Promise<Category[]> {
    const categories = await this.categoryRepo.find();

    if (categories.length === 0) {
      throw new NotFoundException('Não existem categorias cadastradas');
    }
    return categories;
  }

  async findCategoryById(idCategory: string) {
    const category = await this.categoryRepo.findOneBy({ id: idCategory });
    if (!category) {
      throw new NotFoundException('Não foi possível encontrar esta categoria');
    }
    return category;
  }

  async updateCategory(
    dto: UpdateCategoryDto,
    idCategory: string,
  ): Promise<Category> {
    const { name } = dto;
    const category = await this.categoryRepo.findOneBy({ id: idCategory });

    try {
      category.name = name;

      await this.categoryRepo.save(category);
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCategory(idCategory: string) {
    const result = await this.categoryRepo.delete({ id: idCategory });
    if (!result) throw new NotFoundException('Cidade não encontrada');
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrada uma categoria com este id',
      );
    }
  }
}
