import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Idea } from '@/types';
import { Badge } from '@/components/ui/badge';

const statusLabel: Record<Idea['status'], string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
};

const IdeaCard: React.FC<{ idea: Idea }> = ({ idea }) => {
  return (
    <Card className="glass-surface">
      <CardHeader>
        <CardTitle className="text-2xl">{idea.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Créateur</p>
          <p>{idea.creatorFirstName} {idea.creatorLastName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Statut</p>
          <Badge className="mt-1">{statusLabel[idea.status]}</Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Date de début</p>
          <p>{new Date(idea.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Date limite</p>
          <p>{new Date(idea.dueDate).toLocaleDateString()}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>{idea.description}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Groupes</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {idea.groups.map(g => (<Badge key={g} variant="secondary">{g}</Badge>))}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Assignées à</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {idea.assignees.length ? idea.assignees.map(a => (<Badge key={a} variant="outline">{a}</Badge>)) : <span className="text-muted-foreground">Aucune</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
