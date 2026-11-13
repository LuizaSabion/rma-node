import z from 'zod';

export const sinistroSchema = z.object({
  cliente: z.string().trim().min(3, 'Informe o nome do cliente (mínimo 3 letras).'),
  dispositivo: z.string().trim().min(1, 'Informe o modelo do dispositivo.'),
  numeroSerie: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4,30}$/, 'De 4 a 30 letras ou números, sem espaço.'),
  tipoDefeito: z.enum(['TELA', 'BATERIA', 'PLACA', 'CONECTOR', 'SOFTWARE'], {
    message: 'Selecione o tipo de defeito',
  }),
  descricaoDefeito: z.string().trim().min(10, 'Descreva o defeito com pelo menos 10 caracteres.'),
  // vazio = padrao do tipo de defeito
  severidade: z.enum(['', 'ALTA', 'MEDIA', 'BAIXA']),
});

export type SinistroFormData = z.infer<typeof sinistroSchema>;

export const laudoSchema = z.object({
  decisao: z.enum(['REPARADO', 'SUBSTITUIDO', 'REPROVADO'], {
    message: 'Escolha a decisão do laudo',
  }),
  laudo: z.string().trim().min(10, 'Escreva o laudo com pelo menos 10 caracteres.'),
});

export type LaudoFormData = z.infer<typeof laudoSchema>;
