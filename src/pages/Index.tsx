import { Helmet } from 'react-helmet-async';
import AppLayout from '@/layouts/AppLayout';
import StatsCard from '@/components/StatsCard';
import { useIdeas } from '@/context/IdeasContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const Dashboard = () => {
  const { totalsByStatus, totalsByUser } = useIdeas();

  const statusData = [
    { name: 'À faire', value: totalsByStatus.todo },
    { name: 'En cours', value: totalsByStatus.in_progress },
    { name: 'Terminé', value: totalsByStatus.done },
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Tableau de bord — Idées & Tâches</title>
        <meta name="description" content="Vue d’ensemble des idées: totaux par statut et statistiques par personne." />
        <link rel="canonical" href={window.location.origin + '/'} />
      </Helmet>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Suivez l’avancement global et les contributions par personne.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3 mb-8">
        <StatsCard title="À faire" value={totalsByStatus.todo} />
        <StatsCard title="En cours" value={totalsByStatus.in_progress} />
        <StatsCard title="Terminé" value={totalsByStatus.done} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-surface p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Statistiques par personne</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalsByUser}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="created" name="Créées" fill="hsl(var(--primary))" />
                <Bar dataKey="assigned" name="Assignées" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-surface p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Répartition par statut</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div className="mt-8 flex gap-3">
        <Link to="/ideas"><Button variant="secondary">Voir la liste</Button></Link>
        <Link to="/ideas/new"><Button>Créer une idée</Button></Link>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
