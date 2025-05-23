import { AIOrb } from '@/components/Orb'

function LogomarkPaths() {
  return (
    <g fill="#38BDF8">
      <path d="M10 25a7 7 0 0 1 0-14 8 8 0 0 1 15-3 5 5 0 1 1 3 9H10z" />
    </g>
  )
}

export function Logomark(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" {...props}>
      <LogomarkPaths />
    </svg>
  )
}

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <div className="flex items-center">
      <AIOrb size="small" />
    </div>
  )
}
