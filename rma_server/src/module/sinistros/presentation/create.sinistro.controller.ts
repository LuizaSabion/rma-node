import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SinistroRequest } from '../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import {
  CREATE_SINISTRO_USE_CASE,
  CreateSinistroUseCase,
} from '../application/use-case/write/create.sinistro.use-case';

@Controller('sinistro')
export class CreateSinistroController {
  constructor(
    @Inject(CREATE_SINISTRO_USE_CASE)
    private readonly createSinistroUseCase: CreateSinistroUseCase,
  ) {}

  @Post()
  async createSinistro(@Body() createRequest: SinistroRequest): Promise<SinistroResponse> {
    return await this.createSinistroUseCase.execute(createRequest);
  }
}
