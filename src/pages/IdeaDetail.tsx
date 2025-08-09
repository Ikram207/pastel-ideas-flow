import AppLayout from '@/layouts/AppLayout';
import { Helmet } from 'react-helmet-async';
import { useIdeas } from '@/context/IdeasContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import IdeaCard from '@/components/IdeaCard';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const IdeaDetail = () => {
  const { id } = useParams();
  const { getIdea, deleteIdea } = useIdeas();
  const idea = id ? getIdea(id) : undefined;
  const navigate = useNavigate();

  if (!idea) return (
    <AppLayout>
      <p className="text-muted-foreground">Idée introuvable.</p>
    </AppLayout>
  );

  const onDelete = () => {
    deleteIdea(idea.id);
    toast({ title: 'Idée supprimée' });
    navigate('/ideas');
  };

  return (
    <AppLayout>
      <Helmet>
        <title>{idea.title} — Détails</title>
        <meta name="description" content={`Détails de l’idée ${idea.title}.`} />
        <link rel="canonical" href={window.location.origin + `/ideas/${idea.id}`} />
      </Helmet>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Détail de l’idée</h1>
          <p className="text-muted-foreground">Toutes les informations à propos de cette idée.</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/ideas/${idea.id}/edit`}><Button className="inline-flex gap-2"><Pencil className="h-4 w-4" /> Modifier</Button></Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="inline-flex gap-2"><Trash className="h-4 w-4" /> Supprimer</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer cette idée ?</AlertDialogTitle>
                <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
      <IdeaCard idea={idea} />
    </AppLayout>
  );
};

export default IdeaDetail;
