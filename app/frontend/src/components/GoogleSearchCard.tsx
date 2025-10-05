import GoogleColored from "./ui/GoogleColored";

export default function GoogleSearchCard({ keyword }: { keyword: string }) {
  const searchURL = `https://google.com/search?q=${encodeURIComponent(keyword)}`;

  return (
    <a
      className="border p-4 rounded-md bg-gray-200"
      href={searchURL}
      target="_blank"
    >
      <span className="flex items-center gap-2">
        <GoogleColored />
        {keyword}
      </span>
    </a>
  );
}
