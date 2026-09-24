import { Fragment, type ElementType } from 'react'

type RevealTextProps = {
    text: string
    as?: ElementType
    className?: string
    /** `scroll` (default) is scrubbed by scroll-reveal; `intro` is played by its owner. */
    trigger?: 'scroll' | 'intro'
    id?: string
}

/**
 * Text revealed word by word — each word rises out of a blur — without a paid
 * SplitText. React renders the words (so hydration and locale changes stay
 * React's business); the reveal feature animates them.
 *
 * No clipping masks: the blur has to spill past each word's box to read as
 * focus being pulled, not as a word being wiped in. The spaces sit outside the
 * word spans, since whitespace at the end of an inline-block collapses.
 */
export function RevealText({ text, as: Tag = 'p', className, trigger = 'scroll', id }: RevealTextProps) {
    const words = text.split(/\s+/).filter(Boolean)

    return (
        <Tag id={id} className={className} data-reveal="lines" data-reveal-trigger={trigger}>
            {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                    <span data-word className="inline-block">
                        <span data-word-inner className="inline-block">
                            {word}
                        </span>
                    </span>
                    {index < words.length - 1 ? ' ' : null}
                </Fragment>
            ))}
        </Tag>
    )
}
