import { Controller, Get, Inject, Query } from '@nestjs/common';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import {
  FIND_ALL_SINISTRO_USE_CASE,
  FindAllSinistroUseCase,
} from '../application/use-case/read/findall.sinistro.use-case';

@Controller('sinistro')
export class FindAllSinistroController {
  constructor(
    @Inject(FIND_ALL_SINISTRO_USE_CASE)
    private readonly serviceUseCase: FindAllSinistroUseCase,
  ) {}

  @Get()
  async findAllSinistros(@Query('status') status?: string): Promise<SinistroResponse[]> {
    return await this.serviceUseCase.execute(status);
  }
}
