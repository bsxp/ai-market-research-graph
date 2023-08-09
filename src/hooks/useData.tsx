import { create } from 'zustand'

const defaultNodes = {
  'e1': {
    name: "Paragon Pharmaceutical",
    styleProps: { top: "80px", left: "250px" },
    type: 'company',
    id: "e1"
  }
}

const useData = create((set, get) => ({
  nodes: defaultNodes,
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
  addRelationshipToNode: (id: string, relationshipNodeId: string, type: string) => {
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
  addNode: (id: string, name: string, type: string, styleProps: object, properties={}, relationships=[], target: string|null=null) => {
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