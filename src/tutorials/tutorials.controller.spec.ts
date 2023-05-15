import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { TutorialsController } from './tutorials.controller';
import { TutorialsService } from './tutorials.service';
import { v4 as uuid } from 'uuid';
import { CacheModule } from '@nestjs/common';

describe('TutorialsController', () => {
  let controller: TutorialsController;
  let service: TutorialsService;

  const mockUuid = uuid();

  const mockCreateTutorialDto: CreateTutorialDto = {
    name: 'mockStation',
    category_id: mockUuid,
    file: 'mockFile',
  };

  const mockUpdateTutorialDto: UpdateTutorialDto = {
    name: 'updatedMockStation',
    category_id: mockUuid,
    file: 'updatedMockFile',
  };

  const mockTutorialEntityList = [{ ...mockCreateTutorialDto }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorialsController],
      providers: [
        {
          provide: TutorialsService,
          useValue: {
            createTutorial: jest.fn().mockResolvedValue(mockCreateTutorialDto),
            findAll: jest.fn().mockResolvedValue(mockTutorialEntityList),
            findTutorial: jest
              .fn()
              .mockResolvedValue(mockTutorialEntityList[0]),
            updateTutorial: jest.fn().mockResolvedValue(mockUpdateTutorialDto),
            deleteTutorial: jest.fn().mockResolvedValue('Deletado com sucesso'),
          },
        },
      ],
      imports: [CacheModule.register()],
    }).compile();

    controller = module.get<TutorialsController>(TutorialsController);
    service = module.get<TutorialsService>(TutorialsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a tutorial list entity successfully', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockTutorialEntityList);

      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findTutorial', () => {
    it('should return a tutorial entity successfully', async () => {
      const id = mockUuid;

      const result = await controller.findOne(id);

      expect(result).toEqual(mockTutorialEntityList[0]);

      expect(service.findTutorial).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTutorial', () => {
    it('should create a tutorial entity successfully', async () => {
      const result = await controller.createTutorial(mockCreateTutorialDto);

      expect(result).toEqual(mockCreateTutorialDto);

      expect(service.createTutorial).toHaveBeenCalledTimes(1);

      expect(service.createTutorial).toHaveBeenCalledWith(
        mockCreateTutorialDto,
      );
    });
  });

  describe('updateTutorial', () => {
    it('should update a tutorial entity succesfully', async () => {
      const id = mockUuid;

      const result = await controller.updateTutorial(id, mockUpdateTutorialDto);

      expect(result).toEqual(mockUpdateTutorialDto);

      expect(service.updateTutorial).toHaveBeenCalledTimes(1);

      expect(service.updateTutorial).toHaveBeenCalledWith(
        id,
        mockUpdateTutorialDto,
      );
    });
  });

  describe('deleteTutorial', () => {
    it('should delete a tutorial entity succesfully', async () => {
      const id = mockUuid;

      const result = await controller.deleteTutorial(id);

      expect(result).toMatch('Deletado com sucesso');

      expect(service.deleteTutorial).toHaveBeenCalledTimes(1);

      expect(service.deleteTutorial).toHaveBeenCalledWith(id);
    });
  });
});
