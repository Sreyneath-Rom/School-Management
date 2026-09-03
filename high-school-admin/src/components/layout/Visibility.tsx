import type { ReactNode } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
export interface ShowProps { children: ReactNode; only: 'mobile' | 'tablet' | 'desktop'; fallback?: ReactNode }
export interface HideProps extends ShowProps {}
export function Show({ children, only, fallback = null }: ShowProps) { const { isMobile, isTablet, isDesktop } = useResponsive(); const visible = only === 'mobile' ? isMobile : only === 'tablet' ? isTablet : isDesktop; return visible ? <>{children}</> : <>{fallback}</> }
export function Hide({ children, only, fallback = null }: HideProps) {
	const { isMobile, isTablet, isDesktop } = useResponsive()
	const matches = only === 'mobile' ? isMobile : only === 'tablet' ? isTablet : isDesktop
	return matches ? <>{fallback}</> : <>{children}</>
}
