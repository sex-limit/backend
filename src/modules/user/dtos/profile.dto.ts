import { IsNumber } from 'class-validator'
import { IsUserExist } from './utils'

export class ProfileDto {
  @IsUserExist()
  @IsNumber()
  id: number
}
