import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { PlanService } from './plan.service';
import { IUser } from '@/app';
import { User } from '@/common/decorator/user.decorator';
import { CreateQuickNoteDto } from './dto/quick-note.dto';

@Controller('plan')
export class PlanController {
  @Inject(PlanService)
  private readonly planService: PlanService;

  @Get('/detail')
  async getUserOwnPlan(@User() user: IUser) {
    return this.planService.getUserOwnPlan(user);
  }

  @Post('/pleged')
  async pleged(@User() user: IUser) {
    return this.planService.pleged(user);
  }

  @Post('/quick-note/create')
  async createQuickNote(@Body() body: CreateQuickNoteDto, @User() user: IUser) {
    return this.planService.createQuickNote(user, body);
  }
}
