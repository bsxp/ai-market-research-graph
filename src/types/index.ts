
// Represents a singular datapoint on the graph diagram
export type GraphNode = {
  id: string
  name: string
  description?: string
  styleProps: React.CSSProperties,
  type: string
  properties: {[key: string]: any}
  relationships: {[key: string]: any[]}
  target?: string | null
}