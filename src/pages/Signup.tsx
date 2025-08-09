import AppLayout from '@/layouts/AppLayout';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Schema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, '6 caractères minimum')
});

type Values = z.infer<typeof Schema>;

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const form = useForm<Values>({ resolver: zodResolver(Schema), defaultValues: { firstName: '', lastName: '', email: '', password: '' } });

  const onSubmit = async (values: Values) => {
    await signup(values.firstName, values.lastName, values.email, values.password);
    toast({ title: 'Inscription réussie' });
    navigate('/');
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Inscription — Idées & Tâches</title>
        <meta name="description" content="Créez un compte pour gérer vos idées et tâches." />
        <link rel="canonical" href={window.location.origin + '/signup'} />
      </Helmet>
      <header className="mb-6"><h1 className="text-3xl font-bold">Inscription</h1></header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit">Créer le compte</Button>
        </form>
      </Form>
    </AppLayout>
  );
};

export default Signup;
