import { combineQueryValue } from '@/lib/utils';
import AuthPageContent from '@/components/auth/AuthPageContent';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const redirect = combineQueryValue(params.redirect) || '/';

  return (
    <AuthPageContent
      initialMode="register"
      title="Create Your Account"
      subtitle="Join ElectroCart and start shopping smart."
      redirect={redirect}
    />
  );
}