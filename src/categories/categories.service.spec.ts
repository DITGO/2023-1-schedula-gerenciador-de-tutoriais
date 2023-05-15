import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoriesRepository: Repository<Category>;

  const mockUuid = uuid();

  const mockCategoryDto: CreateCategoryDto = {
    name: 'Test Name',
  };

  const mockUpdateCategoryDto: UpdateCategoryDto = {
    name: 'Test Name Updated',
  };

  const categoriesEntityList = [{ ...mockCategoryDto }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn().mockResolvedValue(new Category()),
            find: jest.fn().mockResolvedValue(categoriesEntityList),
            findOneBy: jest.fn().mockResolvedValue(categoriesEntityList[0]),
            update: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
    expect(categoriesRepository).toBeDefined();
  });

  describe('createCategory', () => {
    const dto = mockCategoryDto;
    it('should call category repository with correct params', async () => {
      await categoriesService.createCategory(dto);
      expect(categoriesRepository.create).toHaveBeenCalledWith({
        ...dto,
      });
      expect(categoriesRepository.create);
    });

    it('should return an internal error exception', async () => {
      jest.spyOn(categoriesRepository, 'save').mockRejectedValue(new Error());

      expect(
        categoriesService.createCategory(mockCategoryDto),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('findCategories', () => {
    it('should return a category entity list successfully', async () => {
      const response = await categoriesService.findCategories();

      expect(response).toEqual(categoriesEntityList);
      expect(categoriesRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', () => {
      jest.spyOn(categoriesRepository, 'find').mockResolvedValueOnce([]);

      expect(categoriesService.findCategories()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findCategoryById', () => {
    const id = mockUuid;

    it('should return an category entity successfully', async () => {
      const response = await categoriesService.findCategoryById(id);

      expect(response).toEqual(categoriesEntityList[0]);
    });

    it('should throw a not found exception', () => {
      jest.spyOn(categoriesRepository, 'findOneBy').mockResolvedValueOnce(null);

      expect(categoriesService.findCategoryById(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('updateCategory', () => {
    const id = mockUuid;
    const dto = mockUpdateCategoryDto;

    it('should return an updated category successfully', async () => {
      const response = await categoriesService.updateCategory({ ...dto }, id);
      expect(response).toMatchObject({ ...mockUpdateCategoryDto });
    });

    it('should return an internal server error exception when category cannot be updated', async () => {
      jest.spyOn(categoriesRepository, 'save').mockRejectedValue(new Error());

      expect(
        categoriesService.updateCategory({ ...dto }, id),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('deleteCategory', () => {
    it('should return a not found exception', () => {
      const id = mockUuid;

      jest.spyOn(categoriesRepository, 'delete').mockResolvedValue(null);
      expect(categoriesService.deleteCategory(id)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should return a not found exception', () => {
      const id = mockUuid;

      jest
        .spyOn(categoriesRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as DeleteResult);

      expect(categoriesService.deleteCategory(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
