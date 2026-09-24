import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/shared/lib'

export function Container({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
    return <div className={cn('mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-16', className)} {...rest} />
}
