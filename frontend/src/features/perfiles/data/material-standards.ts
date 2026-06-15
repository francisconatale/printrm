export interface MaterialStandard {
  material: string;
  density: number;
  diameter: number;
  description?: string;
}

export const MATERIAL_STANDARDS: Record<string, MaterialStandard> = {
  PLA: {
    material: 'PLA',
    density: 1.24,
    diameter: 1.75,
    description: 'Poliácido Láctico - El más común y fácil de imprimir.'
  },
  ABS: {
    material: 'ABS',
    density: 1.04,
    diameter: 1.75,
    description: 'Acrilonitrilo Butadieno Estireno - Resistente y duradero.'
  },
  PETG: {
    material: 'PETG',
    density: 1.27,
    diameter: 1.75,
    description: 'Polietileno Tereftalato de Glicol - Resistente al agua y químicos.'
  },
  TPU: {
    material: 'TPU',
    density: 1.21,
    diameter: 1.75,
    description: 'Poliuretano Termoplástico - Flexible y elástico.'
  },
  ASA: {
    material: 'ASA',
    density: 1.07,
    diameter: 1.75,
    description: 'Acrilonitrilo Estireno Acrilato - Resistente a la intemperie/UV.'
  },
  Nylon: {
    material: 'Nylon',
    density: 1.08,
    diameter: 1.75,
    description: 'Poliamida - Muy fuerte, flexible y resistente a la abrasión.'
  },
  HIPS: {
    material: 'HIPS',
    density: 1.04,
    diameter: 1.75,
    description: 'Poliestireno de Alto Impacto - A menudo usado como soporte soluble.'
  },
  PC: {
    material: 'PC',
    density: 1.20,
    diameter: 1.75,
    description: 'Policarbonato - Extremadamente fuerte y resistente al calor.'
  }
};
