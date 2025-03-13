import { useState } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

interface CustomNodeData {
  label: string
  onDetach?: () => void
  onDelete?: () => void
  parentGroupId?: string
}

export default function CustomNode({ data }: NodeProps<CustomNodeData>) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowTooltip((prev) => !prev)
    e.stopPropagation()
  }

  return (
    <div
      onClick={handleClick}
      className='relative flex h-[50px] w-[150px] items-center justify-center rounded border border-neutral-300 bg-white px-4 py-2 text-center text-neutral-900'
    >
      {data.label || 'Node'}
      <Handle
        type='source'
        position={Position.Right}
        className='bg-neutral-500'
      />
      <Handle
        type='target'
        position={Position.Left}
        className='bg-neutral-500'
      />
      {showTooltip && (
        <div className='absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 rounded-lg border border-gray-300 bg-white p-2 shadow-md'>
          {data.parentGroupId && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                data.onDetach && data.onDetach()
                setShowTooltip(false)
              }}
              className='mb-1 mr-2 w-full rounded bg-blue-500 px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-blue-600'
            >
              Detach
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              data.onDelete && data.onDelete()
              setShowTooltip(false)
            }}
            className='w-full rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-red-600'
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
