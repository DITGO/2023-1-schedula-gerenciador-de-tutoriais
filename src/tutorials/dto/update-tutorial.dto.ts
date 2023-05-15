import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateTutorialDto {
  @IsNotEmpty({ message: 'Insira uma categoria' })
  @IsString({ message: 'Insira uma categoria válida' })
  @MaxLength(500, { message: 'A categoria deve ter no máximo 500 caracteres' })
  name: string;
  
  file: string;

  category_id: string;
}
