import { Button } from "@/components/ui/button"

type link = {
  href: string,
  title: string
}
type links = link[]

const links: links = [
  {
    href: "#",
    title: "Home"
  },
  {
    href: "#",
    title: "About"
  },
]


export default function Navbar() {
  return (
    <div className="p-8 flex justify-between bg-amber-300 text-black">
      <span>Navbar</span>
      <div className="flex gap-2">
        {links.map((link) => <Button variant={"ghost"} key={link.title} asChild><a href={link.href}>{link.title}</a></Button>)}
      </div>
    </div>
  )
}
