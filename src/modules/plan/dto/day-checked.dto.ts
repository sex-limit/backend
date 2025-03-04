import { IsString } from 'class-validator'

export class GetDayCheckedDetailDto {
  @IsString()
  id: string
}
