export interface Action {
  service: {
    name: string
    url: string
  }
  content: {
    text: string
    url: string
  }
  date: Date
  extra?: string
}
