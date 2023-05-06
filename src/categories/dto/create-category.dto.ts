import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Insira uma categoria' })
  @IsString({ message: 'Insira uma categoria válida' })
  name: string;
}
