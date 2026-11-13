import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Control, Controller } from 'react-hook-form';
import { SinistroFormData } from '../schema/sinistro.schema';
import { NOMES_DEFEITO, NOMES_SEVERIDADE, Severidade, TipoDefeito } from '../type/sinistro.type';

export const selectClassName =
  'h-9 w-full rounded-md border border-input bg-white px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive';

export function SinistroFormFields({ control, disabled }: { control: Control<SinistroFormData>; disabled?: boolean }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="cliente"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cliente">Cliente</FieldLabel>
              <Input
                {...field}
                id="cliente"
                placeholder="Nome completo"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="dispositivo"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="dispositivo">Dispositivo</FieldLabel>
              <Input
                {...field}
                id="dispositivo"
                placeholder="Ex: Smartphone Zenith X200"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Controller
          name="numeroSerie"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="numeroSerie">Número de série</FieldLabel>
              <Input
                {...field}
                id="numeroSerie"
                placeholder="SNX20001"
                className="font-mono uppercase"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="tipoDefeito"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tipoDefeito">Tipo de defeito</FieldLabel>
              <select
                {...field}
                id="tipoDefeito"
                className={selectClassName}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
              >
                <option value="">Selecione</option>
                {(Object.keys(NOMES_DEFEITO) as TipoDefeito[]).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {NOMES_DEFEITO[tipo]}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="severidade"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="severidade">Severidade</FieldLabel>
              <select {...field} id="severidade" className={selectClassName} disabled={disabled}>
                <option value="">Padrão do defeito</option>
                {(Object.keys(NOMES_SEVERIDADE) as Severidade[]).map((s) => (
                  <option key={s} value={s}>
                    {NOMES_SEVERIDADE[s]}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="descricaoDefeito"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="descricaoDefeito">Descrição do defeito</FieldLabel>
            <Textarea
              {...field}
              id="descricaoDefeito"
              rows={3}
              placeholder="Conte o que está acontecendo com o aparelho"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
