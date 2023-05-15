import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { Tutorial } from './entities/tutorial.entity';

@Controller('tutorials')
@UseInterceptors(CacheInterceptor)
export class TutorialsController {
  constructor(private readonly tutorialService: TutorialsService) {}

  // Rota para criação de um posto de trabalho
  @Post()
  async createTutorial(
    @Body() createTutorialDto: CreateTutorialDto,
  ): Promise<Tutorial> {
    return await this.tutorialService.createTutorial(createTutorialDto);
  }

  // Rota para obter todos os postos de trabalho cadastrados
  @Get()
  async findAll(): Promise<Tutorial[]> {
    return await this.tutorialService.findAll();
  }

  // Rota para obter um posto de trabalho cadastrado
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tutorial> {
    return await this.tutorialService.findTutorial(id);
  }

  // Rota para atualizar um posto de trabalho cadastrado
  @Put(':id')
  async updateTutorial(
    @Param('id') id: string,
    @Body() updateTutorialDto: UpdateTutorialDto,
  ): Promise<Tutorial> {
    return await this.tutorialService.updateTutorial(id, updateTutorialDto);
  }

  // Rota para excluir um posto de trabalho cadastrado
  @Post(':id')
  async deleteTutorial(
    @Param('id') id: string
  ): Promise<string> {
    return await this.tutorialService.deleteTutorial(id);
  }
}
