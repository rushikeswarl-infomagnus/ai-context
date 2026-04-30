import { Button } from '@acme/ui';
import { formatDate } from '@acme/utils';

const HomePage = (): JSX.Element => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">ACME Platform</h1>
      <p className="text-gray-600 mb-8">Today is {formatDate(new Date())}</p>
      <Button label="Get Started" variant="primary" />
    </main>
  );
};

export default HomePage;
