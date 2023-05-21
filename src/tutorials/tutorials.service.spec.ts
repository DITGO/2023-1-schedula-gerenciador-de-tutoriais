import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Repository } from 'typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { TutorialsService } from './tutorials.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('TutorialsService', () => {
  let service: TutorialsService;
  let repo: Repository<Tutorial>;
  let categoriesService: CategoriesService;

  const mockUuid = uuid();

  const mockCategory = {
    id: 'MockCategoryId',
    name: 'mockCategory',
    filename: 'mockFile',
    data: [37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10],
  };

  const mockCategoryList = [{ ...mockCategory }];

  const mockCreateTutorialDto: CreateTutorialDto = {
    name: 'mockStation',
    category_id: 'mockCategoryId',
    filename: 'mockFile',
    data: [37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10],
  };

  const mockUpdateTutorialDto: UpdateTutorialDto = {
    name: 'updatedMockStation',
    category_id: 'mockCategoryId',
    filename: 'updatedMockFile',
    data: [37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10],
  };

  const mockCreateTutorialEntity = {
    id: '25',
    name: 'mockTutorial',
    category: mockCategory,
    file: 'mockFile',
  };

  const mockUpdateTutorialEntity = {
    id: '25',
    name: 'mockTutorial',
    category: mockCategory,
    file: 'mockFile',
  };

  const mockTutorialIdsList: string[] = ['0'];

  const mockTutorialEntityList = [{ ...mockCreateTutorialEntity }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialsService,
        {
          provide: getRepositoryToken(Tutorial),
          useValue: {
            create: jest.fn().mockResolvedValue(mockCreateTutorialEntity),
            find: jest.fn().mockResolvedValue(mockTutorialEntityList),
            findOne: jest.fn().mockResolvedValue(mockTutorialEntityList[0]),
            findOneBy: jest.fn().mockResolvedValue(mockTutorialEntityList[0]),
            update: jest.fn().mockResolvedValue(mockUpdateTutorialEntity),
            delete: jest.fn().mockResolvedValue('Deletado com sucesso'),
            save: jest.fn(),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            createCategory: jest.fn().mockResolvedValue(mockCategory),
            findCategories: jest.fn().mockResolvedValue(mockCategoryList),
            findCategoryById: jest.fn().mockResolvedValue(mockCategoryList[0]),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TutorialsService>(TutorialsService);
    repo = module.get<Repository<Tutorial>>(getRepositoryToken(Tutorial));
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
    expect(categoriesService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a tutorial entity list successfully', async () => {
      const result = await service.findAll();

      expect(result).toEqual(mockTutorialEntityList);

      expect(repo.find).toHaveBeenCalledTimes(1);
    });

    it('should throw a internal server error', async () => {
      jest.spyOn(repo, 'find').mockRejectedValueOnce(new Error());

      expect(service.findAll).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('findTutorial', () => {
    it('should return a tutorial entity successfully', async () => {
      const relations = ['category'];

      const result = await service.findTutorial(mockUuid);

      expect(result).toEqual(mockTutorialEntityList[0]);

      expect(repo.findOne).toHaveBeenCalledTimes(1);

      expect(repo.findOne).toHaveBeenCalledWith({
        relations: relations,
        where: { id: mockUuid },
      });
    });

    it('should throw an internal server error', () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      expect(service.findTutorial(mockUuid)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });

    it('should throw a internal server error', async () => {
      jest.spyOn(repo, 'findOne').mockRejectedValueOnce(new Error());

      expect(service.findTutorial(mockUuid)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('createTutorial', () => {
    it('should create a tutorial entity successfully', async () => {
      const result = await service.createTutorial(mockCreateTutorialDto);

      expect(result).toEqual(mockCreateTutorialEntity);

      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a internal server error', async () => {
      jest.spyOn(repo, 'save').mockRejectedValueOnce(new Error());

      expect(service.createTutorial).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('updateTutorial', () => {
    it('should update a tutorial entity successfully', async () => {
      const result = await service.updateTutorial(
        mockUuid,
        mockUpdateTutorialDto,
      );

      expect(result).toEqual(mockUpdateTutorialEntity);

      expect(repo.findOneBy).toHaveBeenCalledTimes(2);

      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a internal server error', async () => {
      jest.spyOn(repo, 'save').mockRejectedValueOnce(new Error());

      expect(
        service.updateTutorial(mockUuid, mockUpdateTutorialDto),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('deleteTutorial', () => {
    it('should delete a tutorial entity successfully', async () => {
      const result = await service.deleteTutorial(mockUuid);

      expect(result).toEqual('Deletado com sucesso');
    });

    it('should throw a not found error', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(null);

      expect(service.deleteTutorial(mockUuid)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a internal server error', async () => {
      jest.spyOn(repo, 'delete').mockRejectedValueOnce(new Error());

      expect(service.deleteTutorial(mockUuid)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });
});
