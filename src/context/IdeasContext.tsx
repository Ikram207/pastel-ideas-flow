import React, { createContext, useContext, useMemo, useState } from 'react';
import { Idea, Status } from '@/types';
import { format } from 'date-fns';

interface IdeasContextValue {
  ideas: Idea[];
  users: string[]; // available people names
  groups: string[]; // available groups
  createIdea: (input: Omit<Idea, 'id'>) => void;
  updateIdea: (id: string, input: Omit<Idea, 'id'>) => void;
  deleteIdea: (id: string) => void;
  totalsByStatus: Record<Status, number>;
  totalsByUser: { name: string; created: number; assigned: number }[];
  getIdea: (id: string) => Idea | undefined;
}

const IdeasContext = createContext<IdeasContextValue | undefined>(undefined);

const DEFAULT_USERS = ['Alice Martin', 'Bob Durand', 'Charlie Dupont', 'Diane Leroy'];
const DEFAULT_GROUPS = ['Produit', 'Design', 'Développement', 'Marketing'];

const todayISO = () => new Date().toISOString();
const plusDaysISO = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

const INITIAL_IDEAS: Idea[] = [
  {
    id: crypto.randomUUID(),
    title: 'Refonte page d’accueil',
    description: 'Améliorer le hero, CTA et sections clés.',
    creatorFirstName: 'Alice',
    creatorLastName: 'Martin',
    startDate: todayISO(),
    dueDate: plusDaysISO(10),
    status: 'in_progress',
    groups: ['Design', 'Produit'],
    assignees: ['Bob Durand']
  },
  {
    id: crypto.randomUUID(),
    title: 'MVP onboarding',
    description: 'Parcours d’inscription simplifié.',
    creatorFirstName: 'Bob',
    creatorLastName: 'Durand',
    startDate: todayISO(),
    dueDate: plusDaysISO(20),
    status: 'todo',
    groups: ['Développement'],
    assignees: ['Charlie Dupont', 'Diane Leroy']
  },
  {
    id: crypto.randomUUID(),
    title: 'Campagne email Q3',
    description: 'Segmenter la base et préparer 3 newsletters.',
    creatorFirstName: 'Diane',
    creatorLastName: 'Leroy',
    startDate: todayISO(),
    dueDate: plusDaysISO(5),
    status: 'done',
    groups: ['Marketing'],
    assignees: []
  }
];

export const IdeasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  const [users] = useState<string[]>(DEFAULT_USERS);
  const [groups] = useState<string[]>(DEFAULT_GROUPS);

  const createIdea = (input: Omit<Idea, 'id'>) => {
    setIdeas(prev => [{ id: crypto.randomUUID(), ...input }, ...prev]);
  };

  const updateIdea = (id: string, input: Omit<Idea, 'id'>) => {
    setIdeas(prev => prev.map(i => (i.id === id ? { id, ...input } : i)));
  };

  const deleteIdea = (id: string) => setIdeas(prev => prev.filter(i => i.id !== id));

  const totalsByStatus = useMemo(() => ({
    todo: ideas.filter(i => i.status === 'todo').length,
    in_progress: ideas.filter(i => i.status === 'in_progress').length,
    done: ideas.filter(i => i.status === 'done').length,
  }), [ideas]);

  const totalsByUser = useMemo(() => {
    const createdMap = new Map<string, number>();
    const assignedMap = new Map<string, number>();

    ideas.forEach(i => {
      const name = `${i.creatorFirstName} ${i.creatorLastName}`.trim();
      createdMap.set(name, (createdMap.get(name) || 0) + 1);
      i.assignees.forEach(a => assignedMap.set(a, (assignedMap.get(a) || 0) + 1));
    });

    const names = new Set<string>([...users, ...createdMap.keys(), ...assignedMap.keys()]);
    return Array.from(names).map(name => ({
      name,
      created: createdMap.get(name) || 0,
      assigned: assignedMap.get(name) || 0,
    }));
  }, [ideas, users]);

  const getIdea = (id: string) => ideas.find(i => i.id === id);

  const value: IdeasContextValue = { ideas, users, groups, createIdea, updateIdea, deleteIdea, totalsByStatus, totalsByUser, getIdea };
  return <IdeasContext.Provider value={value}>{children}</IdeasContext.Provider>;
};

export const useIdeas = () => {
  const ctx = useContext(IdeasContext);
  if (!ctx) throw new Error('useIdeas must be used within IdeasProvider');
  return ctx;
};
