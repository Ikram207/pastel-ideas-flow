import AppLayout from '@/layouts/AppLayout';
import { Helmet } from 'react-helmet-async';
import { useIdeas } from '@/context/IdeasContext';
import { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const statusLabel: Record<'todo' | 'in_progress' | 'done', string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
};

const IdeasList = () => {
  const { ideas } = useIdeas();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return ideas.filter(i =>
      i.title.toLowerCase().includes(s) || `${i.creatorFirstName} ${i.creatorLastName}`.toLowerCase().includes(s)
    );
  }, [ideas, q]);

  return (
    <AppLayout>
      <Helmet>
        <title>Liste des idées — Idées & Tâches</title>
        <meta name="description" content="Consultez toutes les idées/tâches, triez et recherchez facilement." />
        <link rel="canonical" href={window.location.origin + '/ideas'} />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Liste des idées</h1>
        <p className="text-muted-foreground mt-2">Cliquez sur une ligne pour voir les détails.</p>
      </header>
      <div className="mb-4 max-w-md">
        <Input placeholder="Rechercher par titre ou créateur" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Créateur</TableHead>
              <TableHead>Date début</TableHead>
              <TableHead>Date limite</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Groupe assigné</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((i) => (
              <TableRow key={i.id} className="cursor-pointer hover:bg-muted/40" onClick={() => navigate(`/ideas/${i.id}`)}>
                <TableCell className="font-medium">{i.title}</TableCell>
                <TableCell>{i.creatorFirstName} {i.creatorLastName}</TableCell>
                <TableCell>{new Date(i.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(i.dueDate).toLocaleDateString()}</TableCell>
                <TableCell><Badge>{statusLabel[i.status]}</Badge></TableCell>
                <TableCell>{i.groups.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default IdeasList;
