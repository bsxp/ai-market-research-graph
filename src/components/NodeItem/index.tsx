import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import AddPropertyDialog from './AddPropertyDialog'
import { Accordion } from '../ui/accordion'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { Tabs, TabsContent } from '../ui/tabs'
import { TabsList, TabsTrigger } from '../ui/tabs'
import { fetchCompetitors } from '../../api'
import { Icons } from '../ui/icons'
import useData from '../../hooks/useData'
import { GraphNode } from '../../types'
import GeneratePropertyDialog from './GeneratePropertyDialog'

interface Props {
  node: GraphNode
  id: string
  styleProps: object
  instance: any
  target: any
}

const endpointOptions = {
  isSource: true,
  isTarget: true,
  connector: ["FlowChart", { curviness: 175 }],
  connectorStyle: { strokeWidth: 2, stroke: "red" },
  scope: "blueline",
  dragAllowedWhenFull: false,
  endpoint: "Blank",
  cornerRadius: '5px'
};

const NodeItem: React.FC<Props> = ({
  node,
  target,
  id,
  styleProps={},
  instance,
  ...rest
}) => {

  const { addNode } = useData()

  const el = useRef(null);
  
  const { name, description, properties={} } = node 

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    instance &&
      instance.draggable(el.current, {
        grid: [24, 32],
        drag: function () {
          instance.repaintEverything();
        }
      });
    instance &&
      instance.addEndpoint(el.current, { anchor: "Left" }, endpointOptions);
  }, [instance]);

  useEffect(() => {
    target &&
      instance &&
      instance.connect({
        source: id,
        target,
        scope: "someScope"
      });
  }, [target, id, instance]);

  const findCompetitors = async () => {
    setLoading(true)
    
    try {
      // Fetch and select response 
      const response = await fetchCompetitors(node.name, 10);
      const responseOptions = response.data.choices[0].message.content

      // Validate the response was a JSON.. may not happen sometimes
      const validJson = JSON.parse(responseOptions)
      
      const { competitors } = validJson

      competitors.forEach((competitor, i) => {
        const { companyName, industrySegment, numCompetitors } = competitor
        console.log({ companyName, industrySegment, numCompetitors })
        addNode(
          companyName.toLowerCase().replace(" ", "_"), // underscore separated version of the company name
          companyName,
          "company", // node type
          {
            top: `${80 + (i * 300)}px`,
            left: `${250 + 400}px`
          },
          {
            "Industry Segment": {
              type: 'text',
              value: industrySegment
            },
            "Competitors": {
              type: 'number',
              value: numCompetitors
            }
          },
          [],
          node.id
        )
      })
    } catch (err) {
      console.log("Error parsing response:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
    ref={el}
    id={id}
    style={{
      position: 'absolute',
      zIndex: 1,
      backgroundColor: 'white',
      cursor: 'grab',
      ...styleProps
    }}
    {...rest}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion collapsible type='single'>
          <AccordionItem value='properties'>
            <AccordionTrigger>
              Properties
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-x-2">
              <AddPropertyDialog nodeId={id}/>
              <GeneratePropertyDialog nodeId={id}/>
              </div>
              <ul>
                {Object.keys(properties).map((propertyName) => (
                  <li>
                    <Button variant='ghost' className="ml-6">
                      <span className="text-gray-500">{propertyName}</span>: "{properties[propertyName].value}"
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='relationships'>
            <AccordionTrigger>
              Relationships
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue='competitors' className='w-full'>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="competitors" disabled={loading}>Competitors</TabsTrigger>
                  <TabsTrigger value="people" disabled>People</TabsTrigger>
                </TabsList>
                <TabsContent value='competitors'>
                  <Button onClick={findCompetitors} disabled={loading}>
                    Find competitors
                    {loading && (
                      <Icons.spinner className="mx-2 h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default NodeItem