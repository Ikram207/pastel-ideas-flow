import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface Props {
  title: string;
  value: number | string;
  hint?: string;
}

const StatsCard: React.FC<Props> = ({ title, value, hint }) => (
  <Card className="glass-surface">
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold">{value}</div>
      {hint && <p className="text-xs text-muted-foreground mt-2">{hint}</p>}
    </CardContent>
  </Card>
);

export default StatsCard;
