import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import useData from '../../hooks/useData'
import { Icons } from '../ui/icons'

const formSchema = z.object({
  companyName: z.string().max(80),
})

interface Props {}

// Take user's input for a company to stat working with
const EntrypointForm: React.FC<Props> = () => {

  const { addNode, nodes } = useData()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
    },
  })

  const [loading, setLoading] = useState<boolean>(false)

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      addNode(values.companyName, 'company', { top: 40, left: 40}, {}, {}, null)
    } catch (err) {
      console.log("Failed to generate and add node to graph.")
    } finally {
      setLoading(false)
    }
  }

  // Only display the entrypoint form if this view doesn't have an entry node yet
  if (Object.keys(nodes).length) return null

  return (
    <Card className="bg-white max-w-2xl m-4">
      <CardHeader>
        <CardTitle>
          Get started
        </CardTitle>
        <CardDescription className="text-gray-500">
          Enter the name of a company and we'll get started generating your graph.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
            control={form.control}
            name='companyName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company name</FormLabel>
                <FormControl>
                    <Input placeholder='Enter a company name' {...field} />
                </FormControl>
              </FormItem>
            )}
            />
            <Button
            type='submit'
            variant='default'
            disabled={loading}
            >
              Get started
              {loading && (
                <Icons.spinner className="mx-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default EntrypointForm
