import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from '../../src/categories/categories.service';
import { Repository } from 'typeorm';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { Tutorial } from './entities/tutorial.entity';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectRepository(Tutorial)
    private tutorialRepo: Repository<Tutorial>,
    private categoriesService: CategoriesService,
  ) {}

  // Cria um tutorial
  async createTutorial(
    createTutorialDto: CreateTutorialDto,
  ): Promise<Tutorial> {
    try {
      const { category_id } = createTutorialDto;
      const category = await this.categoriesService.findCategoryById(
        category_id,
      );

      const tutorial = this.tutorialRepo.create({
        ...createTutorialDto,
        category,
      });
      await this.tutorialRepo.save(tutorial);
      return tutorial;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  // Obtém todos os tutoriais
  async findAll() {
    try {
      const res = await this.tutorialRepo.find({
        relations: ['category'],
      });
      return res;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  // Obtém um tutorial pelo id
  async findTutorial(id: string): Promise<Tutorial> {
    try {
      const res = await this.tutorialRepo.findOne({
        where: { id },
        relations: ['category'],
      });
      if (!res) throw new NotFoundException('Tutorial não encontrado');
      return res;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  // Atualiza um tutorial de acordo com o id e os dados atualizados
  async updateTutorial(
    id: string,
    updateTutorialDto: UpdateTutorialDto,
  ): Promise<Tutorial> {
    try {
      const { category_id } = updateTutorialDto;

      const tutorial = await this.tutorialRepo.findOneBy({ id });
      const category = category_id
        ? await this.categoriesService.findCategoryById(category_id)
        : tutorial.category;

      await this.tutorialRepo.save({
        id,
        ...updateTutorialDto,
        category,
      });

      return await this.tutorialRepo.findOneBy({ id });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  // Deleta o tutorial de acordo com o id
  async deleteTutorial(idTutorial: string): Promise<string> {
    const res = await this.tutorialRepo.findOneBy({ id: idTutorial });
    if (!res) {
      throw new NotFoundException('Tutorial não encontrado');
    }
    try {
      await this.tutorialRepo.delete({ id: idTutorial });

      return 'Deletado com sucesso';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
