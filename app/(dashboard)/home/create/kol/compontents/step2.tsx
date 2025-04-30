"use client";
import { useStepperContext } from "@/app/context/stepper-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnimatedList from "@/app/components/comm/AnimatedList";
import { CheckIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { updateFrom } from "@/app/store/reducers/userSlice";
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <FormLabel className="flex items-center">
      {children} <span className="text-red-500 ml-1">*</span>
    </FormLabel>
  );
}

const formSchema = z.object({
  ability: z.string().min(2).max(4000),
  name: z.string().min(2).max(100),
});

export default function StepOne() {
  const { handleNext, handleBack, currentStep } = useStepperContext();
  const step2Init = useAppSelector(
    (state: any) => state.userReducer.from.step2
  );
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ability: step2Init?.ability || "",
      name: step2Init?.name || "",
    },
  });

  const prevValuesRef = useRef(form.getValues());

  const initialRenderRef = useRef(true);

  useEffect(() => {
    const subscription = form.watch((values) => {
      const currentValues = form.getValues();

      if (
        JSON.stringify(currentValues) !== JSON.stringify(prevValuesRef.current)
      ) {
        dispatch(updateFrom({ key: "step2", value: currentValues }));
        prevValuesRef.current = { ...currentValues };
      }
    });

    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  useEffect(() => {
    if (initialRenderRef.current && step2Init) {
      form.reset({
        ability: step2Init.ability || "",
        name: step2Init.name || "",
      });
      initialRenderRef.current = false;
    }
  }, [step2Init, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    handleNext();
  }

  const [selectedTemplateIds, setSelectedTemplateIds] = useState<number[]>([]);
  const ability = useAppSelector(
    (state: any) => state.userReducer.config.ability
  );

  const [abilityStr, setAbilityStr] = useState<string[]>([]);

  // 初始化时检查已有的ability内容，标记已选择的模板
  useEffect(() => {
    if (step2Init?.ability) {
      // 拆分现有ability为数组
      const existingAbilities = step2Init.ability.split("\n").filter(Boolean);
      setAbilityStr(existingAbilities);

      // 查找哪些模板已被选择
      const selectedIds: number[] = [];
      ability.forEach((template: any) => {
        if (existingAbilities.includes(template.desc)) {
          selectedIds.push(template.id);
        }
      });

      setSelectedTemplateIds(selectedIds);
    }
  }, [step2Init, ability]);

  const add = (val: string, id: number, name: string) => {
    // 检查是否已经选择了这个模板
    if (selectedTemplateIds.includes(id)) {
      toast.error("This template has already been selected");
      return;
    }

    const newAbilityStr = [...abilityStr, val];
    setAbilityStr(newAbilityStr);
    form.setValue("ability", newAbilityStr.join("\n"));
    form.setValue("name", name);

    // 添加到已选择的模板ID列表
    setSelectedTemplateIds([...selectedTemplateIds, id]);

    toast.success("Input Success");
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 px-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            rules={{ required: "Ability is required" }}
            name="ability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-bold">Ability</span>
                    <span className="text-sm text-gray-500">
                      Please enter the character's abilities and characteristics
                      of this Agent.
                    </span>
                  </div>
                </FormLabel>
                <FormControl>
                  <div className="w-full overflow-hidden relative">
                    <Textarea
                      {...field}
                      readOnly
                      placeholder="Enter your ability"
                      className="pb-10 min-h-30 max-h-60"
                    />
                    <div className="absolute bottom-2 left-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-fit flex items-center justify-center gap-2 relative"
                            variant="foreground"
                            type="button"
                          >
                            <span className="text-sm font-bold">Templates</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-lg min-w-[300px] text-primary">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-bold">
                              Ability Templates
                            </DialogTitle>
                            <DialogDescription>
                              Select a template to use for your ability
                            </DialogDescription>
                          </DialogHeader>
                          <div className="w-full max-h-[400px]">
                            <AnimatedList
                              items={ability.map((template: any) => (
                                <div
                                  className={`w-full flex items-center justify-between rounded-md p-2 ${
                                    selectedTemplateIds.includes(template.id)
                                      ? "bg-primary/10 border border-primary/20"
                                      : "bg-gray-100"
                                  }`}
                                  key={template.id}
                                >
                                  <div className="flex flex-col gap-1 w-full">
                                    <span className="text-sm font-bold">
                                      {template.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {template.desc}
                                    </span>
                                  </div>
                                  {selectedTemplateIds.includes(template.id) ? (
                                    <Button
                                      variant="outline"
                                      className="flex items-center px-3 py-1 text-primary"
                                    >
                                      <CheckIcon className="w-4 h-4 mr-1 text-secondary" />
                                      <span className="text-secondary text-md">
                                        Selected
                                      </span>
                                    </Button>
                                  ) : (
                                    <Button
                                      className="w-fit flex items-center gap-1"
                                      onClick={() =>
                                        add(
                                          template.desc,
                                          template.id,
                                          template.name
                                        )
                                      }
                                    >
                                      <span>Input</span>
                                    </Button>
                                  )}
                                </div>
                              ))}
                              showGradients={true}
                              enableArrowNavigation={true}
                              displayScrollbar={true}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-10">
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
  );
}
