import { Button } from '@acme/ui';

export const App = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">ACME Admin Dashboard</h1>
      <div className="flex gap-4">
        <Button label="Manage Users" variant="primary" />
        <Button label="Manage Posts" variant="secondary" />
      </div>
    </div>
  );
};
