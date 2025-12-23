import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - SaleDashboard',
  description: 'Create your account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            SaleDashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create an account to get started
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}