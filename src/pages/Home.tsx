import { useEffect, useRef, useState } from "react";
import { jsPlumb } from 'jsplumb'
import NodeItem from "../components/NodeItem";

const primaryNodes = [
  {
    name: "Paragon Pharmaceuticals",
    styleProps: { top: "80px", left: "250px" },
    id: "e1"
  },
    {
    name: "Paragon Pharmaceuticals 2",
    styleProps: { top: "160px", left: "150px" },
    id: "e2"
  },
];


export default function Home() {

  const [nodes, setNodes] = useState<any[]>(primaryNodes)
  const [instance, setInstance] = useState<any>(null);
  const container = useRef(null);

  useEffect(() => {
   }, []);

  //GET INSTANCE OF JS PLUMB
  useEffect(() => {
    const Instnc = jsPlumb.getInstance({
      PaintStyle: {
        strokeWidth: 1,
        stroke: "#567567",
      },
      Connector: ["Flowchart", { curviness: 20 }],
      Endpoint: ["Dot", { radius: 1 }],
      EndpointStyle: { fill: "#567567" },
      Anchors: ["Right", "Right"],
      Container: container.current
    });
    console.log(Instnc);
    //using useEffect to set instance
    setInstance(Instnc);  
  }, []);
  
  const New = () => {
    setNodes((prev) => [
      ...prev,
      {
        name: "New",
        styleProps: { top: "260px", left: "420px" },
        id: `New_${Math.random()}`,
        instance: instance,
      }
      
    ]);
  };
  const DeleteOne = () => {
    //Target node ID 
    instance.remove(nodes[2].id, false, [false]);
  };
  
  const Delete = () => {
    instance.deleteEveryEndpoint();
  };

  return (
    <div
    style={{
      width: '100vw',
      height: '100vh',
      backgroundSize: '16px 16px',
      backgroundImage: 'radial-gradient(#cdc5fb 1px,transparent 0)',
      backgroundPosition: '50%',
      zIndex: 0,
      backgroundColor: 'rgb(247,247,255)'
    }}
    >
      <div
      ref={container}
      style={{
        height: '100%',
        width: '100%',
      }}  

      >
        {nodes.map((item) => {
          return (
            <NodeItem
              name={item.name}
              styleProps={item.styleProps}
              id={item.id}
              target={item.target}
              instance={instance}
            />
          );
        })}
      </div>
    </div>
  );
}