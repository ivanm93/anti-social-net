const colors = [
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#FAECE7', color: '#993C1D' },
  { bg: '#FBEAF0', color: '#993556' },
  { bg: '#FAEEDA', color: '#854F0B' },
]

function hashIndex(str = '') {
  return str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
}

export default function TagBadge({ name, onClick }) {
  const { bg, color } = colors[hashIndex(name)]
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: bg,
        color,
        cursor: onClick ? 'pointer' : 'default',
        marginRight: 4,
        marginBottom: 4,
      }}
    >
      #{name}
    </span>
  )
}