import React, { useEffect, useRef } from 'react'
import { useHistory } from '@docusaurus/router'
import styles from './styles.module.css'
import { Network, Options, Data } from 'vis-network'
import { DataSet } from 'vis-data'

// Define interfaces for our nodes and edges
export interface CPUNode {
  id: number
  label: string
  group: string
  title: string
}

export interface CPUEdge {
  from: number
  to: number
  arrows: string
  dashes: boolean
  title?: string
  id?: string | number
}

interface GroupStyle {
  color: {
    background: string
    border: string
  }
}

export interface PageMap {
  [nodeId: number]: string
}

interface ProductChartProps {
  nodes: CPUNode[]
  edges: CPUEdge[]
  pageMap?: PageMap
  groupColors?: {
    [key: string]: {
      color: string
      label: string
    }
  }
}

export default function ProductChart({
  nodes: nodesToUse,
  edges: edgesToUse,
  pageMap = {},
  groupColors = {
    gs464v: { color: '#97C2FC', label: 'GS464V 微架构 (2021)' },
    la664: { color: '#FB7E81', label: 'LA664 微架构 (2023-2024)' },
    la864: { color: '#7BE141', label: 'LA864 微架构 (2025)' }
  }
}: ProductChartProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const history = useHistory()

  useEffect(() => {
    // Only run if window and document are available (client-side)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Dynamic import to avoid SSR issues with Docusaurus
      import('vis-network').then(({ Network }) => {
        import('vis-data').then(({ DataSet }) => {
          // Define CPU node groups by microarchitecture
          const groups: Record<string, GroupStyle> = {}

          // Set up groups based on the provided group colors
          Object.entries(groupColors).forEach(([groupKey, { color }]) => {
            groups[groupKey] = {
              color: {
                background: color,
                border: getBorderColor(color)
              }
            }
          })

          // CPU data with relationships
          const nodes = new DataSet<CPUNode>(nodesToUse)
          const edges = new DataSet<CPUEdge>(edgesToUse)

          // Configuration for the visualization
          const options: Options = {
            nodes: {
              shape: 'box',
              font: {
                face: 'monospace',
                size: 14,
              },
              shadow: true,
              margin: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
              },
            },
            edges: {
              width: 2,
              smooth: {
                enabled: true,
                type: 'discrete',
                forceDirection: 'horizontal',
                roundness: 0.5
              },
            },
            layout: {
              hierarchical: {
                direction: 'LR',
                sortMethod: 'directed',
                levelSeparation: 150,
                nodeSpacing: 120,
              },
            },
            physics: {
              enabled: false,
            },
            groups: groups,
            height: '500px',
            interaction: {
              dragNodes: false,
              hover: true,
              tooltipDelay: 200,
              zoomView: false,
            },
          }

          // Create network
          if (containerRef.current) {
            const network = new Network(
              containerRef.current,
              { nodes, edges } as unknown as Data,
              options
            )

            // Handle click events
            network.on('click', function(params) {
              if (params.nodes.length > 0) {
                const nodeId = params.nodes[0]
                const node = nodes.get(nodeId)

                if (pageMap[nodeId]) {
                  history.push(pageMap[nodeId])
                }
              }
            })

            // Change cursor on hover
            network.on('hoverNode', function() {
              if (containerRef.current) {
                containerRef.current.style.cursor = 'pointer'
              }
            })

            network.on('blurNode', function() {
              if (containerRef.current) {
                containerRef.current.style.cursor = 'default'
              }
            })
          }
        })
      })
    }
  }, [history, nodesToUse, edgesToUse, pageMap, groupColors])

  // Create a legend from the groupColors object
  const legendItems = Object.entries(groupColors).map(([groupKey, { color, label }]) => (
    <div className={styles.legendItem} key={groupKey}>
      <div className={styles.legendColor} style={{ backgroundColor: color }}></div>
      <span>{label}</span>
    </div>
  ))

  return (
    <div className={styles.chartContainer}>
      <div className={styles.legend}>
        {legendItems}
      </div>
      <div ref={containerRef} className={styles.visNetwork}></div>
      <p className={styles.chartNote}>点击各个处理器节点查看详细信息</p>
    </div>
  )
}

// Helper function to generate border colors
function getBorderColor(backgroundColor: string): string {
  // Simple darkening algorithm - this could be improved
  if (backgroundColor.startsWith('#')) {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);

    // Darken the color by 20%
    const darkeningFactor = 0.7;
    const darkR = Math.floor(r * darkeningFactor);
    const darkG = Math.floor(g * darkeningFactor);
    const darkB = Math.floor(b * darkeningFactor);

    return `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
  }

  return '#000000';
}
