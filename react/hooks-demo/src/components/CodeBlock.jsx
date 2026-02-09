import { Highlight, themes } from 'prism-react-renderer'

function CodeBlock({ code }) {
  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language="jsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            margin: 0,
            padding: '20px',
            fontSize: '13px',
            lineHeight: '1.6',
            overflow: 'auto',
            height: '100%',
            background: '#011627',
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span
                style={{
                  display: 'inline-block',
                  width: '40px',
                  color: '#546e7a',
                  textAlign: 'right',
                  paddingRight: '16px',
                  userSelect: 'none',
                }}
              >
                {i + 1}
              </span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
