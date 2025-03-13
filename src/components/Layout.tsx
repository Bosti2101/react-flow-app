'use client'

import React from 'react'
import { ReactFlowProvider } from 'reactflow'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <ReactFlowProvider>{children} </ReactFlowProvider>
}

export default Layout
