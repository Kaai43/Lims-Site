import { z } from 'zod';

/** Validação estrita na borda: apenas slugs kebab-case ou valores de enum. */
export const esquemaFiltroProjetos = z.object({
  categoria: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'Categoria inválida')
    .optional(),
});

export const esquemaFiltroEventos = z.object({
  periodo: z.enum(['proximos', 'anteriores']).default('proximos'),
});
