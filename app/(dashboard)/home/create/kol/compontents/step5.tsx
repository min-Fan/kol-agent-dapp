"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useStepperContext } from "@/app/context/stepper-context";
import QueryMask from "@/app/components/comm/QueryMask";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";

const formSchema = z.object({
  post: z
    .string()
    .refine(
      (val) => Number.isInteger(Number(val)),
      "Must be an integer"
    )
    .refine(
      (val) => Number(val) >= 1 && Number(val) <= 10,
      "Must be between 1 and 10"
    ),
  repost: z
    .string()
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) > 0,
      "Must be a positive integer"
    )
    .refine(
      (val) => Number(val) >= 1 && Number(val) <= 10,
      "Must be between 1 and 10"
    ),
  quote: z
    .string()
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) > 0,
      "Must be a positive integer"
    )
    .refine(
      (val) => Number(val) >= 1 && Number(val) <= 10,
      "Must be between 1 and 10"
    ),
  like: z
    .string()
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) > 0,
      "Must be a positive integer"
    )
    .refine(
      (val) => Number(val) >= 1 && Number(val) <= 200,
      "Must be between 1 and 200"
    ),
  reply: z
    .string()
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) > 0,
      "Must be a positive integer"
    )
    .refine(
      (val) => Number(val) >= 1 && Number(val) <= 10,
      "Must be between 1 and 10"
    ),
  comment: z
    .string()
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) > 0,
      "Must be a positive integer"
    )
    .refine(
      (val) => Number(val) >= 1 && Number(val) <= 10,
      "Must be between 1 and 10"
    ),
});

