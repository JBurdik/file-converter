export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border-light px-10 py-5 flex items-center justify-between text-xs text-[#666666]">
      <nav className="flex items-center gap-6">
        <a href="#" className="hover:text-text-primary transition-colors">
          About
        </a>
        <a href="#" className="hover:text-text-primary transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-text-primary transition-colors">
          Privacy
        </a>
      </nav>

      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
          C
        </span>
        <span>Copyright 2006 - {currentYear} FileIT Ltd. All Rights Reserved</span>
      </div>
    </footer>
  )
}
