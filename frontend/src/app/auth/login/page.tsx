import { combineQueryValue } from '@/lib/utils';
import AuthPageContent from '@/components/auth/AuthPageContent';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const redirect = combineQueryValue(params.redirect) || '/';
  const error = combineQueryValue(params.error);

  return (
    <AuthPageContent
      initialMode="signin"
      title="Welcome Back"
      subtitle="Log in to continue shopping with ElectroCart."
      redirect={redirect}
      error={error}
    />
  );
}