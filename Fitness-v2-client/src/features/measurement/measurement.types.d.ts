type Measurement = {
  weight: number;
  height: number;
  bmi: number;
  date: string;
};

type MeasurementToday = {
  isMeasuredToday: boolean;
  measurement?: Measurement;
};
