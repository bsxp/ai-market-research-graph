import { create } from 'zustand'
import { GraphNode } from '../types'

type AddPropertyToNodeFunction = (id: string, property: string, value: { type: string, value: any }) => void

type AddRelationshipToNodeFunction = (id: string, relationshipNodeId: string, type: string) => void

type AddNodeFunction = (
  name: string,
  type: string,
  styleProps: object,
  properties: {[key: string]: { type: string, value: any}},
  relationships: { [key: string]: any[]},
  target: string|null
) => void


type NodeData = {
  nodes: {[key: string]: GraphNode}
  addPropertyToNode: AddPropertyToNodeFunction
  addRelationshipToNode: AddRelationshipToNodeFunction
  addNode: AddNodeFunction
}

const useData = create<NodeData>((set, get) => ({
  nodes: {},
  addPropertyToNode: (id, property, value) => {
    set((state) => ({
      ...state,
      nodes: {
        ...state.nodes,
        [id]: {
          ...state.nodes[id],
          properties: {
            ...state.nodes[id].properties,
            [property]: value
          }
        }
      }
    }))
  },
  addRelationshipToNode: (id, relationshipNodeId, type) => {
    set((state) => ({
      ...state,
      nodes: {
        ...state.nodes,
        [id]: {
          ...state.nodes[id],
          relationships: {
            [type]: [
              ...state.nodes[id].relationships[type],
              relationshipNodeId
            ]
          }
        }
      }
    }))
  },
  addNode: (name, type, styleProps, properties={}, relationships=[], target=null) => {

    const id = name.toLowerCase().replace(" ", "_")

    set((state) => ({
      ...state,
      nodes: {
        ...state.nodes,
        [id]: {
          id,
          name,
          type,
          styleProps,
          properties,
          relationships,
          ...(target ? { target } : {})
        }
      }
    }))
  }
}))

export default useData