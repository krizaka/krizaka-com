import LegalPage, { legalMetadata, type LegalPageProps } from "@/app/components/LegalPage";

export const generateMetadata = (props: LegalPageProps) => legalMetadata(props, "privacy");

export default async function Page({ params }: LegalPageProps) {
  const { locale } = await params;
  return <LegalPage locale={locale} page="privacy" />;
}
