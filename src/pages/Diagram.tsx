import React, { useEffect, useRef, useState } from "react";
import { jsPlumb, jsPlumbInstance } from "jsplumb";
import NodeItem from "../components/NodeItem";
import useData from "../hooks/useData";
import "../index.css"

interface Props {}

// Handle all the logic and drawing of the diagram
const Diagram: React.FC<Props> = ({}) => {

  const { nodes } = useData()

  const [instance, setInstance] = useState<jsPlumbInstance | null>(null);
  const container = useRef(null);

  useEffect(() => {
    const toolkit = jsPlumb.getInstance({
      PaintStyle: {
        strokeWidth: 2,
        stroke: "#bcbec2",
      },
      Connector: ["Flowchart", { curviness: 20 }],
      Endpoint: ["Dot", { radius: 1 }],
      EndpointStyle: { fill: "#567567" },
      Anchors: ["TopCenter", "BottomCenter"],
      Container: container.current
    });

    setInstance(toolkit);
  }, []);


  return (
    <>
      <div ref={container} id="drawing" className="App">
        {Object.values(nodes).map((item) => {
          return (
            <NodeItem
              node={item}
              styleProps={item.styleProps}
              id={item.id}
              target={item.target}
              instance={instance}
            />
          );
        })}
      </div>
    </>
  );
}

export default Diagram