import { Link } from '@tanstack/react-router'
import { FileStack } from 'lucide-react'

export default function Header() {
  return (
    <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-blue-light to-brand-blue flex items-center justify-center">
          <FileStack className="w-5 h-5 text-white" />
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
          Login
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors">
          Sign up
        </button>
      </div>
    </header>
  )
}
