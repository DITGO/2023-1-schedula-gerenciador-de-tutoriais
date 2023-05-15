import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CacheModule } from '@nestjs/common';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;

  const mockUuid = uuidv4();

  const mockCreateCategoryDto: CreateCategoryDto = {
    name: 'mock_category'
  };

  const mockUpdteCategoryDto: UpdateCategoryDto = {
    name: 'new_mock_category',
  };

  const mockCategoriesService = {
    createCategory: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
    findCategoryById: jest.fn((id) => {
      return {
        ...mockCreateCategoryDto,
        id,
      };
    }),
    updateCategory: jest.fn((dto, id) => {
      return {
        ...mockCreateCategoryDto,
        ...dto,
        id,
      };
    }),
    deleteCategory: jest.fn((id) => {
      return;
    }),
    findCategories: jest.fn(() => {
      return [{ ...mockCreateCategoryDto }];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
      imports: [CacheModule.register()],
    })
      .overrideProvider(CategoriesService)
      .useValue(mockCategoriesService)
      .compile();

    categoriesController = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  it('should create a new category with success', async () => {
    const dto = mockCreateCategoryDto;
    const response = await categoriesController.createCategory(dto);

    expect(response).toMatchObject({ ...dto });
  });

  it('should return an category with success', async () => {
    const categoryId = mockUuid;
    const response = await categoriesController.findCategoryById(categoryId);

    expect(response).toMatchObject({ id: categoryId });
  });

  it('should return all categories with success', async () => {
    const response = await categoriesController.findCategories();

    expect(response.length).toBeGreaterThan(0);
    expect(response).toEqual([{ ...mockCreateCategoryDto }]);
  });

  it('should update an category with success', async () => {
    const categoryId = mockUuid;
    const dto = mockUpdteCategoryDto;
    const response = await categoriesController.updateCategory(dto, categoryId);

    expect(response).toMatchObject({ ...dto, id: categoryId });
  });

  it('should delete an category with success', async () => {
    const categoryId = mockUuid;
    const successMessage = 'Categoria removida com sucesso';
    const response = await categoriesController.deleteCategory(categoryId);

    expect(response).toMatchObject({ message: successMessage });
  });
});
