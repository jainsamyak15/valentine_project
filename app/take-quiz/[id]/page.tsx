import TakeQuizClient from './TakeQuizClient';

// This is a server component that handles static params
export async function generateStaticParams() {
  const { data: quizzes } = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quizzes?select=id`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
    }
  ).then(res => res.json());

  return (quizzes || []).map((quiz: { id: string }) => ({
    id: quiz.id,
  }));
}

// Server component that renders the client component
export default function TakeQuizPage({ params }: { params: { id: string } }) {
  return <TakeQuizClient params={params} />;
}