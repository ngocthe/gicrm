export interface ModelHasType {
  type_id: number;
  model_id: number;
  type: Type;
}

export interface Type {
  id: number;
  name: string;
}
