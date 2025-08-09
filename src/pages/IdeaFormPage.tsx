import AppLayout from '@/layouts/AppLayout';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useIdeas } from '@/context/IdeasContext';
import { useNavigate, useParams } from 'react-router-dom';
import MultiSelectPopover from '@/components/MultiSelectPopover';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const FormSchema = z.object({
  title: z.string().min(2, 'Titre requis'),
  description: z.string().min(4, 'Description requise'),
  creatorFirstName: z.string().min(1, 'Prénom requis'),
  creatorLastName: z.string().min(1, 'Nom requis'),
  startDate: z.date({ required_error: 'Date de début requise' }),
  dueDate: z.date({ required_error: 'Date limite requise' }),
  status: z.enum(['todo', 'in_progress', 'done']),
  groups: z.array(z.string()).default([]),
  assignees: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof FormSchema>;

const IdeaFormPage = ({ mode }: { mode: 'create' | 'edit' }) => {
  const { id } = useParams();
  const { groups, users, createIdea, updateIdea, getIdea } = useIdeas();
  const navigate = useNavigate();

  const editing = mode === 'edit' && id ? getIdea(id) : undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: editing ? {
      title: editing.title,
      description: editing.description,
      creatorFirstName: editing.creatorFirstName,
      creatorLastName: editing.creatorLastName,
      startDate: new Date(editing.startDate),
      dueDate: new Date(editing.dueDate),
      status: editing.status,
      groups: editing.groups,
      assignees: editing.assignees,
    } : {
      title: '',
      description: '',
      creatorFirstName: '',
      creatorLastName: '',
      startDate: new Date(),
      dueDate: new Date(),
      status: 'todo',
      groups: [],
      assignees: [],
    }
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      title: data.title,
      description: data.description,
      creatorFirstName: data.creatorFirstName,
      creatorLastName: data.creatorLastName,
      startDate: data.startDate.toISOString(),
      dueDate: data.dueDate.toISOString(),
      status: data.status,
      groups: data.groups,
      assignees: data.assignees,
    };

    if (editing) {
      updateIdea(editing.id, payload);
      toast({ title: 'Idée modifiée' });
      navigate(`/ideas/${editing.id}`);
    } else {
      createIdea(payload);
      toast({ title: 'Idée créée' });
      form.reset();
    }
  };

  return (
    <AppLayout>
      <Helmet>
        <title>{mode === 'create' ? 'Créer une idée' : 'Modifier une idée'} — Idées & Tâches</title>
        <meta name="description" content={mode === 'create' ? 'Créez une nouvelle idée/tâche.' : 'Modifiez les informations de votre idée.'} />
        <link rel="canonical" href={window.location.origin + (mode === 'create' ? '/ideas/new' : `/ideas/${id}/edit`)} />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{mode === 'create' ? 'Créer une idée' : 'Modifier une idée'}</h1>
        <p className="text-muted-foreground mt-2">Renseignez les informations ci-dessous.</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du projet</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <FormControl>
                <select className="w-full border rounded-md bg-background p-2" value={field.value} onChange={field.onChange}>
                  <option value="todo">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="done">Terminé</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="creatorFirstName" render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="creatorLastName" render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="startDate" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de début</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className={cn('pl-3 text-left font-normal justify-start', !field.value && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? new Date(field.value).toLocaleDateString() : <span>Choisir une date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn('p-3 pointer-events-auto')} />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="dueDate" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date limite</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className={cn('pl-3 text-left font-normal justify-start', !field.value && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? new Date(field.value).toLocaleDateString() : <span>Choisir une date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn('p-3 pointer-events-auto')} />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="groups" render={({ field }) => (
            <FormItem>
              <FormLabel>Groupe(s) assigné(s)</FormLabel>
              <FormControl>
                <MultiSelectPopover label="Sélectionner des groupes" options={groups} values={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="assignees" render={({ field }) => (
            <FormItem>
              <FormLabel>Personnes assignées</FormLabel>
              <FormControl>
                <MultiSelectPopover label="Sélectionner des personnes" options={users} values={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea rows={5} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="md:col-span-2 flex gap-3">
            <Button type="submit">{mode === 'create' ? 'Créer' : 'Enregistrer'}</Button>
            {editing && <Button type="button" variant="secondary" onClick={() => navigate(`/ideas/${editing.id}`)}>Annuler</Button>}
          </div>
        </form>
      </Form>
    </AppLayout>
  );
};

export default IdeaFormPage;
