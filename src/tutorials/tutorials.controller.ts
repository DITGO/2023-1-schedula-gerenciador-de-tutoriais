import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  CacheInterceptor,
  UploadedFile,
  ParseArrayPipe,
} from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { Tutorial } from './entities/tutorial.entity';

import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('tutorials')
@UseInterceptors(CacheInterceptor)
export class TutorialsController {
  constructor(private readonly tutorialService: TutorialsService) {}

  // Rota para criação de um tutorial
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createTutorial(
    @Body() createTutorialDto: CreateTutorialDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Tutorial> {
    createTutorialDto.filename = file.originalname;
    createTutorialDto.data = file.buffer;

    return await this.tutorialService.createTutorial(createTutorialDto);
  }

  // Rota para obter todos os tutoriais cadastrados
  @Get()
  async findAll(): Promise<Tutorial[]> {
    return await this.tutorialService.findAll();
  }

  // Rota para obter um tutorial cadastrado
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tutorial> {
    return await this.tutorialService.findTutorial(id);
  }

  // Rota para atualizar um tutorial cadastrado
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  async updateTutorial(
    @Param('id') id: string,
    @Body() updateTutorialDto: UpdateTutorialDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Tutorial> {
    updateTutorialDto.filename = file.originalname;
    updateTutorialDto.data = file.buffer;

    return await this.tutorialService.updateTutorial(id, updateTutorialDto);
  }

  // Rota para excluir um tutorial cadastrado
  @Delete(':id')
  async deleteTutorial(@Param('id') id: string): Promise<string> {
    return await this.tutorialService.deleteTutorial(id);
  }

  // Rota para excluir lista de tutoriais cadastrados em lote
  @Delete(
    'delete-tutorials/:ids',
  )
  async deleteTutorials(@Param('ids', ParseArrayPipe) ids: string[]): Promise<string> {
    return await this.tutorialService.deleteTutorials(ids);
  }
}
