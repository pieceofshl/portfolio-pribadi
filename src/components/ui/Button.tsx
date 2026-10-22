import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { buttonStyles, type ButtonSize, type ButtonVariant } from './buttonStyles'

type StyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />
}

type ButtonLinkProps = StyleOptions & {
  to: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

/** Tautan internal (React Router) dengan tampilan tombol. */
export function ButtonLink({
  to,
  children,
  variant,
  size,
  className,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonStyles({ variant, size, className })} onClick={onClick}>
      {children}
    </Link>
  )
}
