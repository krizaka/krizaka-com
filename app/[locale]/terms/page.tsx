import LegalPage, { legalMetadata, type LegalPageProps } from "@/app/components/LegalPage";

export const generateMetadata = (props: LegalPageProps) => legalMetadata(props, "terms");

export default async function Page({ params }: Readonly<LegalPageProps>) {
  const { locale } = await params;
  return <LegalPage locale={locale} page="terms" />;
}
