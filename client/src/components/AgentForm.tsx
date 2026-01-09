import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertAgentSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Extend the schema for the form to handle the JSON config as a string initially
const formSchema = insertAgentSchema.extend({
  config: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON" });
      return z.NEVER;
    }
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AgentFormProps {
  defaultValues?: Partial<FormValues> & { config?: any };
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function AgentForm({ defaultValues, onSubmit, isLoading, onCancel }: AgentFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      agentId: defaultValues?.agentId || "",
      voiceId: defaultValues?.voiceId || "",
      language: defaultValues?.language || "en-US",
      config: JSON.stringify(defaultValues?.config || {
        response_engine: { type: "retell-llm" },
        is_published: false
      }, null, 2),
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Agent Name</Label>
          <Input 
            {...form.register("name")} 
            placeholder="e.g. Sales Representative" 
            className="bg-secondary/50 border-white/10"
          />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="agentId">External Agent ID (Optional)</Label>
          <Input 
            {...form.register("agentId")} 
            placeholder="e.g. agent_12345" 
            className="bg-secondary/50 border-white/10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select 
            onValueChange={(val) => form.setValue("language", val)} 
            defaultValue={form.getValues("language") || "en-US"}
          >
            <SelectTrigger className="bg-secondary/50 border-white/10">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
              <SelectItem value="es-CO">Spanish (Colombia)</SelectItem>
              <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="voiceId">Voice ID</Label>
          <Input 
            {...form.register("voiceId")} 
            placeholder="e.g. 11labs-Adam" 
            className="bg-secondary/50 border-white/10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="config">Configuration (JSON)</Label>
        <Textarea 
          {...form.register("config")} 
          className="font-mono text-sm bg-secondary/50 border-white/10 min-h-[300px]"
          placeholder="{ ... }"
        />
        {form.formState.errors.config && (
          <p className="text-xs text-destructive">{form.formState.errors.config.message as string}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Edit the raw JSON configuration for advanced settings like prompts, tools, and LLM parameters.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Agent
        </Button>
      </div>
    </form>
  );
}
