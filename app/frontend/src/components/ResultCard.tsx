interface ResultCardProps {
  title: string;
}

export default function ResultCard({ title }: ResultCardProps) {
  return <div className="p-4 shadow-md">{title}</div>;
}