export default function StepFive() {
  const { handleNext, handleBack, currentStep } = useStepperContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "10",
      repost: "10",
      quote: "10",
      like: "200",
      reply: "10",
      comment: "10",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    handleNext();
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 px-2">
      <div className="space-y-1">
        <h3 className="text-xl font-bold capitalize">configuration</h3>
        <p className="text-md text-muted-foreground">
          Set the frequency at which you want to execute the options.
        </p>
      </div>
      <div className="flex-1 h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="post"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <div className="space-y-2 w-full">
                      <dl>
                        <dt className="text-md font-bold capitalize flex items-center gap-1">
                          <span className="text-primary font-bold text-md">
                            Post
                          </span>
                          <QueryMask>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleHelp className="h-3 w-3 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    It is recommended not to exceed 10 responses
                                    per day.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </QueryMask>
                        </dt>
                        <dd className="text-sm text-muted-foreground">
                          Set the frequency at which you want to execute post
                        </dd>
                      </dl>
                      <div className="border rounded-md px-2 shadow-sm group flex items-center justify-between space-x-2 py-2">
                        <Input
                          {...field}
                          placeholder="Enter post frequency"
                          className="text-md w-full border-none shadow-none p-2"
                        />
                        <p className="whitespace-nowrap text-md text-muted-foreground">
                          Counts / <strong className="text-primary">24</strong>{" "}
                          Hours
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repost"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <div className="space-y-2 w-full">
                      <dl>
                        <dt className="text-md font-bold capitalize flex items-center gap-1">
                          <span className="text-primary font-bold text-md">
                            Repost
                          </span>
                          <QueryMask>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleHelp className="h-3 w-3 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    It is recommended not to exceed 10 responses
                                    per day.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </QueryMask>
                        </dt>
                        <dd className="text-sm text-muted-foreground">
                          Set the frequency at which you want to execute repost
                        </dd>
                      </dl>
                      <div className="border rounded-md px-2 shadow-sm group flex items-center justify-between space-x-2 py-2">
                        <Input
                          {...field}
                          placeholder="Enter repost frequency"
                          className="text-md w-full border-none shadow-none p-2"
                        />
                        <p className="whitespace-nowrap text-md text-muted-foreground">
                          Counts / <strong className="text-primary">24</strong>{" "}
                          Hours
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <div className="space-y-2 w-full">
                      <dl>
                        <dt className="text-md font-bold capitalize flex items-center gap-1">
                          <span className="text-primary font-bold text-md">
                            Quote
                          </span>
                          <QueryMask>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleHelp className="h-3 w-3 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    It is recommended not to exceed 10 responses
                                    per day.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </QueryMask>
                        </dt>
                        <dd className="text-sm text-muted-foreground">
                          Set the frequency at which you want to execute quote
                        </dd>
                      </dl>
                      <div className="border rounded-md px-2 shadow-sm group flex items-center justify-between space-x-2 py-2">
                        <Input
                          {...field}
                          placeholder="Enter quote frequency"
                          className="text-md w-full border-none shadow-none p-2"
                        />
                        <p className="whitespace-nowrap text-md text-muted-foreground">
                          Counts / <strong className="text-primary">24</strong>{" "}
                          Hours
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="like"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <div className="space-y-2 w-full">
                      <dl>
                        <dt className="text-md font-bold capitalize flex items-center gap-1">
                          <span className="text-primary font-bold text-md">
                            Like
                          </span>
                          <QueryMask>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleHelp className="h-3 w-3 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    It is recommended not to exceed 200
                                    responses per day.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </QueryMask>
                        </dt>
                        <dd className="text-sm text-muted-foreground">
                          Set the frequency at which you want to execute like
                        </dd>
                      </dl>
                      <div className="border rounded-md px-2 shadow-sm group flex items-center justify-between space-x-2 py-2">
                        <Input
                          {...field}
                          placeholder="Enter like frequency"
                          className="text-md w-full border-none shadow-none p-2"
                        />
                        <p className="whitespace-nowrap text-md text-muted-foreground">
                          Counts / <strong className="text-primary">24</strong>{" "}
                          Hours
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reply"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <div className="space-y-2 w-full">
                      <dl>
                        <dt className="text-md font-bold capitalize flex items-center gap-1">
                          <span className="text-primary font-bold text-md">
                            Reply
                          </span>
                          <QueryMask>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleHelp className="h-3 w-3 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    It is recommended not to exceed 10 responses
                                    per day.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </QueryMask>
                        </dt>
                        <dd className="text-sm text-muted-foreground">
                          Set the frequency at which you want to execute reply
                        </dd>
                      </dl>
                      <div className="border rounded-md px-2 shadow-sm group flex items-center justify-between space-x-2 py-2">
                        <Input
                          {...field}
                          placeholder="Enter reply frequency"
                          className="text-md w-full border-none shadow-none p-2"
                        />
                        <p className="whitespace-nowrap text-md text-muted-foreground">
                          Counts / <strong className="text-primary">24</strong>{" "}
                          Hours
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <div className="space-y-2 w-full">
                      <dl>
                        <dt className="text-md font-bold capitalize flex items-center gap-1">
                          <span className="text-primary font-bold text-md">
                            Comment
                          </span>
                          <QueryMask>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleHelp className="h-3 w-3 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    It is recommended not to exceed 10 responses
                                    per day.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </QueryMask>
                        </dt>
                        <dd className="text-sm text-muted-foreground">
                          Set the frequency at which you want to execute comment
                        </dd>
                      </dl>
                      <div className="border rounded-md px-2 shadow-sm group flex items-center justify-between space-x-2 py-2">
                        <Input
                          {...field}
                          placeholder="Enter comment frequency"
                          className="text-md w-full border-none shadow-none p-2"
                        />
                        <p className="whitespace-nowrap text-md text-muted-foreground">
                          Counts / <strong className="text-primary">24</strong>{" "}
                          Hours
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button
                onClick={handleBack}
                variant="ghost"
                type="button"
                className={`duration-350 h-10 rounded transition text-md ${
                  currentStep === 1
                    ? "pointer-events-none opacity-50 text-neutral-400"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                Previous
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="duration-350 h-10 flex items-center justify-center font-bold px-10"
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
