import { IsString, Length, IsNotEmpty } from "class-validator";


export class CreateQuickNoteDto {
  @Length(1, 10000)
  @IsString()
  @IsNotEmpty()
  content: string;
}
