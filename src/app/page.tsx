'use client'

import CustomNode from '@components/CustomNode'
import GroupNode from '@components/GroupNode'
import React, { useCallback, useState, useMemo, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeChange,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface CustomNodeData {
  label: string
  onDetach?: () => void
  onDelete?: () => void
  parentGroupId?: string
}

interface GroupNodeData {
  label: string
}

const INITIAL_GROUP_NODE: Node<GroupNodeData> = {
  id: 'group',
  type: 'group',
  position: { x: 100, y: 100 },
  data: { label: 'Group' },
  style: { width: 600, height: 400 },
}

export default function DynamicGrouping() {
  const [nodes, setNodes, onNodesChange] = useNodesState([INITIAL_GROUP_NODE])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([])
  const [nodeCounter, setNodeCounter] = useState<number>(1)

  const groupPosRef = useRef<{ x: number; y: number }>(
    INITIAL_GROUP_NODE.position
  )

  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
      group: GroupNode,
    }),
    []
  )

  const onNodesChangeCustom = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes)

      changes.forEach((change) => {
        if (change.type === 'position' && change.id === 'group') {
          const groupNode = nodes.find(
            (existingNode) => existingNode.id === 'group'
          )
          if (!groupNode) return

          const prevPos = groupPosRef.current
          const newPos = groupNode.position
          const dx = newPos.x - prevPos.x
          const dy = newPos.y - prevPos.y

          groupPosRef.current = { ...newPos }

          setNodes((prevNodes) =>
            prevNodes.map((existingNode: Node) => {
              if (existingNode.data?.parentGroupId === 'group') {
                return {
                  ...existingNode,
                  position: {
                    x: existingNode.position.x + dx,
                    y: existingNode.position.y + dy,
                  },
                }
              }
              return existingNode
            })
          )
        }
      })
    },
    [onNodesChange, nodes, setNodes]
  )

  const handleDetach = useCallback(
    (nodeId: string): void => {
      setNodes((prevNodes) =>
        prevNodes.map((existingNode: Node) => {
          if (existingNode.id === nodeId) {
            const newData = { ...existingNode.data }
            delete newData.parentGroupId
            return { ...existingNode, data: newData }
          }

          return existingNode
        })
      )
    },
    [setNodes]
  )

  const handleDelete = useCallback(
    (nodeId: string): void => {
      setNodes((prevNodes) =>
        prevNodes.filter((existingNode) => existingNode.id !== nodeId)
      )

      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      )
    },
    [setNodes, setEdges]
  )

  const addNode = useCallback((): void => {
    const id = `node-${nodeCounter}`

    setNodeCounter((prev) => prev + 1)

    const newNode: Node<CustomNodeData> = {
      id,
      type: 'custom',
      position: {
        x: Math.random() * 800,
        y: Math.random() * 800,
      },
      data: {
        label: `Node ${nodeCounter}`,
        onDetach: () => handleDetach(id),
        onDelete: () => handleDelete(id),
      },
    }

    setNodes((prevNodes) => [...prevNodes, newNode])
  }, [nodeCounter, handleDetach, handleDelete, setNodes])

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const nodeWidth = 150
      const nodeHeight = 50

      if (node.data?.parentGroupId === 'group') {
        const groupNode = nodes.find(
          (existingNode: Node) => existingNode.id === 'group'
        )
        if (!groupNode) return

        const { x: groupX, y: groupY } = groupNode.position
        const { width: groupWidth, height: groupHeight } = groupNode.style as {
          width: number
          height: number
        }

        let newX = node.position.x
        let newY = node.position.y

        newX = Math.max(newX, groupX)
        newX = Math.min(newX, groupX + groupWidth - nodeWidth)
        newY = Math.max(newY, groupY)
        newY = Math.min(newY, groupY + groupHeight - nodeHeight)

        if (newX !== node.position.x || newY !== node.position.y) {
          setNodes((prevNodes) =>
            prevNodes.map((existingNode) =>
              existingNode.id === node.id
                ? { ...existingNode, position: { x: newX, y: newY } }
                : existingNode
            )
          )
        }
      }
    },
    [nodes, setNodes]
  )

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (!node.data?.parentGroupId && node.type === 'custom') {
        const groupNode = nodes.find(
          (existingNode) => existingNode.id === 'group'
        )
        if (!groupNode) return
        const { x: groupX, y: groupY } = groupNode.position
        const { width: groupWidth, height: groupHeight } = groupNode.style as {
          width: number
          height: number
        }
        const nodeWidth = 150
        const nodeHeight = 50

        if (
          node.position.x >= groupX &&
          node.position.x + nodeWidth <= groupX + groupWidth &&
          node.position.y >= groupY &&
          node.position.y + nodeHeight <= groupY + groupHeight
        ) {
          setNodes((prevNodes) =>
            prevNodes.map((existingNode) =>
              existingNode.id === node.id
                ? {
                    ...existingNode,
                    data: { ...existingNode.data, parentGroupId: 'group' },
                  }
                : existingNode
            )
          )
        }
      }
    },
    [nodes, setNodes]
  )

  return (
    <div className='h-screen w-screen bg-neutral-900 px-4 py-10 text-neutral-100'>
      <h1 className='text-white-400 mb-4 text-center text-2xl font-bold'>
        Dynamic Grouping
      </h1>
      <button
        className='mb-2 block w-40  rounded bg-blue-600 px-4 py-2 hover:bg-blue-500'
        onClick={addNode}
      >
        Add Node
      </button>

      <div className='h-[800px] flex-1 rounded bg-neutral-700 shadow'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeCustom}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          className='h-full w-full'
        >
          <MiniMap />
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
