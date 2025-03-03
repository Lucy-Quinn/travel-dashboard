export interface Series<T> {
  data: T[]
}

export interface ScatterData {
  name: string
  value: (string | number)[]
  itemStyle?: { color: string }
  symbolSize: number
}

export interface LinesData {
  coords: number[][]
  value: string
}
