import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty({ message: 'Insira uma categoria' })
  @IsString({ message: 'Insira uma categoria válida' })
  @MaxLength(50, { message: 'A categoria deve ter no máximo 50 caracteres' })
  name: string;
}
