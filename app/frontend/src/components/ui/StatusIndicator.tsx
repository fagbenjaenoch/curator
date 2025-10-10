export default function StatusIndicator(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <span {...props} className="relative inline-flex items-center">
      <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 animate-ping"></span>
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
    </span>
  );
}
