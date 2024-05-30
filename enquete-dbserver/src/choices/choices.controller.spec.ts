import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesController } from './choices.controller';
import { ChoicesService } from './choices.service';

const mockChoicesService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('ChoicesController', () => {
  let controller: ChoicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoicesController],
      providers: [ChoicesService, { provide: ChoicesService, useFactory: mockChoicesService }],
    }).compile();

    controller = module.get<ChoicesController>(ChoicesController);
  });

  describe('findAll', () => {
    it('選択肢の配列が返ってくるべき', async () => {
      const result = [
        {
          choice_id: 1,
          choice_text: 'Choice 1',
          vote_counter: 0,
          question: null,
        },
      ];
      jest.spyOn(controller, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('指定された選択肢１つが返ってくるべき', async () => {
      const result = {
        choice_id: 1,
        choice_text: 'Choice 1',
        vote_counter: 0,
        question: null,
      };
      jest.spyOn(controller, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
    });

    it('選択肢が無かったらnullが返ってくるべき', async () => {
      jest.spyOn(controller, 'findOne').mockResolvedValue(null);

      expect(await controller.findOne(1)).toBeNull();
    });
  });

  describe('create', () => {
    it('選択肢が作成され、その選択肢が返ってくるべき', async () => {
      const result = {
        choice_id: 1,
        choice_text: 'Choice 1',
        vote_counter: 0,
        question: null,
      };
      jest.spyOn(controller, 'create').mockResolvedValue(result);

      expect(await controller.create(result)).toEqual(result);
    });
  });

  describe("delete", () => {
    it("選択肢が削除されるべき", async () => {
      const id = 1;
      jest.spyOn(controller, "remove").mockResolvedValue(undefined);

      expect(await controller.remove(id)).toBeUndefined();
    });
  });

  describe('vote', () => {
    it('指定した選択肢が更新されるべき', async () => {
      const result = {
        choice_id: 1,
        choice_text: 'Choice 1',
        vote_counter: 1,
        question: null,
      };
      jest.spyOn(controller, 'vote').mockResolvedValue(result);

      expect(await controller.vote(1, { vote_counter: 1 })).toEqual(result);
    });
    it('選択肢が見つからなかったらエラーが返ってくるべき', async () => {
      jest.spyOn(controller, 'vote').mockRejectedValue(new Error('Choice not found'));

      expect(controller.vote(1, { vote_counter: 1 })).rejects.toThrowError('Choice not found');
    });
  });


});