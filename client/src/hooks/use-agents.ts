import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertAgent, type Agent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAgents() {
  return useQuery({
    queryKey: [api.agents.list.path],
    queryFn: async () => {
      const res = await fetch(api.agents.list.path);
      if (!res.ok) throw new Error("Failed to fetch agents");
      return api.agents.list.responses[200].parse(await res.json());
    },
  });
}

export function useAgent(id: number) {
  return useQuery({
    queryKey: [api.agents.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.agents.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch agent");
      return api.agents.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertAgent) => {
      const res = await fetch(api.agents.create.path, {
        method: api.agents.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create agent");
      }
      return api.agents.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.agents.list.path] });
      toast({ title: "Success", description: "Agent created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertAgent>) => {
      const url = buildUrl(api.agents.update.path, { id });
      const res = await fetch(url, {
        method: api.agents.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update agent");
      }
      return api.agents.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.agents.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.agents.get.path, data.id] });
      toast({ title: "Changes saved", description: "Agent configuration updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.agents.delete.path, { id });
      const res = await fetch(url, { method: api.agents.delete.method });
      if (!res.ok) throw new Error("Failed to delete agent");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.agents.list.path] });
      toast({ title: "Agent deleted", description: "The agent has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeployAgent() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.agents.deploy.path, { id });
      const res = await fetch(url, { method: api.agents.deploy.method });
      if (!res.ok) throw new Error("Deployment failed");
      return await res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Deployment started", description: data.message });
    },
    onError: (error: Error) => {
      toast({ title: "Deployment failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useMakeCall() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, phoneNumber }: { agentId: number; phoneNumber: string }) => {
      const url = buildUrl(api.agents.makeCall.path, { id: agentId });
      const res = await fetch(url, {
        method: api.agents.makeCall.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "No se pudo iniciar la llamada");
      }
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/agents/${variables.agentId}/calls`] });
      toast({
        title: "Llamada iniciada",
        description: "Se ha solicitado la llamada de prueba correctamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
