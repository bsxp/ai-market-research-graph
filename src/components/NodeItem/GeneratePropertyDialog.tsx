import React, { useState } from 'react'

// ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Search } from 'lucide-react'
import * as z from "zod"

// hooks
import { useForm } from 'react-hook-form'
import useData from '../../hooks/useData'

const formSchema = z.object({
  property: z.string(),
  type: z.string(),
})

interface Props {
  nodeId: string
}

const GeneratePropertyDialog: React.FC<Props> = ({
  nodeId
}) => {

  const [open, setOpen] = useState<boolean>(false)
  const [generatedValue, setGeneratedValue] = useState<any>(null)

  const { addPropertyToNode } = useData()

// 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property: "",
      type: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addPropertyToNode(nodeId, values.property, {
      type: values.type,
      value: generatedValue
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' className="text-blue-500">
          <Search className="mr-2 h-4 w-4"/>Find property
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>Find property</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="property"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select what type of data this property is" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-white'>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant='default'>Search</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default GeneratePropertyDialog
